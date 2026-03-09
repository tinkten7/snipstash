require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/snippets', require('./routes/snippets'));

// Serve static in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
}

app.get('/api/health', (req, res) => res.json({ status: 'SnipStash API running' }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('SnipStash server on port ' + PORT));
