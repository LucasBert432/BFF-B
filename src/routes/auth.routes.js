const express = require("express");
const router = express.Router();

// Armazenamento em memória (DEMO)
const users = {};

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: "CPF e senha são obrigatórios",
          code: "MISSING_CREDENTIALS",
        },
      });
    }

    const cleanedCPF = cpf.replace(/\D/g, "");

    let user = users[cleanedCPF];

    // Usuário DEMO automático
    if (!user && cleanedCPF.length === 11) {
      user = {
        id: `user-${Date.now()}`,
        name: "Lucas Souza",
        email: "lucas.souza@email.com",
        cpf: cleanedCPF,
        phone: "00000000000",
        country: "BR",
        accountNumber: "00012345-6",
        branch: "0001",
        clientSince: "2020-05-15",
        tier: "Black",
        createdAt: new Date().toISOString(),
        token: `demo-token-${Date.now()}`,
      };

      users[cleanedCPF] = user;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: "CPF não encontrado",
          code: "USER_NOT_FOUND",
        },
      });
    }

    return res.json({
      success: true,
      data: {
        user,
        token: user.token,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Erro interno no servidor",
        code: "INTERNAL_ERROR",
      },
    });
  }
});

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, cpf, phone, country, password } = req.body;

    const required = { name, email, cpf, phone, country, password };
    const missing = Object.entries(required)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Campos obrigatórios: ${missing.join(", ")}`,
          code: "MISSING_FIELDS",
        },
      });
    }

    const cleanedCPF = cpf.replace(/\D/g, "");

    if (users[cleanedCPF]) {
      return res.status(409).json({
        success: false,
        error: {
          message: "CPF já cadastrado",
          code: "CPF_ALREADY_EXISTS",
        },
      });
    }

    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      cpf: cleanedCPF,
      phone: phone.replace(/\D/g, ""),
      country,
      accountNumber: Math.floor(10000000 + Math.random() * 90000000).toString(),
      branch: "0001",
      clientSince: new Date().toISOString().split("T")[0],
      tier: "Standard",
      createdAt: new Date().toISOString(),
      token: `demo-token-${Date.now()}`,
    };

    users[cleanedCPF] = user;

    return res.status(201).json({
      success: true,
      data: {
        user,
        token: user.token,
        message: "Conta criada com sucesso!",
      },
    });
  } catch (error) {
    console.error("🔥 Register error:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Erro interno no servidor",
        code: "INTERNAL_ERROR",
      },
    });
  }
});

/* =========================
   LOGOUT
========================= */
router.post("/logout", (_req, res) => {
  return res.json({
    success: true,
    message: "Logout realizado com sucesso",
  });
});

/* =========================
   VERIFY TOKEN
========================= */
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !token.startsWith("demo-token")) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Token inválido ou expirado",
        code: "INVALID_TOKEN",
      },
    });
  }

  const user = Object.values(users).find((u) => u.token === token);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Usuário não encontrado",
        code: "USER_NOT_FOUND",
      },
    });
  }

  return res.json({
    success: true,
    data: {
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
      },
    },
  });
});

/* =========================
   DEBUG
========================= */
router.get("/users", (_req, res) => {
  return res.json({
    success: true,
    data: {
      count: Object.keys(users).length,
      users: Object.values(users),
    },
  });
});

module.exports = router;
