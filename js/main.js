// Selected Pieces Counter
let selectedPieces = 0;

// contains all chess pieces' names 
let piecesNames = ["queen", "king", "pawn", "bishop", "rook", "knight"];

// contains all board boxes
let boxes = document.querySelectorAll(".game .column");

let yAxis = [], xAxis = [];

// defining which player turn is it
let currentTurn = "first-player";

// switching the turn
function switchCurrentTurn() {
    currentTurn == "first-player" ? currentTurn = "second-player" : currentTurn = "first-player";
}

// detectinng opponent (could be improved later)
let opponent = "";
function detectOpponent() {
    currentTurn == "first-player" ? opponent = "second-player" : opponent = "first-player";
}

// give data-y and data-x to every box in the board to identify them using js
function setXY() {
    let z = 0;
    for (let y = 8; y > 0; y--) {
        for (x = 1; x < 9; x++) {
            boxes[z].setAttribute("data-y", y);
            boxes[z].setAttribute("data-x", x);
            z++;
        }
    }
}

// Starting the game function (puting the pieces in it's place)
function initiateGame() {
    // adding span to every box for better formating in css
    for(y = 0; y < boxes.length; y++){
        boxes[y].appendChild(document.createElement("span"));
    }

    // giving X and Y values to each box in the chess board.
    setXY();

    // adding the pieces to the board in their places
    z = 0;
    for (y = 8; y > 0; y--) {
        for (x = 1; x < 9; x++) {

            // adding second-player pawns 
            if (y == 7) boxes[z].classList.add("pawn", "second-player");
            
            // adding black pawns 
            if (y == 2) boxes[z].classList.add("pawn", "first-player");

            // adding second-player bishops 
            if (y == 8 && x == 3 || y == 8 && x == 6) boxes[z].classList.add("bishop", "second-player");

            // adding black bishops 
            if (y == 1 && x == 3 || y == 1 && x == 6) boxes[z].classList.add("bishop", "first-player");

            // adding second-player knight 
            if (y == 8 && x == 2 || y == 8 && x == 7) boxes[z].classList.add("knight", "second-player");

            // adding black knight 
            if (y == 1 && x == 2 || y == 1 && x == 7) boxes[z].classList.add("knight", "first-player");

            // adding second-player Rook
            if (y == 8 && x == 1 || y == 8 && x == 8) boxes[z].classList.add("rook", "second-player");

            // adding black Rook
            if (y == 1 && x == 1 || y == 1 && x == 8) boxes[z].classList.add("rook", "first-player");

            // adding second-player queen 
            if (y == 8 && x == 4) boxes[z].classList.add("queen", "second-player");

            // adding black queen 
            if (y == 1 && x == 4) boxes[z].classList.add("queen", "first-player");

            // adding second-player king 
            if (y == 8 && x == 5) boxes[z].classList.add("king", "second-player");

            // adding black king 
            if (y == 1 && x == 5) boxes[z].classList.add("king", "first-player");

            // adding click event 
            boxes[z].addEventListener("click", function(){
                clickChecker(this);
            });

            
        z++;
        }
    }
}

initiateGame();

// when clicking get me the y and x from the piece
function clickChecker(box) {
    
    // if it's first selection 
    if (selectedPieces == 0) {
        
        // checing which turn is it and rotating the y and x depending on it to make the logic works fine
        if (box.classList.contains(currentTurn)) {
            
            console.log("yes u can play");
    
        } else {
            return console.log("not ur turn") ;
    
        } 
        
        // Checking if the box contains a piece
        if (piecesNames.some(piecesNames => box.classList.contains(piecesNames))) {

            // adding .selected to the first selection 
            box.classList.add("selected");

            // giving values to the array
            yAxis.push(box.getAttribute("data-y"))
            xAxis.push(box.getAttribute("data-x"))

            selectedPieces++;
        } 
        
        // if it's second selection 
    } else if (selectedPieces == 1) {

        // giving values to the array
        yAxis.push(box.getAttribute("data-y"))
        xAxis.push(box.getAttribute("data-x"))
        
        // checking if the second click on the same box 
        if (yAxis[0] == yAxis[1] && xAxis[0] == xAxis[1]) {
            
            // Cancels the movement and reseting the array 
            document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.remove("selected");
            console.log("Same piece bitch");
            selectedPieces = 0;
            return yAxis = [], xAxis = [];
        } else {
            // console.log("Data sent to moveValidation");
            console.log(yAxis, xAxis);
            moveValidation();

        }
    } else {
        console.log("Can't press here now");  
    }
}

// Start Pieces Logic where y x the current position and x2 y2 the target position

function moveValidation() {
    // updating the opponent for later use
    detectOpponent();
    
    // Checking which piece is it so we can call it's rules function
    for (i = 0; i < piecesNames.length; i++) {
        if (document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.contains(piecesNames[i])) {
            pieceType = piecesNames[i];
        } 
    }
    
    chessRules(pieceType);
}

let oneStepForward, oneStepBackwards, twoStepsBackwards, playerDirection;

