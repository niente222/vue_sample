const WebSocket = require('ws');
const fs = require('fs');
const port = process.env.PORT || 3000; // 環境変数にPORTが設定されている場合は、その値を使う
const server = new WebSocket.Server({ port: port });
const readline = require('readline');

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    var textFileNumber = "1";
    //textFileNumber = getPlayingFileName();

    const fileStream = fs.createReadStream('./numbers/' + textFileNumber + '.txt', { encoding: 'utf-8' });

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
    
    rl.on('close', () => {
      //webSocketに送られてきたメッセージが空文字でなければファイルに書き込む
      //ファイルの数字を取得するだけの場合(初期表示時など)を考慮
      if(message.length !== 0){
        //数字がまだ存在しない場合
        if(!numbers.includes(message.toString().substring(0, message.indexOf('$')))){
          fs.appendFile('./numbers/' + textFileNumber + '.txt', message + '\n', 'utf8', (error) => {
            if (error) {
              console.error('書き込みエラー:', error);
            } else {
              console.log('ファイルに書き込みました');
              lines.push(message);
              numbers.push(message.toString().substring(0, message.indexOf('$')));
              if(!hasMissingNumber(numbers)){
                //クリア時処理
                const firstDollarSignIndex = message.indexOf('$');
                const secondDollarSignIndex= message.indexOf('$', firstDollarSignIndex + 1);
                const playerName = secondDollarSignIndex !== -1 ? message.substring(firstDollarSignIndex, secondDollarSignIndex).replace(/\$/g, '') : message;
            
                writeCompleteLog(textFileNumber,playerName);
                console.log("クリア");
              }
            }
          });
        }
      }

      //クライアントにエコーバック
      console.log(JSON.stringify(lines));
      socket.send(JSON.stringify(lines));
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

function getPlayingFileName(){
  const filePath = './numbers/completeLog.txt';

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lastLine = '';

  rl.on('line', (line) => {
    lastLine = line;
  });

  rl.on('close', () => {
    return lastLine;
  });
}

function hasMissingNumber(arr) {
  // 配列をソート
  const sortedArr = arr.sort((a, b) => a - b);

  if(sortedArr.length < 10){
    return true;
  }

  for (let i = 0; i < sortedArr.length - 1; i++) {
    // 隣接する要素が連続していない場合、欠けている数字がある
    if (sortedArr[i] != i + 1) {
      return true;
    }
  }

  return false;
}

function writeCompleteLog(fileNum,playerName){
  const fileStream = fs.createReadStream('./numbers/completeLog.txt', { encoding: 'utf-8' });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  
  fs.appendFile('./numbers/completeLog.txt', fileNum + '$' + playerName + '$' + getDateFormat(new Date()) + '\n', 'utf8', (error) => {
    if (error) {
      console.error('書き込みエラー:', error);
    } else {
      console.log('ファイルに書き込みました');
    }
  });
}

function getDateFormat(date){
  const y = date.getFullYear();
  const M = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();


  const yyyy = y.toString();
  const MM = ("00" + M).slice(-2);
  const dd = ("00" + d).slice(-2);
  const hh = ("00" + h).slice(-2);
  const mm = ("00" + m).slice(-2);
  const ss = ("00" + s).slice(-2);

  return yyyy + '/' + MM + '/' + dd + ' ' + hh + ':'  + mm + ':'  + ss;
}