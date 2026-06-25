const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const { baterPontoSchema, TIPOS_VALIDOS } = require("../schemas/pontoSchemas");
const { validateBody } = require("../utils/validation");

const router = express.Router();

router.post("/bater", authMiddleware, async (req, res) => {
  const validation = validateBody(baterPontoSchema, req.body);

  if (validation.error) {
    return res.status(400).json({
      error: "Dados invalidos.",
      detalhes: validation.error,
      valores_aceitos: TIPOS_VALIDOS,
    });
  }

  const { tipo } = validation.data;
  const usuarioId = req.usuario.id;

  try {
    const novoRegistro = await pool.query(
      `INSERT INTO ponto (usuario_id, tipo)
       VALUES ($1, $2)
       RETURNING id, usuario_id, data_hora, tipo`,
      [usuarioId, tipo]
    );

    return res.status(201).json({
      message: "Ponto registrado com sucesso!",
      ponto: novoRegistro.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao registrar ponto.",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const registros = await pool.query(
      `SELECT id, usuario_id, data_hora, tipo
       FROM ponto
       WHERE usuario_id = $1
       ORDER BY data_hora DESC`,
      [usuarioId]
    );

    return res.json({
      registros: registros.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao listar registros de ponto.",
    });
  }
});

module.exports = router;
