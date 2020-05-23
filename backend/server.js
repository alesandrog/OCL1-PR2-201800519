const express = require('express');
const http = require('http');
const host = '127.0.0.1';
const port = 3000;
/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Primer servidor con Node.Js');
});
server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});
*/
var data = {
  nombre : 'nelson'
}

const app = express();
app.use(express.json({ limit: '1mb'}));

app.listen(3000, () => console.log('listening at 3000'));

app.get('/api', (request, response) => {
  
    response.json(data);
});

app.post('/api', (request, response) => {
  


});