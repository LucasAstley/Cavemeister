require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('loglevel');
const routes = require('./src/routes/routes.js');

logger.setLevel(process.env.LOG_LEVEL || 'info');

const PORT = process.env.PORT;


app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    logger.debug('Serving homepage');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(routes);

app.listen(PORT, () => {
    logger.info(`🚀 Server successfully started on http://localhost:${PORT}`);
});
