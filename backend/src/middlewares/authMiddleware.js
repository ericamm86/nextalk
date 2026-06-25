const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_provisoria_nextalk";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token de autenticacao nao informado.",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Formato de token invalido.",
    });
  }

  try {
    // O payload decodificado fica disponivel nas rotas protegidas.
    // Exemplo: req.usuario.id e req.usuario.cargo.
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token invalido ou expirado.",
    });
  }
}

module.exports = authMiddleware;
