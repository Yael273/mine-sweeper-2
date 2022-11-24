function getRandomInt(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getEmptyCells() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[i].length; j++) {

            if ((gBoard[i][j] != WALL) && (gBoard[i][j] != PACMAN) && (gBoard[i][j] != POWER_FOOD)) {
                emptyCells.push({ i, j })
            }
        }
    }

    return emptyCells
}

function createTime(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var min = time.getMinutes().toString();
    var sec = time.getSeconds().toString();

    if (min.length < 2) { min = '0' + min; }
    if (sec.length < 2) { sec = '0' + sec; }

    var elTime = document.querySelector('.timer');
    elTime.innerHTML = min + ':' + sec;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}


const noRightClick = document.querySelector('table');
noRightClick.addEventListener("contextmenu", e => e.preventDefault());


// function checkFlagsCount() {
//     if (gLevel.MINES === 0) return
//     else {
//         var elFlag = document.querySelector('.flagCount')
//         elFlag.innerText = '0' + gGame.markedCount
//     }
// }

// function flagCounter() {
//     if (gLevel.MINES === 0) return
//     else {
//         var elFlag = document.querySelector('.flagCount')
//         elFlag.innerHTML = `0${--gLevel.MINES}`
//     }
// }