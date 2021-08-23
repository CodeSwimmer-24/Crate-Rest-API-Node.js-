const http = require('http');
const app = require('./app');
const products = require('./api/routes/products')

const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port);