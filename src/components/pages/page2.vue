<template>
    <h1>ラストワンゲーム</h1>
    <button id="unlockButton" @click="handleClick">数字を解除する</button>
    <div id="result"></div>
</template>

<script>
  var lockStatus = null;
  var unlockButton = null;
  var resultDiv = null;
  const socket =new WebSocket('ws://15.168.35.55:3000/');

  export default {
    name: 'page2',

    //ページ表示時に処理される
    mounted() {
      lockStatus = Array(10).fill(true);
      unlockButton = document.getElementById('unlockButton');
      resultDiv = document.getElementById('result');
      
      socket.addEventListener('open', () => {
          socket.send('1113');
        });
    
      socket.addEventListener('message', () => {
        alert("socketが帰ってきた")
      });
  
      socket.addEventListener('close', (event) => {
          console.log('WebSocket connection closed:', event);
      });
    },

    //unlockButton クリック時処理
    methods: {
      handleClick() {
        const lockedNumbers = lockStatus.reduce((acc, cur, idx) => cur ? acc.concat(idx + 1) : acc, []);
        const randomIndex = Math.floor(Math.random() * lockedNumbers.length);
        const selectedNumber = lockedNumbers[randomIndex];

        if (lockedNumbers.length === 1) {
            resultDiv.textContent = 'おめでとうございます！あなたが最後の数字 ' + selectedNumber + ' を解除しました！';
            unlockButton.disabled = true;
        } else {
            lockStatus[selectedNumber - 1] = false;
            resultDiv.textContent = '数字 ' + selectedNumber + ' を解除しました！';
        }
      },
    },
  }
</script>