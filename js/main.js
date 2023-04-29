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
            boxes[z].setAttribute("data-x", x);
            boxes[z].setAttribute("data-y", y);
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
            
            // adding first-player pawns 
            if (y == 2) boxes[z].classList.add("pawn", "first-player");

            // adding second-player bishops 
            if (y == 8 && x == 3 || y == 8 && x == 6) boxes[z].classList.add("bishop", "second-player");

            // adding first-player bishops 
            if (y == 1 && x == 3 || y == 1 && x == 6) boxes[z].classList.add("bishop", "first-player");

            // adding second-player knight 
            if (y == 8 && x == 2 || y == 8 && x == 7) boxes[z].classList.add("knight", "second-player");

            // adding first-player knight 
            if (y == 1 && x == 2 || y == 1 && x == 7) boxes[z].classList.add("knight", "first-player");

            // adding second-player Rook
            if (y == 8 && x == 1 || y == 8 && x == 8) boxes[z].classList.add("rook", "second-player");

            // adding first-player Rook
            if (y == 1 && x == 1 || y == 1 && x == 8) boxes[z].classList.add("rook", "first-player");

            // adding second-player queen 
            if (y == 8 && x == 4) boxes[z].classList.add("queen", "second-player");

            // adding first-player queen 
            if (y == 1 && x == 4) boxes[z].classList.add("queen", "first-player");

            // adding second-player king 
            if (y == 8 && x == 5) boxes[z].classList.add("king", "second-player");

            // adding first-player king 
            if (y == 1 && x == 5) boxes[z].classList.add("king", "first-player");

            // adding x and Y for the user in span span 
            // document.querySelector(`[data-y="${y}"][data-x="${x}"] span`).appendChild(document.createElement("span")).innerHTML = `x${x} y${y}`;

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
        
        // checing which turn is it.
        if (box.classList.contains(currentTurn) == false) 
            return console.log("not ur turn") ;
        
        // Checking if the box contains a piece
        if (piecesNames.some(piecesNames => box.classList.contains(piecesNames))) {

            // adding .selected to the first selection 
            box.classList.add("selected");

            // giving values to the array
            yAxis.push(box.getAttribute("data-y"));
            xAxis.push(box.getAttribute("data-x"));

            selectedPieces++;
            moveValidation();
            possibleMovement();
        } 
        
        // if it's second selection 
    } else if (selectedPieces == 1) {

        // giving values to the array
        yAxis.push(box.getAttribute("data-y"));
        xAxis.push(box.getAttribute("data-x"));
        
        // checking if the second click on the same box 
        if (yAxis[0] == yAxis[1] && xAxis[0] == xAxis[1]) {
            
            // Cancels the movement and reseting the array 
            document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.remove("selected");
            selectedPieces = 0;

            possibleMoveClassRemoval();
            return yAxis = [], xAxis = [];
        } else {
            chessRules();
        }
    } else {
        console.log("Can't press here now");  
    }
}

function moveValidation() {
    // updating the opponent for later use
    detectOpponent();
    
    // Checking which piece is it so we can call it's rules function
    for (i = 0; i < piecesNames.length; i++) {
        if (document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.contains(piecesNames[i])) {
            pieceType = piecesNames[i];
        } 
    }
}

let oneStepForward, oneStepBackwards, twoStepsBackwards, stepX, stepY, valid, moveType;

function chessRules() {

    valid ="", moveType = "";
    allLogics();

    // what happens after the switch cases
    if (valid == "true") {

        possibleMoveClassRemoval();
        doAnimation(moveType);
        endTurn(pieceType);

    } else {
        console.log(`the ${pieceType} can't move like this, idiot!`);
        return yAxis.pop(),xAxis.pop();
    } 
}

function movementCheck() {
    
    // if the next move contains an ally piece.
    if (document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(currentTurn)) 
        valid = "false";

    // if the destination position empty ==> move 
    if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.contains(piecesNames)) == false) 
        valid = "true", moveType = "normalMove";

    // if the destination position has enemy ==> move 
    if (document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.contains(opponent) == true) 
        valid = "true", moveType = "capture";
}

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

