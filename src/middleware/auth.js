const authMiddleware = (req, res, next) => {
  // Simulação de autenticação - em produção usar JWT
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: {
        message: "Authorization header missing",
        code: "UNAUTHORIZED",
      },
    });
  }

  // Aqui você validaria o token JWT
  const token = authHeader.replace("Bearer ", "");

  if (token === "demo-token") {
    // Token válido para demo
    req.user = {
      id: "user-123",
      name: "Lucas Roberto",
      account: "00012345-6",
    };
    next();
  } else {
    res.status(401).json({
      error: {
        message: "Invalid token",
        code: "INVALID_TOKEN",
      },
    });
  }
};

module.exports = { authMiddleware };
