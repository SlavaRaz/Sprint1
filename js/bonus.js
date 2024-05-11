'use strict'

var remainingSafeClicks = 3

//func to mark safe cell
function handleSafeClick() {
    if (remainingSafeClicks > 0) {
        const coveredSafeCell = findRandomCoveredSafeCell()
        if (coveredSafeCell) {
            const { row, col } = coveredSafeCell
            const cell = gBoard[row][col]
            renderCell(row, col, '🛡️')
            setTimeout(() => {
                if (cell.isShown) renderCell(row, col, cell.minesAroundCount)
                else {
                    renderCell(row, col, '')
                    const elCell = document.querySelector(`.cell-${row}-${col}`)
                    elCell.classList.remove('expanded')
                }
            }, 3000);
            remainingSafeClicks--
            updateSafeClicksDisplay()
        }
    }
}

// Function to find a random covered cell that is safe to click
function findRandomCoveredSafeCell() {
    const coveredCells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (!cell.isShown && !cell.isMarked && !cell.isMine) {
                coveredCells.push({ row: i, col: j })
            }
        }
    }
    // Randomly select a covered cell
    return coveredCells.length > 0 ? coveredCells[Math.floor(Math.random() * coveredCells.length)] : null
}

// Function to update the Safe-Clicks count display
function updateSafeClicksDisplay() {
    document.getElementById('safe-clicks-count').innerText = remainingSafeClicks
}