function allLogics() {

    switch (pieceType) {
        
        case "pawn":
            pawnLogic();
            break;
            
        case "rook":
            rookLogic();
            break;

        case "knight":
            knightLogic();
            break;

        case "bishop":
            bishopLogic();
            break;

        case "queen":
            queenLogic();
            break;
    
        case "king":
            kingLogic();
            break;
    }

    function pawnLogic() {
    
        // since the pawn moves only forward .. checking which turn is it to decide the pawn direction.
        if (currentTurn == "first-player") oneStepForward = + 1, oneStepBackwards = - 1, twoStepsBackwards = - 2;
        else oneStepForward = - 1, oneStepBackwards = + 1, twoStepsBackwards = + 2;
    
        // moving the pawn one step ahead 
        if (parseInt(yAxis[0]) + oneStepForward == parseInt(yAxis[1]) && parseInt(xAxis[0]) == parseInt(xAxis[1]) &&
        
            // making sure no pieces between the current position and the destination  
            piecesNames.some(piecesNames => document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(piecesNames)) == false )
                movementCheck();
                
        // moving the pawn two steps ahead 
        else if (
            // to avoid searching out of the board (for example: y = -1)
            (parseInt(yAxis[1]) > 0 && parseInt(xAxis[1]) > 0 ) && 
            
            // if it's pawn's first move
            document.querySelector(`[data-y="${yAxis[0]}"][data-x="${xAxis[0]}"]`).classList.contains("moved") == false  &&
    
            // checking if it's two steps forward
            parseInt(yAxis[0]) == parseInt(yAxis[1]) + twoStepsBackwards && parseInt(xAxis[0]) == parseInt(xAxis[1]) && 
    
            // making sure no pieces between the current position and the destination  
            piecesNames.some(piecesNames => document.querySelector(`[data-y="${Math.abs(parseInt(yAxis[1]) - oneStepForward)}"][data-x="${xAxis[1]}"]`).classList.contains(piecesNames)) == false &&
            
            // making sure no pieces in the destination position
            piecesNames.some(piecesNames => document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(piecesNames)) == false )
               movementCheck();
    
        // pawn capturing if there is a opponent piece in the target position
        else if ( parseInt(yAxis[0]) + oneStepForward == parseInt(yAxis[1]) && 
            document.querySelector(`[data-y="${yAxis[1]}"][data-x="${xAxis[1]}"]`).classList.contains(opponent) == true && 
            (parseInt(xAxis[0]) + oneStepForward == parseInt(xAxis[1]) || parseInt(xAxis[0]) + oneStepBackwards == parseInt(xAxis[1]) ) ) 
            movementCheck();
    
        else valid ="false";
    }

    function rookLogic() {
    
        // Guard clauses to remove the unlogical rook movement.
        if (xAxis[0] !== xAxis[1] && yAxis[0] !== yAxis[1] ) 
        valid = "false";
    
    
        // determing the direction and breaking if there is a unit between the current position and the destination
        if (parseInt(xAxis[0]) > parseInt(xAxis[1])) 
        {
            for (i = parseInt(xAxis[1]) + 1; i < parseInt(xAxis[0]); i++) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${i}"][data-y="${yAxis[0]}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            }
        }
    
        // determing the direction and breaking if there is a unit between the current position and the destination
        if (parseInt(yAxis[0]) > parseInt(yAxis[1])) 
        {
            for (i = parseInt(yAxis[1]) + 1; i < parseInt(yAxis[0]); i++) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${xAxis[0]}"][data-y="${i}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            }
        }
    
        // determing the direction and breaking if there is a unit between the current position and the destination
        if (parseInt(xAxis[0]) < parseInt(xAxis[1])) 
        {
            for (i = parseInt(xAxis[0]) + 1; i < parseInt(xAxis[1]); i++) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${i}"][data-y="${yAxis[0]}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            }
        }
    
        // determing the direction and breaking if there is a unit between the current position and the destination
        if (parseInt(yAxis[1]) > parseInt(yAxis[0])) 
        {
            for (i = parseInt(yAxis[1]) - 1; i > parseInt(yAxis[0]); i--) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${xAxis[0]}"][data-y="${i}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            }
        }
    
        // calling the Movement Function to approve the move
        if (valid !== "false") movementCheck();
    }
    
    function knightLogic() {
        if ( 
            parseInt(xAxis[0]) - 1 == parseInt(xAxis[1]) && parseInt(yAxis[0]) + 2 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) + 1 == parseInt(xAxis[1]) && parseInt(yAxis[0]) + 2 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) - 1 == parseInt(xAxis[1]) && parseInt(yAxis[0]) - 2 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) + 1 == parseInt(xAxis[1]) && parseInt(yAxis[0]) - 2 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) - 2 == parseInt(xAxis[1]) && parseInt(yAxis[0]) - 1 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) - 2 == parseInt(xAxis[1]) && parseInt(yAxis[0]) + 1 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) + 2 == parseInt(xAxis[1]) && parseInt(yAxis[0]) - 1 == parseInt(yAxis[1]) || 
            parseInt(xAxis[0]) + 2 == parseInt(xAxis[1]) && parseInt(yAxis[0]) + 1 == parseInt(yAxis[1])
            )
            
        {
            movementCheck();
    
        } else { 
            valid ="false";
        }
    }

    function bishopLogic() {
    
        stepX = parseInt(xAxis[1]) - parseInt(xAxis[0]);
        stepY = parseInt(yAxis[1]) - parseInt(yAxis[0]);
    
        // if it's not a proper move, getout of the conditions. ( Guard clause)
        if (Math.abs(stepX) !== Math.abs(stepY)) {
            valid= "false";
        }
    
        // we got 4 dimensions and giving each dimension it's formula ... sadly. #1
        if (xAxis[0] > xAxis[1] && yAxis[0] > yAxis[1] ) {
            
            for (i = parseInt(xAxis[0]) - 1, y = parseInt(yAxis[0]) - 1 
            ; i > xAxis[1] && y > yAxis[1]
            ; i--, y--) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${i}"][data-y="${y}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            } 
        }
    
        // we got 4 dimensions and giving each dimension it's formula ... sadly. #2
        if (xAxis[0] > xAxis[1] && yAxis[0] < yAxis[1] ) {

            for (i = parseInt(xAxis[0]) - 1, y = parseInt(yAxis[0]) + 1 
            ; i > xAxis[1] && y < yAxis[1]
            ; i--, y++) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${i}"][data-y="${y}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            } 
        }
    
        // we got 4 dimensions and giving each dimension it's formula ... sadly. #3
        if (xAxis[0] < xAxis[1] && yAxis[0] < yAxis[1] ) {

            for (i = parseInt(xAxis[0]) + 1, y = parseInt(yAxis[0]) + 1 
            ; i < parseInt(xAxis[1]) && y < parseInt(yAxis[1])  
            ; i++, y++) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${i}"][data-y="${y}"]`).classList.contains(piecesNames))) 
                    valid = "false";
            } 
        }
    
        // we got 4 dimensions and giving each dimension it's formula ... sadly. #4
        if (xAxis[0] < xAxis[1] && yAxis[0] > yAxis[1] ) {

            for (i = parseInt(xAxis[0]) + 1, y = parseInt(yAxis[0]) - 1 
            ; i < xAxis[1] && y > parseInt(yAxis[1])
            ; i++, y--) {
                if (piecesNames.some(piecesNames => document.querySelector(`[data-x="${i}"][data-y="${y}"]`).classList.contains(piecesNames)))
                    valid = "false";
            } 
        }
    
        // calling the Movement Function to approve the move
        if (valid !== "false") movementCheck();
    }
    
    function queenLogic() {
        // if it's a rook movement call the rookLogic(), else call bishopLogic()
        if ( (xAxis[0] == xAxis[1] || yAxis[0] == yAxis[1]) ) 
            rookLogic();
        else bishopLogic();
    }
    
    function kingLogic() {
        if ( 
            // if it moved one step diagonally
            Math.abs( parseInt(xAxis[0]) - parseInt(xAxis[1]) ) == 1 && 
            Math.abs( parseInt(yAxis[0]) - parseInt(yAxis[1]) ) == 1  || 
    
            // if it moved one step vertically
            Math.abs( parseInt(xAxis[0]) - parseInt(xAxis[1]) ) == 1 && 
            Math.abs( parseInt(yAxis[0]) - parseInt(yAxis[1]) ) == 0 || 
            
            // if it moved one step horizontally
            Math.abs( parseInt(xAxis[0]) - parseInt(xAxis[1]) ) == 0 && 
            Math.abs( parseInt(yAxis[0]) - parseInt(yAxis[1]) ) == 1
    
            )
            movementCheck();
        else valid = "false";
    }
}

