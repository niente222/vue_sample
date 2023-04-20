const WebSocket = require('ws');
const fs = require('fs');
const port = process.env.PORT || 3000; // 環境変数にPORTが設定されている場合は、その値を使う
const server = new WebSocket.Server({ port: port });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    //クライアントにエコーバック
    socket.send(`Received message: ${message}`);

    fs.writeFile('./numbers/numbers_1.txt', message, 'utf8', (error) => {
      if (error) {
        console.error('書き込みエラー:', error);
      } else {
        console.log('ファイルに書き込みました');
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});