const express = require('express');

const app = express();
app.use(express.json());

let todos = [];

app.get('/todos', (req, res) => {
  setTimeout(() => {
    res.send(todos);
  }, 5000);
});

app.put('/todos', (req, res) => {
  todos = req.body;

  res.send({ success: true });
});

app.listen(8081, () => console.log('Listening on port 8081'));
