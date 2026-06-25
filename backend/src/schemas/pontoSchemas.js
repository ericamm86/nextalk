const { z } = require("zod");

const tipoEnum = z.enum(
  ["Entrada", "Intervalo Saida", "Intervalo Retorno", "Saida"],
  {
    error: "Tipo de ponto invalido.",
  }
);

const baterPontoSchema = z.object({
  tipo: tipoEnum,
});

module.exports = {
  TIPOS_VALIDOS: tipoEnum.options,
  baterPontoSchema,
};
