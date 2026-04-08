// Importa as dependências necessárias
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Inicializa a aplicação Express
const app = express();

// Ativa CORS para permitir requisições de diferentes origens
app.use(cors());

// Configura o middleware para parsear JSON nas requisições
app.use(express.json());

// Conecta ao banco de dados SQLite (cria o arquivo se não existir)
const db = new sqlite3.Database("./gastos.db");

// Cria a tabela de gastos se ela não existir
// Estrutura: id (chave primária), descricao, valor, categoria e data
db.run(`
  CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT,
    valor REAL,
    categoria TEXT,
    data TEXT
  )
`);

// Rota POST para adicionar um novo gasto
// Recebe os dados via body: descricao, valor, categoria, data
app.post("/gastos", (req, res) => {
  const { descricao, valor, categoria, data } = req.body;

  // Insere o novo gasto no banco de dados
  db.run(
    "INSERT INTO gastos (descricao, valor, categoria, data) VALUES (?, ?, ?, ?)",
    [descricao, valor, categoria, data],
    function (err) {
      if (err) return res.status(500).json(err);

      // Retorna o ID do novo registro inserido
      res.json({ id: this.lastID });
    }
  );
});


// Rota GET para listar todos os gastos
app.get("/gastos", (req, res) => {
  db.all("SELECT * FROM gastos", [], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
});

// Inicia o servidor na porta 3001 e exibe mensagem de confirmação
app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
