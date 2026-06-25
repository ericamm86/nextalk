const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  STATUS_VALIDOS,
  atualizarStatusSchema,
  criarTarefaSchema,
} = require("../schemas/tarefaSchemas");
const { validateBody } = require("../utils/validation");

const router = express.Router();

router.post("/criar", authMiddleware, async (req, res) => {
  const validation = validateBody(criarTarefaSchema, req.body);

  if (validation.error) {
    return res.status(400).json({
      error: "Dados invalidos.",
      detalhes: validation.error,
    });
  }

  const { titulo, descricao, status } = validation.data;
  const usuarioId = req.usuario.id;
  const statusFinal = status || "A fazer";

  try {
    const novaTarefa = await pool.query(
      `INSERT INTO tarefas (titulo, descricao, status, usuario_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, titulo, descricao, status, usuario_id, data_criacao`,
      [titulo, descricao || null, statusFinal, usuarioId]
    );

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      tarefa: novaTarefa.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao criar tarefa.",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const tarefas = await pool.query(
      `SELECT id, titulo, descricao, status, usuario_id, data_criacao
       FROM tarefas
       WHERE usuario_id = $1
       ORDER BY data_criacao DESC`,
      [usuarioId]
    );

    return res.json({
      tarefas: tarefas.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao listar tarefas.",
    });
  }
});

router.patch("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;
  const validation = validateBody(atualizarStatusSchema, req.body);

  if (validation.error) {
    return res.status(400).json({
      error: "Dados invalidos.",
      detalhes: validation.error,
      valores_aceitos: STATUS_VALIDOS,
    });
  }

  const { status } = validation.data;

  try {
    const tarefaAtualizada = await pool.query(
      `UPDATE tarefas
       SET status = $1
       WHERE id = $2 AND usuario_id = $3
       RETURNING id, titulo, descricao, status, usuario_id, data_criacao`,
      [status, id, usuarioId]
    );

    if (tarefaAtualizada.rows.length === 0) {
      return res.status(404).json({
        error: "Tarefa nao encontrada.",
      });
    }

    return res.json({
      message: "Status da tarefa atualizado com sucesso!",
      tarefa: tarefaAtualizada.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao atualizar tarefa.",
    });
  }
});

module.exports = router;
