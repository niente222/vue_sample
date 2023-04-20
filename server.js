const WebSocket = require('ws');
const fs = require('fs');
const port = process.env.PORT || 3000; // 環境変数にPORTが設定されている場合は、その値を使う
const server = new WebSocket.Server({ port: port });
const readline = require('readline');

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    fs.appendFile('./numbers/1.txt', '\n' + message, 'utf8', (error) => {
      if (error) {
        console.error('書き込みエラー:', error);
      } else {
        console.log('ファイルに書き込みました');
      }
    });

    const fileStream = fs.createReadStream('./numbers/1.txt', { encoding: 'utf-8' });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    
    var lines = [];
    
    rl.on('line', (line) => {
      lines.push(line);
    });
    
    rl.on('close', () => {
    });

    //クライアントにエコーバック
    socket.send(JSON.stringify(lines));
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});