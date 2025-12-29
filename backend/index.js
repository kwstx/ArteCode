const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Creative Coding Toolkit Backend');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
