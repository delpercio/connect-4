//Variables
let tbRow = document.getElementsByTagName('tr'); //grab every row in the table
let tbData = document.getElementsByTagName('td'); //grab every cell in the grid
let tbSlot = document.querySelectorAll('.slot'); //grab every individual slot based on ID
const playerTurn = document.querySelector('.player-turn'); //this is just the h2 that tells you whos turn it is
let winnerDiv = document.getElementById("announce-winner")
let player1 = 'RED'; //declare player 1
let player1Color = 'red';
let player2 = 'YELLOW'; //declare player 2
let player2Color = 'yellow';
let currentPlayer = 1; //gonna need this to switch between two players
playerTurn.innerHTML = `${player1} <br> you go first!` //This displays whos turn it is in the h2 and gives the info for who starts

//Initalize A Functional Gameboard
Array.prototype.forEach.call(tbData, (cell) => {
    cell.addEventListener('click', changeTurn); //adds event listener to each cell/calls our main logic function 'changeColor'
    cell.style.backgroundColor = 'white'; //tells javascript that each background of each empty cell is white
})

//the brains of the operation
function changeTurn(e) { //this function turns each row into an array, and then checks the players turn, and then turns the 1st available index to that players color, and then changes the players turn to the next player.
    let column = e.target.cellIndex
    let row = [] //this essentially stores our turns
    
    
    if (horizontalCheck() || verticalCheck() || diagCheckDecrease() || diagCheckIncrease()) { //if you havent won, continue
        return
    } else {
        for (let i = 5; i >= 0; i--) {
            if (tbRow[i].children[column].style.backgroundColor === 'white') {
                row.push(tbRow[i].children[column]) //this pushes this cell into our array
                if (currentPlayer === 1) {
                    row[0].style.backgroundColor = player1Color //this pulls the text color, which is a string! from player 1 color and applies it to the first index of the array
                    if (horizontalCheck() || verticalCheck() || diagCheckDecrease() || diagCheckIncrease()) { //for a winner
                        playerTurn.innerHTML = `${player1} IS THE WINNER! <br> press restart for a rematch`
                        // winnerDiv.innerHTML = `${player1} IS THE WINNER!`


                    }
                    else if (tieCheck()) { //check for a tie
                        playerTurn.innerHTML = 'ITS A STALEMATE! <br> press restart for a rematch'


                    }
                    else {
                        playerTurn.innerHTML = `Hey! ${player2} it's your move!`
                        return currentPlayer = 2
                    }
                } else {
                    row[0].style.backgroundColor = player2Color //this pulls the text color, which is a string! from player 2 color.
                    if (horizontalCheck() || verticalCheck() || diagCheckDecrease() || diagCheckIncrease()) {//for a winner
                        playerTurn.innerHTML = `${player2} IS THE WINNER! <br> press restart for a rematch`

                    }
                    else if (tieCheck()) {//check for tie
                        playerTurn.innerHTML = 'ITS A STALEMATE!<br> press restart for a rematch'


                    }
                    else {
                        playerTurn.innerHTML = `Hey! ${player1} it's your move!`
                        return currentPlayer = 1;
                    }
                }
            }
        }
    }

}

//Win checks!!!
function colorCompare(one, two, three, four) {
    return (one === two && one === three && one === four && one !== 'white')  //This goes into our win conditions, so each number will represent a cell, we compare them to seeif the are === and NOT white.
}
function horizontalCheck() { //Scans every row, checks each col then adds +1 to col value and checks that one repeat 
    for (let row = 0; row < tbRow.length; row++) {
        for (let col = 0; col < 4; col++) { //there are only 4 possible ways to winhorizontally so it only needs to loop 4 times
            if (colorCompare(tbRow[row].children[col].style.backgroundColor,
                tbRow[row].children[col + 1].style.backgroundColor,
                tbRow[row].children[col + 2].style.backgroundColor,
                tbRow[row].children[col + 3].style.backgroundColor)) {
                return true;
            }
        }
    }
}
function verticalCheck() { //works the same way as horizontal but changes the row +1 to check each row
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {   //there are only 3 possible ways to win vertically so it only needs to loop 3 times
            if (colorCompare(tbRow[row].children[col].style.backgroundColor,
                tbRow[row + 1].children[col].style.backgroundColor,
                tbRow[row + 2].children[col].style.backgroundColor,
                tbRow[row + 3].children[col].style.backgroundColor)) {
                return true
            }
        }
    }

}
function diagCheckIncrease() { //works just like horizontal, except every time it goes to check a col it increases or decreased (general comment for both diag)
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
            if (colorCompare(tbRow[row].children[col].style.backgroundColor,
                tbRow[row + 1].children[col + 1].style.backgroundColor,
                tbRow[row + 2].children[col + 2].style.backgroundColor,
                tbRow[row + 3].children[col + 3].style.backgroundColor)) {
                return true
            }
        }
    }

}
function diagCheckDecrease() { //works just like horizontal, except every time it goes to check a col it increases or decreased (general comment for both diag)
    for (let col = 0; col < 4; col++) {
        for (let row = 5; row > 2; row--) {
            if (colorCompare(tbRow[row].children[col].style.backgroundColor,
                tbRow[row - 1].children[col + 1].style.backgroundColor,
                tbRow[row - 2].children[col + 2].style.backgroundColor,
                tbRow[row - 3].children[col + 3].style.backgroundColor)) {
                return true
            }
        }
    }

}
function tieCheck() { //checks to see if object is not white, it its not, it fills the array, if the array meets the max length of the tbdata then its full...
    let fullSlot = []
    for (let i = 0; i < tbData.length; i++) {
        if (tbData[i].style.backgroundColor !== 'white') {
            fullSlot.push(tbData[i])
        }
    }
    if (fullSlot.length === tbData.length) {
        return true
    }

}

















//these dont work like I want them too, but they are here when Its time to refactor


// function player1WinCheck() {
//     if (horizontalCheck() || verticalCheck() || diagCheckDecrease() || diagCheckIncrease()) {
//         playerTurn.innerHTML = `${player1} IS THE WINNER!`
//     }
//     else if (tieCheck()) {
//         playerTurn.innerHTML = 'ITS A STALEMATE!'

//     }

// }

// function player2WinCheck() {
//     if (horizontalCheck() || verticalCheck() || diagCheckDecrease() || diagCheckIncrease()) {
//         playerTurn.innerHTML = `${player2} IS THE WINNER!`
//     }
//     else if (tieCheck()) {
//         playerTurn.innerHTML = 'ITS A STALEMATE!'

//     }

// }


// for (let i = 0; i < tbData.length; i++) { //this loop just checks my work to make sure all clicks are indexed
//     tbData[i].addEventListener('click', function addListenerToEveryElement(e) {
//         console.log(`${e.target.parentElement.rowIndex}, ${e.target.cellIndex}`) //rowIndex and cellIndex are table properties

//     })
// }