function chessRules(pieceType, valid, moveType) {
    
    switch (pieceType) {
        
        case "pawn":
            // since the pawn moves only forward .. checking which turn is it to decide the pawn direction.
            if (currentTurn == "first-player") oneStepForward = + 1, oneStepBackwards = - 1, twoStepsBackwards = - 2;
            else if (currentTurn == "second-player") oneStepForward = - 1, oneStepBackwards = + 1, twoStepsBackwards = + 2;
                        
                // if the marked box empty
            if ( piecesNames.some(piecesNames => document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(piecesNames)) == false &&
                // moving the pawn one step ahead 
                (parseInt(yAxis[0]) + oneStepForward == parseInt(yAxis[1]) && parseInt(xAxis[0]) == parseInt(xAxis[1])) || 

                // if the marked box empty
                piecesNames.some(piecesNames => document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(piecesNames)) == false &&
                // if it's pawn's first move make it two jumps
                document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.contains("moved") == false &&
                // making sure no pieces between the current position and the destination  
                piecesNames.some(piecesNames => document.querySelector
                    (`[data-y="${Math.abs(parseInt(yAxis[1]) - oneStepForward)}"][data-x="${xAxis[1]}"]`).classList.contains(piecesNames)) == false &&

                // moving the pawn two steps forward
                parseInt(yAxis[0]) == parseInt(yAxis[1]) + twoStepsBackwards && parseInt(xAxis[0]) == parseInt(xAxis[1]) )            
            {
                valid = "true", moveType ="normalMove";
                break;
            } 

            // pawn capturing if there is a opponent piece in the target position
            else if ( parseInt(yAxis[0]) + oneStepForward == parseInt(yAxis[1]) && 
                document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(opponent) == true && 
                (parseInt(xAxis[0]) + oneStepForward == parseInt(xAxis[1]) || parseInt(xAxis[0]) + oneStepBackwards == parseInt(xAxis[1]) ) ) 
            {
                valid ="true", moveType ="capture";
                break;
            }

            else {
                console.log(pieceType);
                valid ="false";
                break;
        }
            
        case "bishop":
            console.log(pieceType);
            // code here
            valid ="false", moveType ="capture";
            break;
            
        case "knight":
            console.log(pieceType);
            
            /* 
            y 5 - x 4 ets

            x7 - x 3 

            x7 - x 5 

            x3 - x 3

            x3 - x 5

            */
            valid ="true", moveType ="capture";
            break;

        case "rook":
            console.log(pieceType);

        // code here
        valid ="true", moveType ="capture";
        break;

        case "queen":
            console.log(pieceType);

            // code here
            valid ="true", moveType ="capture";
            break;


        case "king":
            console.log(pieceType);

            // code here
            valid ="true", moveType ="capture";
            break;

    }

    if (valid == "true") {
        doAnimation(moveType);
        endTurn(pieceType);
    } else {
        console.log("Faaaalse .... etsrf");
        return yAxis.pop(),xAxis.pop();
    } 
    
}

// End Pieces Logic

// End Turn function 
function endTurn(piece) {
    selectedPieces = 0;

    // preventing player from pressing till the animation done
    document.body.style.pointerEvents="none";
    
    // Start Moving the piece 
    // Removing classes from the current position
    document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.remove(piece, currentTurn);
    document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.remove("moved");

    // in case capture removing whatever the enemy unit in the new position
    piecesNames.some(piecesNames => document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.remove(piecesNames, opponent));

    // adding classes to the new position
    document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.add(piece, currentTurn, "second-choice");
    document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.add("moved");

    // End Moving the piece 

    // Ending the turn and clear selections
    setTimeout(() => {
        document.querySelector(".selected").classList.remove("selected");
        document.querySelector(".second-choice").classList.remove("second-choice");

        // giving the ability to press again 
        document.body.style.pointerEvents="initial";
    }, "1000");

    switchCurrentTurn();

    return yAxis = [], xAxis = [];
}

// Making animation when a piece moves
function doAnimation(animationType) {
    // detecting if it's capture move or normal move to determine the animationtype 
    animationType == "normalMove" ? animationType = "fa-bounce" : animationType = "fa-beat";
    
    document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"] span`).classList.add(animationType);
    
    setTimeout(() => {
        document.querySelector(`.${animationType}`).classList.remove(animationType);
        
    }, "1000");
}


/* 
Things to do : 
[1] Detect if the pawn got target to beat [ done ]
[2] Detect if the pawn got another piece infront of it and prevent it from moving. [ done ]
[3] Checkmate conditions. 
[4] Detect which turn is it. [ done ]
[5] If it's second player turn convert the x numerical using function. [ done ]
[6] fix auto respawn pawns. [ done ]
[7] Make the second player logic properly. [ done ]
[8] Let the user know which boxes he can move to.
[9] Let the user know which player turn is it.
[10] Undo button. 
[11] Move history. 
[12] in the pawn logic .. in case jumpe two stteps .. if there is a piece infront of it in the first box .. he can't jump through it.
[13] Consider the king movement depending on the checkmate conditions.
*/ 