const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/log-city', (req, res) => {
  const { city } = req.body;
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] User selected city: ${city}`);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Logger backend running on http://localhost:${PORT}`);
});