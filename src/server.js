const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ service: "bff-financeiro", status: "running" });
});

app.get("/debug", (_, res) => {
  res.json({ message: "BFF funcionando" });
});

/** 🔑 AQUI */
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("*", (_, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 BFF rodando na porta ${PORT}`));
