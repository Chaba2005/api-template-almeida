import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

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

app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('Hello world!');
});

app.get('/api/professores', (_, res) => {
  res.send(professores.map((professor) => ({ nome: professor })));
});

app.get('api/echo/:text', (req, res) => {
  res.send(req.params.text);
});


app.get('/api/cardapio/:data', async(req, res) => {
  const data = req.params.data;
  console.log(data);

  try {
    const [rows] = await connection.query(
      "SELECT principal,guarnicao,salada,sobremesa,suco,periodo,vegetariano FROM Cardapio WHERE data = ?", [data]);
    res.send(rows);
  } catch (err) {
    res.status(404).json({ error: "Data não encontrada." });
  }
});

app.get('/api/saldo/:ra/:senha', async(req, res) => {
  const ra = req.params.ra;
  const senha = req.params.senha

  try {
    const [rows] = await connection.query(
      "SELECT Saldo FROM Saldo_RU WHERE RA = ? and Senha ?", [ra,senha]);
    res.send(rows);
  } catch (err) {
    res.status(404).json({ error: "Data não encontrada." });
  }
});

app.get('/api/cardapio/:data', async(req, res) => {
  const data = req.params.data;
  console.log(data);

  try {
    const [rows] = await connection.query(
      "SELECT principal,guarnicao,salada,sobremesa,suco,periodo,vegetariano FROM Cardapio WHERE data = ?", [data]);
    res.send(rows);
  } catch (err) {
    res.status(404).json({ error: "Data não encontrada." });
  }
});

app.post('/api/saldo', async(req, res) => {
  console.log(req.body);

  // Obtenha o RA e a senha do corpo da requisição
  // Verifique se o RA e a senha estão presentes na requisição
  if (!req.body?.ra || !req.body?.senha) {
    // Se não estiverem presentes, retorne um erro de requisição inválida
    return res.status(400).json({ parsedBody: req.body, error: 'RA e senha são obrigatórios.' });
  }

  const { ra, senha } = req.body;

  // Faça a consulta ao banc o de dados para obter o saldo relacionado ao RA e senha 
  try {
    const [rows] = await connection.query(
      'SELECT saldo FROM Saldo_RU WHERE ra = ? AND senha = ?', [ra, senha]);
    return res.send(rows);
  } catch (err) {
    return res.status(404).json({ error: 'Usuário não encontrado ou senha incorreta.' });
  }
});

/*
.then(([rows]) => {
      res.send(rows);
    }).catch(err => {
      res.status(404).json({ error: 'Usuário não encontrado ou senha incorreta' });
    })
*/

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
