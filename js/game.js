"use strict";

var gBoard = [];

const MINE = "@";
const EMPTY = "";
var livesElement;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function onInit() {
  // console.log("hi");
  buildBoard();
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);
}

function buildBoard() {
  document.getElementById("mine-count").innerHTML = gLevel.MINES;
  livesElement = document.getElementById("live-count");
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

  for (let i = 0; i < gLevel.MINES; i++) {
    var randRow = getRandomInt(0, gLevel.SIZE);
    var randColl = getRandomInt(0, gLevel.SIZE);

    while (gBoard[randRow][randColl].isMine) {
      randRow = getRandomInt(0, gLevel.SIZE);
      randColl = getRandomInt(0, gLevel.SIZE);
    }
    gBoard[randRow][randColl].isMine = true;
  }

  // console.log(gBoard);
}
function renderBoard(board) {
  var strHTML = "";

  for (let i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (let j = 0; j < board[i].length; j++) {
      var cell = EMPTY;
      strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="cell" id="cell-${i}-${j}">${cell}</td>`;
    }
    strHTML += "</tr>";
  }
  document.querySelector(".board").innerHTML = strHTML;
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].minesAround = countMinesAround(board, i, j);
    }
  }
}

function onCellClicked(elCell, i, j) {
  var cell;
  if (gBoard[i][j].isMine) {
    cell = MINE;
  } else {
    cell = gBoard[i][j].minesAround;
  }
  elCell.innerHTML = cell;
}

function onCellMarked(elCell) {}

function checkGameOver() {}

function expandShown(board, elCell, i, j) {}
