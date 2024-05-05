'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Skip calculation for cells that contain mines
            if (board[i][j].isMine) {
                // board[i][j].isMine=true
                continue
            }
            // Count neighboring mines for the current cell and set minesAroundCount
            board[i][j].minesAroundCount = countNeighborMines(board, i, j)
        }
    }
}

function countNeighborMines(board, row, col) {
    var count = 0
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].isMine) {
                count++
            }
        }
    }
    // console.log(count)
    return count
}
