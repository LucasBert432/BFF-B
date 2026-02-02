const express = require("express");
const router = express.Router();

const users = {};

router.post("/register", (req, res) => {
  const { name, cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ success: false });
  }

  users[cpf] = {
    id: Date.now(),
    name,
    cpf,
    token: `demo-token-${Date.now()}`,
  };

  res.status(201).json({
    success: true,
    data: users[cpf],
  });
});

router.post("/login", (req, res) => {
  const { cpf } = req.body;
  const user = users[cpf];

  if (!user) {
    return res.status(401).json({ success: false });
  }

  res.json({
    success: true,
    data: user,
  });
});

module.exports = router;
