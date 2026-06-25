const { z } = require("zod");

const registerSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().trim().email("E-mail invalido.").toLowerCase(),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
  cargo: z.string().trim().min(2, "Cargo deve ter pelo menos 2 caracteres."),
});

const loginSchema = z.object({
  email: z.string().trim().email("E-mail invalido.").toLowerCase(),
  senha: z.string().min(1, "Senha e obrigatoria."),
});

module.exports = {
  registerSchema,
  loginSchema,
};
