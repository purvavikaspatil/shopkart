const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use('/api', routes);

// Central error handler
app.use(errorHandler);

module.exports = app;