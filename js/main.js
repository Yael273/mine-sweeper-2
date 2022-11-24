'use strict'
const FLAG = '🚩'
const EMPTY = ''
const MINE = '💣'
const SMILEY_FACE = '🙂'

var start = Date.now();
var gBoard
var gTimer
var isFirstClick = false
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: gLevel.MINES,
        secsPassed: 0
    }
    isFirstClick = true;
    clearInterval(gTimer)
    var elHeader1 = document.querySelector('h1')
    elHeader1.innerText = 'MINESWEEPER'
    var elSmileyFace = document.querySelector('.smileyFace')
    elSmileyFace.innerText = '🙂'
    var elTime = document.querySelector('.timer')
    elTime.innerText = '00:00'
    gBoard = buildBoard()
    console.log('buildBoard(gBoard):', buildBoard(gBoard))
    renderBoard(gBoard)
    checkFlagsCount();

}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }

    return board

}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            const cellInnerHTML = cellMarked(currCell)
            var cellClass = getClassName({ i: i, j: j })

            if (currCell.isMine && currCell.isShown) cellClass += ' mine'
            else if (currCell.isShown) cellClass += ' show'
            else if (currCell.isMarked) cellClass += ' mark'

            strHTML += `<td class="cell ${cellClass}" onmousedown="cellClicked(event, this, ${i}, ${j})" >${cellInnerHTML}</td>`

        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML


    const noRightClick = document.querySelector('table');
    noRightClick.addEventListener("contextmenu", e => e.preventDefault());

}


function cellMarked(currCell) {
  
    if (currCell.isShown) {
        if (currCell.isMine) return MINE
        else if (currCell.minesAroundCount) return currCell.minesAroundCount
        else if (!currCell.minesAroundCount) return EMPTY
    } else if (currCell.isMarked) {
        return FLAG
    } else {
     return EMPTY
    }
    // if (currCell.isMarked && currCell === FLAG){
    //     return EMPTY
    // }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = getMinesNegsCount(board, i, j)
        }
    }
}


function getMinesNegsCount(board, rowIdx, colIdx) {
    var minesNegsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                minesNegsCount++
            }

        }
    }
    return minesNegsCount
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

function cellClicked(event, elCell, i, j) {
    console.log(event)
    console.log('gBoard[i][j]:', gBoard[i][j])
    const cell = gBoard[i][j]

    /////////////////////////////////////
    if (isFirstClick) {
        createMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
        console.log(gBoard)
        isFirstClick = false;
        gGame.isOn = true
    }

    if (gGame.isOn) {

        if (event.button === 0) {
            if (cell.isMarked) return
            if (cell.isMine) {
                checkGameOver()
            }
        }
        if (event.button === 2) {
            cell.isMarked = true
            gBoard.markedCount++

        }
    }

    /////////////////////////////////////

    if (!cell.isMarked) {
        if (!cell.isShown) {
            cell.isShown = true;
            gGame.shownCount++;
        }

        if (gGame.shownCount === 1) {
            var start = Date.now();
            gTimer = setInterval(function () {
                createTime(Date.now() - start);
            }, 1000)
        }


        if (!cell.isMine) {
            if (gGame.isOn) {
                if (cell.minesAroundCount === 0) {
                    expandShown(gBoard, elCell, i, j, event);
                }
            }
        }
    }
    checkGameOver();
    renderBoard(gBoard);


}


function checkGameOver() {

    var isGameOver = false;
    var isWinner;
    var numsCount = 0;
    var flagsCount = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
                isGameOver = true;
                isWinner = false;
            }
            if (!gBoard[i][j].isMine && gBoard[i][j].isShown) {
                numsCount++;
            }
            if (gBoard[i][j].isMine && !gBoard[i][j].isShown && gBoard[i][j].isMarked) {
                flagsCount++;
            }
        }
    }
    if (flagsCount === gLevel.MINES && numsCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        isWinner = true;
        isGameOver = true;
    } else {
        isWinner = false;
    }

    if (isGameOver) {
        gGame.isOn = false;
        showAllMines();
        clearInterval(gTimer);
        if (isWinner) {
            victory()

        } else {
            gameOver()
        }
    }


}

function gameOver() {
    gGame.isOn = false
    clearInterval(gTimer)
    console.log('Game Over')
    var elSmileyFace = document.querySelector('.smileyFace')
    elSmileyFace.innerText = '😭'
    var elHeader1 = document.querySelector('h1')
    elHeader1.innerText = 'You lose!'
}

function victory() {
    gGame.isOn = false
    clearInterval(gTimer)
    console.log('Victory')
    var elSmileyFace = document.querySelector('.smileyFace')
    elSmileyFace.innerText = '🤩'
    var elHeader1 = document.querySelector('h1')
    elHeader1.innerText = 'Well Done!'
}

function restart() {
    initGame()
}


function expandShown(board, elCell, rowIdx, colIdx, ev) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (i >= 0 && j >= 0 && i < board.length && j < board[0].length) {
                if (board[i][j].isShown === false) {
                    cellClicked(ev, elCell, i, j)
                }
            }
        }
    }
}



function setLevel(btnlevel) {
    gLevel.SIZE = parseInt(btnlevel.classList[0])
    if (gLevel.SIZE === 4) gLevel.MINES = 2
    if (gLevel.SIZE === 8) gLevel.MINES = 5
    if (gLevel.SIZE === 12) gLevel.MINES = 15

    initGame()
}




function createMines(board, iIdx, jIdx) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randomi = getRandomIntInclusive(0, board.length - 1)
        var randomj = getRandomIntInclusive(0, board[0].length - 1)
        while (board[randomi][randomj].isMine === true || (randomi === iIdx && randomj === jIdx)) {
            randomi = getRandomIntInclusive(0, board.length - 1)
            randomj = getRandomIntInclusive(0, board[0].length - 1)
        }
        board[randomi][randomj].isMine = true
    }
}

function showAllMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine === true) {
                gBoard[i][j].isShown = true
            }
        }
    }
}


// function checkFlagsCount() {
//     if (gLevel.MINES === 0) return
//     else {
//         var elFlag = document.querySelector('.flagCount')
//         elFlag.innerText = '0' + gGame.markedCount
//     }
// }

function flagCounter() {
    if (gLevel.MINES === 0) return
    else {
        var elFlag = document.querySelector('.flagCount')
        elFlag.innerHTML = `0${--gLevel.MINES}`
    }
}

function checkFlagsCount() {
    var elFlagCount = document.querySelector('.flagCount')
    if (gLevel.MINES < 10) {
        elFlagCount.innerText = '0' + gGame.markedCount
    } else {
        elFlagCount.innerText = gGame.markedCount
    }
}