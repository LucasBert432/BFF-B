const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Authorization header missing",
        code: "UNAUTHORIZED",
      },
    });
  }

  const token = authHeader.replace("Bearer ", "");

  if (token.startsWith("demo-token")) {
    // Token válido para demo
    req.user = {
      id: "user-demo-001",
      name: "Lucas Roberto da Silva de Souza",
      account: "00012345-6",
    };

    return next();
  }

  return res.status(401).json({
    success: false,
    error: {
      message: "Invalid token",
      code: "INVALID_TOKEN",
    },
  });
};

module.exports = { authMiddleware };
