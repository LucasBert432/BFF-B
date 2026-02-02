const express = require("express");
const router = express.Router();

// Armazenamento em memória para demonstração
const users = {};

// Rota de login - VERSÃO FLEXÍVEL PARA DEMO
router.post("/login", async (req, res, next) => {
  try {
    const { cpf, password } = req.body;

    console.log("📱 Login attempt:", {
      cpf: cpf ? "CPF fornecido" : "Sem CPF",
      passwordLength: password?.length || 0,
    });

    // Validação básica
    if (!cpf || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: "CPF e senha são obrigatórios",
          code: "MISSING_CREDENTIALS",
        },
      });
    }

    // Normalizar CPF (remover pontos e traços)
    const cleanedCPF = cpf.replace(/\D/g, "");

    console.log("🧹 Cleaned CPF:", cleanedCPF);
    console.log("👥 Existing users:", Object.keys(users));

    // Verificar se o usuário existe
    let user = users[cleanedCPF];

    // Se não existir, verificar se é o usuário demo
    if (!user) {
      // Usuário demo padrão (qualquer CPF com qualquer senha funciona)
      if (cleanedCPF.length === 11) {
        user = {
          id: `user-${Date.now()}`,
          name: "Lucas Souza",
          email: "lucas.souza@email.com",
          cpf: cleanedCPF,
          accountNumber: "00012345-6",
          branch: "0001",
          clientSince: "2020-05-15",
          tier: "Black",
          token: `demo-token-${Date.now()}`,
        };
        users[cleanedCPF] = user; // Armazenar para futuros logins
      }
    }

    // Para DEMO: Aceitar QUALQUER senha para qualquer usuário
    // Em produção, você validaria a senha corretamente
    if (!user) {
      console.log("❌ Usuário não encontrado");
      return res.status(401).json({
        success: false,
        error: {
          message: "CPF não encontrado",
          code: "USER_NOT_FOUND",
        },
      });
    }

    console.log("✅ Login bem-sucedido para:", user.name);

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          cpf: cleanedCPF,
        },
        token: user.token,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno no servidor",
        code: "INTERNAL_ERROR",
      },
    });
  }
});

// Rota de registro - VERSÃO SIMPLIFICADA
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, cpf, phone, country, password } = req.body;

    console.log("📝 Registration attempt:", {
      name,
      email,
      cpf: cpf ? cpf.replace(/\D/g, "") : "empty",
      phone: phone ? phone.replace(/\D/g, "") : "empty",
      country,
    });

    // Validação básica
    const requiredFields = [
      "name",
      "email",
      "cpf",
      "phone",
      "country",
      "password",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Campos obrigatórios: ${missingFields.join(", ")}`,
          code: "MISSING_FIELDS",
        },
      });
    }

    // Limpar CPF
    const cleanedCPF = cpf.replace(/\D/g, "");

    // Verificar se CPF já existe
    if (users[cleanedCPF]) {
      return res.status(409).json({
        success: false,
        error: {
          message: "CPF já cadastrado",
          code: "CPF_ALREADY_EXISTS",
        },
      });
    }

    // Gerar número de conta aleatório
    const generateAccountNumber = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const userData = {
      id: `user-${Date.now()}`,
      name,
      email,
      cpf: cleanedCPF,
      phone: phone.replace(/\D/g, ""),
      country,
      accountNumber: generateAccountNumber(),
      branch: "0001",
      clientSince: new Date().toISOString().split("T")[0],
      tier: "Standard",
      createdAt: new Date().toISOString(),
      token: `demo-token-${Date.now()}`,
    };

    // Salvar usuário
    users[cleanedCPF] = userData;

    console.log("✅ User registered successfully:", userData.name);
    console.log("👥 Total users:", Object.keys(users).length);

    res.status(201).json({
      success: true,
      data: {
        user: userData,
        token: userData.token,
        message: "Conta criada com sucesso!",
      },
    });
  } catch (error) {
    console.error("🔥 Registration error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno no servidor",
        code: "INTERNAL_ERROR",
      },
    });
  }
});

// Rota de logout
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout realizado com sucesso",
  });
});

// Verificar token
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  console.log(
    "🔐 Token verification attempt:",
    token ? "Token provided" : "No token",
  );

  if (token && token.startsWith("demo-token")) {
    // Encontrar usuário pelo token
    const user = Object.values(users).find((u) => u.token === token);

    if (user) {
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
    }
  }

  res.status(401).json({
    success: false,
    error: {
      message: "Token inválido ou expirado",
      code: "INVALID_TOKEN",
    },
  });
});

// Listar usuários (apenas para debug)
router.get("/users", (req, res) => {
  res.json({
    success: true,
    data: {
      count: Object.keys(users).length,
      users: Object.values(users).map((u) => ({
        name: u.name,
        cpf: u.cpf,
        email: u.email,
        accountNumber: u.accountNumber,
      })),
    },
  });
});

module.exports = router;
