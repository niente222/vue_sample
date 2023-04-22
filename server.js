const WebSocket = require('ws');
const fs = require('fs');
const port = process.env.PORT || 3000; // 環境変数にPORTが設定されている場合は、その値を使う
const server = new WebSocket.Server({ port: port });
const readline = require('readline');

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    const fileStream = fs.createReadStream('./numbers/1.txt', { encoding: 'utf-8' });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    
    var lines = [];
    var numbers = [];
    
    rl.on('line', (line) => {
      lines.push(line);
      numbers.push(line.substring(0, line.indexOf('$')));
    });

    console.log("numbers:" + numbers);
    console.log("message:" + message);
    console.log("message substring:" + message.toString().substring(0, message.indexOf('$')));


    //webSocketに送られてきたメッセージが空文字でなければファイルに書き込む
    //ファイルの数字を取得するだけの場合(初期表示時など)を考慮
    if(message.length !== 0){
      //数字がまだ存在しない場合
      if(!numbers.includes(message.toString().substring(0, message.indexOf('$')))){
        fs.appendFile('./numbers/1.txt', message + '\n', 'utf8', (error) => {
          if (error) {
            console.error('書き込みエラー:', error);
          } else {
            console.log('ファイルに書き込みました');
          }
        });
      }
    }
    
    rl.on('close', () => {
      //クライアントにエコーバック
      console.log(JSON.stringify(lines));
      socket.send(JSON.stringify(lines));
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});