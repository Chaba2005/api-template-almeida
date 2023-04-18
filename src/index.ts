import express from 'express';
import cors from 'cors';

import professores from './data/professores.json' assert { type: 'json' };
import { connection } from './db';
import { port } from './env';

const app = express();

app.use(
  cors({
    origin: '*', // aqui deveria estar o link do front-end
    optionsSuccessStatus: 200
  })
);

app.get('/', (_, res) => {
  res.send('Hello world!');
});

app.get('/api/professores', (_, res) => {
  res.send(professores.map((professor) => ({ nome: professor })));
});

app.get('api/echo/:text', (req, res) => {
  res.send(req.params.text);
});

app.get('/api/frutas', (_, res) => {
  connection.query('SELECT * FROM frutas').then(([rows]) => {
    res.send(rows);
  });
});

app.get('/api/cardapio/:data', (req, res) => {
  const data = req.params.data;
  connection.query(`SELECT principal,guarnicao,salada,sobremesa,suco,periodo,vegetariano FROM Cardapio WHERE data = ${data}`).then(([rows]) => {
    res.send(rows);
  });
});

app.post('/saldo', (req, res) => {
  // Obtenha o RA e a senha do corpo da requisição
  const { ra, senha } = req.body;

  // Verifique se o RA e a senha estão presentes na requisição
  if (!ra || !senha) {
    // Se não estiverem presentes, retorne um erro de requisição inválida
    return res.status(400).json({ error: 'RA e senha são obrigatórios.' });
  }

  // Faça a consulta ao banco de dados para obter o saldo relacionado ao RA e senha
  connection.query(
    'SELECT saldo FROM Saldo_RU WHERE ra = ? AND senha = ?',
    [ra, senha]).then(([rows]) => {
      res.send(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
