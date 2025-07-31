//backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API backend funcionando');
});

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend server running at http://localhost:${PORT}`));

const db = require('./config/db');
db.query('SHOW TABLES')
  .then(([rows]) => console.log('Tablas disponibles en la BBDD:', rows))
  .catch(err => console.error('Error al conectar con la BBDD:', err.message));
