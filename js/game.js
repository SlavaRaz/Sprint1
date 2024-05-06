'use strict'

const MINE = '💣'
const FLAG = '🚩'
const GAME = '😀'
const LOSE = '😒'
const WIN = '😎'
const LIVE = '❤️'
const LEVELS = {
    Beginner: { SIZE: 4, MINES: 2 },
    Medium: { SIZE: 8, MINES: 14 },
    Expert: { SIZE: 12, MINES: 32 }
}

var isFirstClick = true
var isWin = false
var gBoard
var gGame
var gSelectedLevel = 'Beginner'

// init game 
function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    getSmile()
    getLive()
    document.getElementById('shown-count').innerHTML = gGame.shownCount
    document.getElementById('marked-count').innerHTML = gGame.markedCount
    gBoard = buildBoard(LEVELS[gSelectedLevel])
    renderBoard()
    //***  if first click  ***/
    // if (!isFirstClick) {
    //     placeMinesRandomly(gBoard)
    //     renderBoard()
    //     setMinesNegsCount(gBoard)
    // }

}

// select board size
function selectLevel(level) {
    gSelectedLevel = level
    onInit()
}
// func to check the first click on cell, should be a mine //
function firstClick(i, j) {
    isFirstClick = false
    renderBoard()
    placeMinesRandomly(gBoard, i, j)
    setMinesNegsCount(gBoard)
}
// build board //
function buildBoard(gLevel) {

    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    //*** random mine placed ***/
    // placeMinesRandomly(board)
    board[1][1].isMine = true
    board[3][3].isMine = true
    setMinesNegsCount(board)
    return board
}
// render board //
function renderBoard() {

    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            const tile = `cell cell-${i}-${j}`
            const className = `cell cell-${i}-${j}`
            strHTML += `\t<td title="${tile}" class="${className}" 
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(event, ${i}, ${j}); return false">
        </td>\n`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.mine')
    elBoard.innerHTML = strHTML
}
// handlie click on each cell //
function onCellClicked(elCell, i, j) {
    //**** if firt click on cell ****//
    // if (isFirstClick) {
    //     firstClick(i, j)
    // }
    const cell = gBoard[i][j]
    if (gGame.isOn) {
        if (cell.isMine && !cell.isMarked) gameOver(i, j)
        else {
            if (!cell.isShown && !cell.isMarked) {
                cell.isShown = true
                gGame.shownCount++
                checkGameOver()
                document.getElementById('shown-count').innerHTML = gGame.shownCount
                renderCell(i, j, cell.minesAroundCount)
            }
        }
    }
}
// handle mark the mine with flag //
function onCellMarked(event, i, j) {

    const cell = gBoard[i][j]
    if (gGame.isOn) {
        event.preventDefault()
        if (!cell.isShown) {
            cell.isMarked = !cell.isMarked
            checkGameOver()
            cell.isMarked ? gGame.markedCount++ : gGame.markedCount--
            document.getElementById('marked-count').innerHTML = gGame.markedCount
            cell.isMarked ? renderCell(i, j, FLAG) : renderCell(i, j, '')
        }
    }
    return
}
// check if game is over //
function checkGameOver() {

    var minesCount = LEVELS[gSelectedLevel].MINES
    var cellsCount = LEVELS[gSelectedLevel].SIZE * LEVELS[gSelectedLevel].SIZE
    var flaggedMines = 0
    var shownCells = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && cell.isShown) shownCells++
            if (cell.isMine && cell.isMarked) flaggedMines++
        }
    }
    if (flaggedMines === minesCount && shownCells === cellsCount - minesCount) {
        console.log('You win!')
        isWin = true
        getSmile()
        return true
    } else return false
}
// render cell //
function renderCell(i, j, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value
}
// game over when click on mine //
function gameOver(row, col) {

    var clickedMinePos = { row, col }
    gGame.isOn = false
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (clickedMinePos.row === i && clickedMinePos.col === j) renderCell(i, j, getMineHTML())
            else if (!gGame.isOn && cell.isMine) renderCell(i, j, MINE)
        }
    }
    getSmile()
    console.log('you lose')
}
// color the mine with red //
function getMineHTML() {
    return `<span style="background-color: red">${MINE}</span>`
}

function getSmile() {
    const elSmile = document.querySelector('.image')
    if (isWin) elSmile.innerHTML = WIN
    else if (!gGame.isOn) elSmile.innerHTML = LOSE
    else elSmile.innerHTML = GAME
}

function getLive() {
    const elLive = document.querySelector('.live')
    elLive.innerHTML = LIVE

}
// recurtion neighboar opening //
function expandShown(board, elCell, i, j) { }


