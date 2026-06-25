const { z } = require("zod");

const statusEnum = z.enum(["A fazer", "Em andamento", "Concluido"], {
  error: "Status invalido.",
});

const criarTarefaSchema = z.object({
  titulo: z.string().trim().min(3, "Titulo deve ter pelo menos 3 caracteres."),
  descricao: z.string().trim().optional(),
  status: statusEnum.optional(),
});

const atualizarStatusSchema = z.object({
  status: statusEnum,
});

module.exports = {
  STATUS_VALIDOS: statusEnum.options,
  criarTarefaSchema,
  atualizarStatusSchema,
};
