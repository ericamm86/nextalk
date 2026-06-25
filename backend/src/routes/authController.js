const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { loginSchema, registerSchema } = require("../schemas/authSchemas");
const { validateBody } = require("../utils/validation");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_provisoria_nextalk";

router.post("/register", async (req, res) => {
  const validation = validateBody(registerSchema, req.body);

  if (validation.error) {
    return res.status(400).json({
      error: "Dados invalidos.",
      detalhes: validation.error,
    });
  }

  const { nome, email, senha, cargo } = validation.data;

  try {
    const userExists = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: "Este e-mail ja esta cadastrado.",
      });
    }

    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    const novoUsuario = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, cargo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, cargo",
      [nome, email, senhaCriptografada, cargo]
    );

    return res.status(201).json({
      message: "Funcionario cadastrado com sucesso!",
      usuario: novoUsuario.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar funcionario.",
    });
  }
});

router.post("/login", async (req, res) => {
  const validation = validateBody(loginSchema, req.body);

  if (validation.error) {
    return res.status(400).json({
      error: "Dados invalidos.",
      detalhes: validation.error,
    });
  }

  const { email, senha } = validation.data;

  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({
        error: "E-mail ou senha incorretos.",
      });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({
        error: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      { id: usuario.id, cargo: usuario.cargo },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        cargo: usuario.cargo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao realizar login.",
    });
  }
});

module.exports = router;
