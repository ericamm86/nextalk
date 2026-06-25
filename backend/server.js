const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./src/routes/authController");
const tarefasRoutes = require("./src/routes/tarefasController");
const pontoRoutes = require("./src/routes/pontoController");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "NexTalk API rodando localmente",
    status: "online",
  });
});

app.use("/auth", authRoutes);
app.use("/tarefas", tarefasRoutes);
app.use("/ponto", pontoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor NexTalk rodando em http://localhost:${PORT}`);
});
