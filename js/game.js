"use strict";

var gBoard;

const FLAG = "🚩";
const MINE = "💣";

const EMPTY = "";
var livesElement;
var lives;
var timerCountElement;

var firstClick;
var timeInterval;
var timeElapsed;

const LEVELS = {
  EASY: {
    LEVEL: "EASY",
    SIZE: 4,
    MINES: 2,
  },
  NORMAL: {
    LEVEL: "NORMAL",
    SIZE: 8,
    MINES: 14,
  },
  EXPERT: {
    LEVEL: "EXPERT",
    SIZE: 12,
    MINES: 32,
  },
};

var gLevel;

var smileyElement;
const SMILEY = {
  SMILE: "😊",
  WIN: "🥳",
  LOSE: "😠",
};

var flagElemnt;
var flags;

var gGame;

function onInit(level) {
  firstClick = true;
  gBoard = [];
  gLevel = LEVELS[level];
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  lives = 3;
  flags = gLevel.MINES;
  timerCountElement = document.getElementById("timer-count");
  clearInterval(timeInterval);
  timeElapsed = 0;
  timerCountElement.innerHTML = timeElapsed;
  smileyElement = document.getElementById("smiley-element");
  smileyElement.innerHTML = SMILEY.SMILE;
  smileyElement.onclick = function () {
    onInit(level);
  };
  // console.log("hi");
  buildBoard();
  console.log(gBoard);
  renderBoard(gBoard);
}

function buildBoard() {
  document.getElementById("mine").innerHTML = MINE;
  document.getElementById("mine-count").innerHTML = gLevel.MINES;

  livesElement = document.getElementById("live-count");
  livesElement.innerHTML = lives;

  document.getElementById("flag").innerHTML = FLAG;
  flagElemnt = document.getElementById("flag-count");
  flagElemnt.innerHTML = flags;

  for (let i = 0; i < gLevel.SIZE; i++) {
    gBoard.push([]);
    for (let j = 0; j < gLevel.SIZE; j++) {
      gBoard[i][j] = {
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }

  // console.log(gBoard);
}
function renderBoard(board) {
  var strHTML = "";

  for (let i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (let j = 0; j < board[i].length; j++) {
      var cell = EMPTY;
      strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu = "onCellMarked(this); return false;" class="cell" id="cell-${i}-${j}">${cell}</td>`;
    }
    strHTML += "</tr>";
  }
  document.querySelector(".board").innerHTML = strHTML;
}

function addMines(row, col) {
  for (let i = 0; i < gLevel.MINES; i++) {
    var randRow = getRandomInt(0, gLevel.SIZE);
    var randColl = getRandomInt(0, gLevel.SIZE);

    while (
      gBoard[randRow][randColl].isMine ||
      (randRow === row && randColl === col)
    ) {
      randRow = getRandomInt(0, gLevel.SIZE);
      randColl = getRandomInt(0, gLevel.SIZE);
    }
    gBoard[randRow][randColl].isMine = true;
  }
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].minesAround = countMinesAround(board, i, j);
    }
  }
}

// function fact(num) {
//   // let res = 1;
//   // for (let i = 2; i <= num; i++) {
//   //   res = res * i;
//   // }
//   // console.log(res);
//   if (num === 0) return 1;
//   return num * fact(num - 1);
// }

function onCellClicked(elCell, i, j) {
  if (firstClick) {
    firstClick = false;
    addMines(i, j);
    setMinesNegsCount(gBoard);
    expandShown(gBoard, elCell, i, j);
    timeCount();
    return;
  }

  if (elCell.innerHTML !== EMPTY || !gGame.isOn) return;
  if (gBoard[i][j].isMine) {
    livesElement.innerHTML = --lives;
    elCell.innerHTML = MINE;
    // elCell.classList.add("clicked");
  } else {
    expandShown(gBoard, elCell, i, j);
  }
  checkGameOver();
}

function onCellMarked(elCell) {
  if (!gGame.isOn) return;
  if (elCell.innerHTML === FLAG) {
    elCell.innerHTML = EMPTY;
    flagElemnt.innerHTML = ++flags;
  } else if (elCell.innerHTML === EMPTY) {
    if (flags === 0) return;
    elCell.innerHTML = FLAG;
    flagElemnt.innerHTML = --flags;
  }
}

function showAllMines() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMine) {
        document.getElementById(`cell-${i}-${j}`).innerHTML = MINE;
      }
    }
  }
}

function timeCount() {
  timeInterval = setInterval(() => {
    timeElapsed++;
    timerCountElement.innerHTML = (timeElapsed / 100).toFixed(3);
  }, 10);
}

function checkGameOver() {
  if (lives === 0) {
    gGame.isOn = false;
    clearInterval(timeInterval);
    smileyElement.innerText = SMILEY.LOSE;
    showAllMines();
    setTimeout(() => alert("LOOSER!"), 200);
    console.log("lose");
  } else {
    var counter = 0;
    for (let i = 0; i < gBoard.length; i++) {
      for (let j = 0; j < gBoard[i].length; j++) {
        if (
          document
            .getElementById(`cell-${i}-${j}`)
            .classList.contains("clicked")
        ) {
          counter++;
        }
      }
    }
    if (counter === Math.pow(gLevel.SIZE, 2) - gLevel.MINES) {
      gGame.isOn = false;
      clearInterval(timeInterval);
      smileyElement.innerText = SMILEY.WIN;
      showAllMines();
      if ((+localStorage.getItem(gLevel.LEVEL) ?? Infinity) > timeElapsed) {
        localStorage.setItem(gLevel.LEVEL, timeElapsed);
      }
      setTimeout(() => alert("What a champion! now do it faster!"), 200);
      console.log("win");
    }
  }
}

function expandShown(board, elCell, i, j) {
  if (!gBoard[i][j].minesAround) {
    elCell.innerHTML = " ";
    elCell.classList.add("clicked");
    // gGame.shownCount++;
    showNeighbors(board, i, j);
  } else {
    elCell.innerHTML = gBoard[i][j].minesAround;
    // gGame.shownCount++;
    elCell.classList.add("clicked");
  }
}
