function validateBody(schema, body) {
  const result = schema.safeParse(body);

  if (result.success) {
    return {
      data: result.data,
      error: null,
    };
  }

  const errors = result.error.issues.map((issue) => ({
    campo: issue.path.join("."),
    mensagem: issue.message,
  }));

  return {
    data: null,
    error: errors,
  };
}

module.exports = {
  validateBody,
};
