const WebSocket = require('ws');
const port = process.env.PORT || 3000; // 環境変数にPORTが設定されている場合は、その値を使う
const server = new WebSocket.Server({ port: port });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.send(`Received message: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});