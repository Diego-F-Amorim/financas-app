import express from "express";

const app = express();
const PORT = 3333;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "funcionando" });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});