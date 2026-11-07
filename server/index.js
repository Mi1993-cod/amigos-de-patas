import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    projeto: "Amigos de Patas",
    mensagem: "API funcionando corretamente!",
  });
});

app.listen(PORT, () => {
  console.log(`API Amigos de Patas rodando na porta ${PORT}`);
});
