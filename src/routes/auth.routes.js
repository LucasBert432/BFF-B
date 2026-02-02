const express = require("express");
const router = express.Router();

const DEMO_USER = {
  id: "user-demo-001",
  name: "Lucas Roberto da Silva de Souza",
  email: "lucasroberto432@gmail.com",
  cpf: "16495660774",
  phone: "41988656115",
  country: "BR",
  accountNumber: "00012345-6",
  branch: "0001",
  tier: "Standard",
  clientSince: "2024-01-01",
};

const DEMO_PASSWORD = "123456";
const DEMO_TOKEN = "demo-token";

router.post("/register", (req, res) => {
  console.log("📝 REGISTER (demo)", req.body);

  return res.status(200).json({
    success: true,
    data: {
      user: DEMO_USER,
      token: DEMO_TOKEN,
      message: "Conta criada com sucesso!",
    },
  });
});

router.post("/login", (req, res) => {
  const { cpf, password } = req.body;

  console.log("🔐 LOGIN attempt:", { cpf });

  if (cpf !== DEMO_USER.cpf || password !== DEMO_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: {
        message: "CPF ou senha inválidos",
        code: "INVALID_CREDENTIALS",
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: DEMO_USER,
      token: DEMO_TOKEN,
    },
  });
});

router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token !== DEMO_TOKEN) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Token inválido",
        code: "INVALID_TOKEN",
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      valid: true,
      user: DEMO_USER,
    },
  });
});

router.post("/logout", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout realizado com sucesso",
  });
});

module.exports = router;
