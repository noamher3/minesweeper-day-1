"use strict";

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
function countMinesAround(board, rowIdx, colIdx) {
  var mineCount = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      var currCell = board[i][j];
      if (currCell.isMine) mineCount++;
    }
  }
  return mineCount;
}

function showNeighbors(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      var elCell = document.getElementById(`cell-${i}-${j}`);
      if (elCell.classList.contains("clicked")) continue;
      if (!gBoard[i][j].minesAround) {
        elCell.innerHTML = " ";
        elCell.classList.add("clicked");
        // gGame.shownCount++;
        showNeighbors(board, i, j);
      } else {
        // gGame.shownCount++;
        elCell.innerHTML = gBoard[i][j].minesAround;
        elCell.classList.add("clicked");
      }
    }
  }
}
