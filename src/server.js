const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

/* ================== ROUTES ================== */
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "bff-financeiro" });
});

app.use("/api/auth", require("./routes/auth.routes"));

/* ================== START SERVER ================== */
const PORT = Number(process.env.PORT || 8080);

console.log("🔥 Booting server");
console.log("🌍 PORT:", PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
