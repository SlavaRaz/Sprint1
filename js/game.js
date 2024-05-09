'use strict'

const MINE = '💣'
const FLAG = '🚩'
const GAME = '😀'
const LOSE = '😒'
const WIN = '😎'
const LIVE_3 = '❤️❤️❤️'
const LIVE_2 = '❤️❤️'
const LIVE_1 = '❤️'
const LEVELS = {
    Beginner: { SIZE: 4, MINES: 3 },//changed to 3 mines for 3 lives
    Medium: { SIZE: 8, MINES: 14 },
    Expert: { SIZE: 12, MINES: 32 }
}

var gBoard
var gGame
var gSelectedLevel = 'Beginner'
var gIntervalId
var gElapsedTime = 0

// init game 
function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        leftLives: 3,
        isFirstClick: true,
        isWin: false
    }
    clearInterval(gIntervalId)
    resetAllCount()
    gBoard = buildBoard(LEVELS[gSelectedLevel])
    renderBoard()
}

// select board size
function selectLevel(level) {
    gSelectedLevel = level
    onInit()
}
// func to check the first click on cell, should not be a mine //
function firstClick(i, j) {

    const cell = gBoard[i][j]
    // gBoard[1][1].isMine = true
    // gBoard[3][3].isMine = true
    placeMinesRandomly(gBoard, i, j)
    document.getElementById('marked-count').innerHTML = gGame.markedCount
    cell.isMarked ? renderCell(i, j, FLAG) : renderCell(i, j, '')
    renderBoard()
    setMinesNegsCount(gBoard)
    gGame.isFirstClick = !gGame.isFirstClick
    return
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
                isMarked: false,
                isMineClicked: false
            }
        }
    }
    //*** random mine placed ***/
    // placeMinesRandomly(board)
    //*** manually mine placed ***/
    // board[1][1].isMine = true
    // board[3][3].isMine = true
    // setMinesNegsCount(board)
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
            const className = `cell cell-${i}-${j} `
            strHTML += `\t<td title="${tile}" class="${className}" 
            onclick="onCellClicked( ${i}, ${j})"
            oncontextmenu="onCellMarked(event, ${i}, ${j}); return false">
        </td>\n`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.mine')
    elBoard.innerHTML = strHTML
}
// handlie click on each cell //
function onCellClicked(i, j) {

    if (gGame.isFirstClick) {
        gGame.secsPassed = Date.now()
        startTimer()
        firstClick(i, j)
    }
    const cell = gBoard[i][j]
    if (gGame.isOn) {
        if (cell.isMine && !cell.isMarked && !cell.isMineClicked) {
            cell.isMineClicked = true
            console.log(cell.isMineClicked)
            gGame.leftLives--
            gameOver(i, j)
        }
        else {
            if (!cell.isShown && !cell.isMarked && !cell.isMineClicked) {
                if (cell.minesAroundCount === 0) expandShown(gBoard, i, j)
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

    if (gGame.isFirstClick) firstClick(i, j)
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
        gGame.isWin = true
        getSmile()
        clearInterval(gIntervalId)
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
    console.log(gGame.leftLives)
    if (gGame.leftLives === 0) {
        gGame.isOn = false
        renderLive()
        getSmile()
        clearInterval(gIntervalId)
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (clickedMinePos.row === i && clickedMinePos.col === j) renderCell(i, j, getMineHTML())
            else if (!gGame.isOn && cell.isMine) renderCell(i, j, MINE)
        }
    }
    renderLive()
    console.log('you lose')
}
// color the mine with red //
function getMineHTML() {
    return `<span style="background-color: red">${MINE}</span>`
}
// show the left lives
function renderLive() {

    const elLive = document.getElementById('live')
    if (gGame.leftLives == 2) elLive.innerHTML = LIVE_2
    else if (gGame.leftLives == 1) elLive.innerHTML = LIVE_1
    else elLive.innerHTML = ' '
}
//smile face
function getSmile() {

    const elSmile = document.getElementById('smile')
    if (gGame.isWin) elSmile.innerHTML = WIN
    else if (!gGame.isOn) elSmile.innerHTML = LOSE
    else elSmile.innerHTML = GAME
}
//set interval with delay
function startTimer() {

    gIntervalId = setInterval(updateTimer, 1000)
}
//update the timer and show on html
function updateTimer() {

    var currentTime = Date.now()
    gElapsedTime = Math.floor((currentTime - gGame.secsPassed) / 1000)
    var showDisplay = document.getElementById('timer')
    showDisplay.innerHTML = gElapsedTime
}

function resetAllCount() {

    const elSmile = document.getElementById('smile')
    elSmile.innerHTML = GAME
    const elLive = document.getElementById('live')
    elLive.innerHTML = LIVE_3
    document.getElementById('shown-count').innerHTML = gGame.shownCount
    document.getElementById('marked-count').innerHTML = gGame.markedCount
    document.getElementById('timer').innerHTML = gGame.secsPassed
}



