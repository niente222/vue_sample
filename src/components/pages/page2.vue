<template>
    <h1>ラストワンゲーム</h1>
    <button id="unlockButton" @click="handleClick">数字を解除する</button>
    <div id="result"></div>

    <div id="app">
    <table class="bingo-board">
      <tbody>
        <tr v-for="(row, rowIndex) in bingoNumbers" :key="rowIndex">
          <td class="bingo-cell" v-for="(number, colIndex) in row" :key="colIndex">{{ number }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  var lockStatus = null;
  var unlockButton = null;
  var resultDiv = null;
  const socket =new WebSocket('ws://15.168.35.55:3000/');

  export default {
    name: 'page2',
    data(){
      return{
        bingoNumbers: []
      }
    },

    //ページ表示時に処理される
    mounted() {
      lockStatus = Array(10).fill(true);
      unlockButton = document.getElementById('unlockButton');
      resultDiv = document.getElementById('result');
      
      socket.addEventListener('open', () => {
      });
    
      socket.addEventListener('message', (event) => {
          const receivedArray = JSON.parse(event.data);
          console.log('Received array:', receivedArray);
          alert(receivedArray);
      });
  
      socket.addEventListener('close', (event) => {
          console.log('WebSocket connection closed:', event);
      });
    },

    created() {
      this.generateBingoNumbers();
    },

    //unlockButton クリック時処理
    methods: {
      handleClick() {
        const lockedNumbers = lockStatus.reduce((acc, cur, idx) => cur ? acc.concat(idx + 1) : acc, []);
        const randomIndex = Math.floor(Math.random() * lockedNumbers.length);
        const selectedNumber = lockedNumbers[randomIndex];

        socket.send(selectedNumber);

        if (lockedNumbers.length === 1) {
            resultDiv.textContent = 'おめでとうございます！あなたが最後の数字 ' + selectedNumber + ' を解除しました！';
            unlockButton.disabled = true;
        } else {
            lockStatus[selectedNumber - 1] = false;
            resultDiv.textContent = '数字 ' + selectedNumber + ' を解除しました！';
        }
      },
      generateBingoNumbers() {
        var num = 1;
        for (let row = 0; row < 400; row++) {
          this.bingoNumbers[row] = [];
          for (let col = 0; col < 25; col++) {
            this.bingoNumbers[row][col] = num;
            num++;
          }
        }
      }
    },
  }
</script>