'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LEVELS = {
    Beginner: { SIZE: 4, MINES: 2 },
    Medium: { SIZE: 8, MINES: 14 },
    Expert: { SIZE: 12, MINES: 32 }
}

var gBoard
var gGame
var selectedLevel = 'Beginner'

// init game 
function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    document.getElementById('shown-count').innerHTML = gGame.shownCount
    document.getElementById('marked-count').innerHTML = gGame.markedCount
    gBoard = buildBoard(LEVELS[selectedLevel])
    console.log(LEVELS[selectedLevel])
    renderBoard()
}

// select board size
function selectLevel(level) {
    selectedLevel = level
    onInit()
}

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
    board[1][1].isMine = true
    board[3][3].isMine = true
    setMinesNegsCount(board)
    return board
}

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

function onCellClicked(elCell, i, j) {

    const cell = gBoard[i][j]
    if (gGame.isOn) {
        if (cell.isMine) gameOver(i, j)
        else {
            if (!cell.isShown && !cell.isMarked) {
                cell.isShown = true
                gGame.shownCount++
                renderCell(i, j, cell.minesAroundCount)
                document.getElementById('shown-count').innerHTML = gGame.shownCount
                if (checkGameOver()) {
                    console.log("Congratulations! You've win!")
                }
            }
        }
    }
    return
}

function onCellMarked(event, i, j) {

    if (gGame.isOn) {
        const cell = gBoard[i][j]
        event.preventDefault()
        if (!checkGameOver() && !cell.isShown) {
            cell.isMarked = !cell.isMarked
            cell.isMarked ? gGame.markedCount++ : gGame.markedCount--
            document.getElementById('marked-count').innerHTML = gGame.markedCount
            cell.isMarked ? renderCell(i, j, FLAG) : renderCell(i, j, '')
            console.log("Marked count:", gGame.markedCount)
        }
    }
    return
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(i, j, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value
}

function checkGameOver() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown)//not all cells marked
                return false
            if (cell.isMine && !cell.isMarked)//not all mine marked
                return false
        }
    }
    return true
}

function gameOver(row, col) {

    var clickedMinePos = { row, col }
    gGame.isOn = false
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (clickedMinePos.row === i && clickedMinePos.col === j) {
                renderCell(i, j, getMineHTML())
            }
            else if (!gGame.isOn && cell.isMine)
                renderCell(i, j, MINE)
        }
    }
    console.log('you lose')
}

function getMineHTML() {
    return `<span style="background-color: red">${MINE}</span>`
}


