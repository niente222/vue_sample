<template>
    <h1>ラストワンゲーム</h1>
    <input type="text" v-model="playerName" />
    <br>
    <button id="unlockButton" @click="handleClick">数字を解除する</button>
    <div id="result"></div>

    <div id="app">
    <table class="bingo-board">
      <tbody>
        <tr v-for="(row, rowIndex) in bingoNumbers" :key="rowIndex">
          <td class="bingo-cell" v-for="(number, colIndex) in row" :key="colIndex" :id="'bingo-cell-' + number">{{ number }}<div class='tooltip-text' :id="'tooltip-' + number" style="display: none;"></div></td>
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
        bingoNumbers: [],
        playerName : ''
      }
    },

    //ページ表示時に処理される
    mounted() {
      lockStatus = Array(10).fill(true);
      unlockButton = document.getElementById('unlockButton');
      resultDiv = document.getElementById('result');

      if(socket.readyState === WebSocket.OPEN){
        socket.send("");
      }else{
        socket.addEventListener('open', () => {
          socket.send("");
        });
      
        socket.addEventListener('message', (event) => {
          const receivedArray = JSON.parse(event.data);
          console.log('Received array:', receivedArray);
          receivedArray.forEach(str => {
            const firstDollarSignIndex = str.indexOf('$');
            const secondDollarSignIndex= str.indexOf('$', firstDollarSignIndex + 1);
            const num = str.substring(0, firstDollarSignIndex);
            const playerName = secondDollarSignIndex !== -1 ? str.substring(firstDollarSignIndex, secondDollarSignIndex).replace(/\$/g, '') : str;
            const date = secondDollarSignIndex !== -1 ? str.substring(secondDollarSignIndex).replace(/\$/g, '') : '';

            this.markNumber(num,playerName,date);
          })
        });
    
        socket.addEventListener('close', (event) => {
          console.log('WebSocket connection closed:', event);
        });
      }
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

        if(this.playerName.length === 0){
          this.playerName = 'No Name';
        }

        this.playerName = this.playerName.replace(/\$/g, '');
        socket.send(selectedNumber + '$' + this.playerName + '$' + this.getDateFormat(new Date()));

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
      },
      markNumber(number,playerName,date) {
        const cellId = `bingo-cell-${number}`;
        const cell = document.getElementById(cellId);
        const tooltipId = `tooltip-${number}`;
        const tooltip = document.getElementById(tooltipId);

        if (cell) {
          cell.style.backgroundColor = 'yellow';
          tooltip.style.display = "block";
          tooltip.innerHTML = `${number}<br>${playerName}<br>${date}`;
          console.log(playerName + date);
        } else {
          //予期せぬ値
        }
      },
      getDateFormat(date){
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
    },
  }
</script>