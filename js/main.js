'use strict'
const FLAG = '🚩'
const EMPTY = ''
const MINE = '💣'
const SMILEY_FACE = '🙂'
// const ONE = 1
// const TWO = 2
// const THREE = 3

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

    // board[1][1].isMine = true
    // board[3][1].isMine = true

    return board

}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            const cellInnerHTML = getCellInnerHTML(currCell)
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


function getCellInnerHTML(currCell) {
    if (currCell.isShown) {
        if (currCell.isMine) return MINE
        else if (currCell.minesAroundCount) return currCell.minesAroundCount
        else if (!currCell.minesAroundCount) return EMPTY
    } else if (currCell.isMarked) {
        return FLAG
    } else {
        return EMPTY
    }
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

    console.log('cell:', cell)
    /////////////////////////////////////
    if (isFirstClick) {
        createMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
        console.log(gBoard)
        isFirstClick = false;
        gGame.isOn = true
    }
    console.log('cell:', cell)
    if (gGame.isOn) {

        if (event.button === 0) {
            if (cell.isMarked) return
            // cell.isShown = true
            if (cell.isMine) {
                checkGameOver()
            } 
            // else if (cell.minesAroundCount > 0) {
            //     console.log('neighbors')
            //     // cell === cell.minesAroundCount
            //     console.log('cell:', cell)
            // }
        }
        if (event.button === 2) {
            cell.isMarked = true
            // cellMarked(elCell, i, j)
            // console.log('elCell:', elCell)
            gBoard.markedCount++
        }
    }

    console.log('cell:', cell)
    /////////////////////////////////////
    // console.log('cell:', cell)
    console.log('gboard:', gBoard)

    if (!cell.isMarked) {
        if (!cell.isShown) {
            cell.isShown = true;
            gGame.shownCount++;
        }

        // if (gGame.shownCount === 1) {
        //     var start = Date.now();
        //     gTimer = setInterval(function () {
        //         createTime(Date.now() - start);
        //     }, 1000)
        // }


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

    // if(gBoard.isMine) gameOver()
    // if (gGame.markedCount === gLevel.MINES && gBoard.isShown === gGame.shownCount) {
    //     victory()
    // }
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

// function cellMarked(elCell, i, j) {

//     if (elCell.innerHTML === FLAG) {
//         elCell.innerHTML = EMPTY
//         gBoard[i][j].isMarked = false
//         gGame.markedCount++
//     } else {
//         elCell.innerHTML = FLAG
//         gBoard[i][j].isMarked = true
//         gGame.markedCount--
//     }
//     checkFlagsCount();
//     checkGameOver();
// }

function expandShown(board, elCell, rowIdx, colIdx, ev) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (i >= 0 && j >= 0 && i < board.length && j < board[0].length) {
                if (board[i][j].isShown === false) {
                    cellClicked(ev, elCell, i, j);
                }
            }
        }
    }
}



function setLevel(btnlevel) {
    gLevel.SIZE = parseInt(btnlevel.classList[0])
    gLevel.MINES = parseInt(btnlevel.classList[0]/2)
    // clearInterval(stopwch);
    initGame()
}

// function createMines() {
//     var emptyCells = []
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[0].length; j++) {
//             emptyCells.push({ i, j })
//         }
//     }


//     const randomIdx = getRandomInt(0, emptyCells.length - 1)
//     return emptyCells[randomIdx]

// }

// function createMine() {
//     var randomCell = createMines(gBoard)

//     // MODEL
//     // gBoard[randomCell.i][randomCell.j] = MINE
//     gBoard.isMine = true
//     gBoard[randomCell.i][randomCell.j] = gBoard.isMine

//     // DOM
//     renderCell(randomCell, MINE)
// }

function checkFlagsCount() {
    var flagCount = document.querySelector('.flagCount');
    if (gLevel.MINES < 10) {
        flagCount.innerText = '00' + gGame.markedCount;
    } else {
        flagCount.innerText = '0' + gGame.markedCount;
    }
}

function createMines(board, iIdx, jIdx) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randomi = getRandomIntInclusive(0, board.length - 1);
        var randomj = getRandomIntInclusive(0, board[0].length - 1);
        while (board[randomi][randomj].isMine === true || (randomi === iIdx && randomj === jIdx)) {
            randomi = getRandomIntInclusive(0, board.length - 1);
            randomj = getRandomIntInclusive(0, board[0].length - 1);
        }
        board[randomi][randomj].isMine = true;
    }
}

function showAllMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine === true) {
                gBoard[i][j].isShown = true;
            }
        }
    }
}