// Letting the player know which boxes he can move on when clicking on a piece
function possibleMovement() {
    let z = 0;
    for (let y = 8; y > 0; y--) {
        for (x = 1; x < 9; x++) {

            // giving values to the array
            xAxis.push(boxes[z].getAttribute("data-x"));
            yAxis.push(boxes[z].getAttribute("data-y"));

            // reseting valid value
            valid = "";
            
            allLogics();
            if (valid !== "false") {
                boxes[z].classList.add("possible-move");
            }
            yAxis.pop(), xAxis.pop();
            z++;
        }
    }
}

function possibleMoveClassRemoval() {
    // removing the possible-move class from the board 
    let removeCLass = document.getElementsByClassName("possible-move");
    for (;removeCLass.length > 0;) {
        for (i = 0; i < removeCLass.length; i++) {
            removeCLass[0].classList.remove("possible-move");
        }
    }
}

/* 
Things to do : 
[1] Detect if the pawn got target to beat                                           [ done ]
[2] Detect if the pawn got another piece infront of it and prevent it from moving.  [ done ]
[3] Checkmate conditions. 
[4] Detect which turn is it.                                                        [ done ]
[5] If it's second player turn convert the x numerical using function.              [ done ]
[6] fix auto respawn pawns.                                                         [ done ]
[7] Make the second player logic properly.                                          [ done ]
[8] Let the user know which boxes he can move to.
[9] Let the user know which player turn is it.
[10] Undo button. 
[11] Move history. 
[12] in the pawn logic .. in case jumpe two stteps .. if there is a piece infront of it in the first box .. he can't jump through it. [ done ]
[13] Consider the king movement depending on the checkmate conditions.
[14] consider all pieces movement if they covering king's checkmate.
*/ 