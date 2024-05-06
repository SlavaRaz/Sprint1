'use strict'

function placeMinesRandomly(board, firstClickRow, firstClickCol) {
    // const size = board.length
    const totalMines = LEVELS[gSelectedLevel].MINES
    var randomCell = LEVELS[gSelectedLevel].SIZE - 1
    let minesPlaced = 0
    while (minesPlaced < totalMines) {
        const randomRow = getRandomIntInclusive(0,randomCell)
        const randomCol = getRandomIntInclusive(0,randomCell)
        if (!board[randomRow][randomCol].isMine &&
            !(randomRow >= firstClickRow - 1 && randomRow <= firstClickRow + 1 &&
                randomCol >= firstClickCol - 1 && randomCol <= firstClickCol + 1)) {
            board[randomRow][randomCol].isMine = true
            minesPlaced++
        }
    }
}

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
    return count
}

// function shuffle(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1))
//         [array[i], array[j]] = [array[j], array[i]]
//     }
// }
