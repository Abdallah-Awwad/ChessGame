// Selected Pieces Counter
let selectedPieces = 0;
// contains all chess pieces' names 
let piecesNames = ["pawn", "queen", "king", "bishop", "rook", "knight"];

// contains all board boxes
let boxes = document.querySelectorAll(".game .column");

let xAxis = [], yAxis = [];

let findNextMoveXY = `[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`;
let findCurrentMoveXY = document.querySelector(`[data-x="${xAxis[0]}"][data-y="${yAxis[0]}"]`);
let findCurrentX = document.querySelector(`[data-x="${xAxis[0]}"]`);

// defining which player turn is it
let currentTurn = "first-player";

// switching the turn
function SwitchcurrentTurn() {
    currentTurn == "first-player" ? currentTurn = "second-player" : currentTurn = "first-player";
}

// detectinng opponent (could be improved later)
let opponent = "";
function detectOpponent() {
    currentTurn == "first-player" ? opponent = "second-player" : opponent = "first-player";
}

// give data-x and data-y to every box in the board to identify them using js
function setXY(condition) {
    let z = 0;
    if (condition == "first-player") {
        for (let x = 8; x > 0; x--) {
            for (y = 1; y < 9; y++) {
                boxes[z].setAttribute("data-x", x);
                boxes[z].setAttribute("data-y", y);
                z++;
            }
        }
    }
    else if (condition == "second-player") {
        for (let x = 1; x < 9; x++) {
            for (y = 8; y > 0; y--) {
                boxes[z].setAttribute("data-x", x);
                boxes[z].setAttribute("data-y", y);
                z++;
            }
        }
    }
}

// Starting the game function (puting the pieces in it's place)
function initiateGame() {
    // adding span to every box for better formating in css
    for(x = 0; x < boxes.length; x++){
        boxes[x].appendChild(document.createElement("span"));
    }

    // adding the pieces to the board in their places
    z = 0;
    for (x = 8; x > 0; x--) {
        for (y = 1; y < 9; y++) {

            // adding second-player pawns 
            if (x == 7) boxes[z].classList.add("pawn", "second-player");
            
            // adding black pawns 
            if (x == 2) boxes[z].classList.add("pawn", "first-player");

            // adding second-player bishops 
            if (x == 8 && y == 3 || x == 8 && y == 6) boxes[z].classList.add("bishop", "second-player");

            // adding black bishops 
            if (x == 1 && y == 3 || x == 1 && y == 6) boxes[z].classList.add("bishop", "first-player");

            // adding second-player knight 
            if (x == 8 && y == 2 || x == 8 && y == 7) boxes[z].classList.add("knight", "second-player");

            // adding black knight 
            if (x == 1 && y == 2 || x == 1 && y == 7) boxes[z].classList.add("knight", "first-player");

            // adding second-player Rook
            if (x == 8 && y == 1 || x == 8 && y == 8) boxes[z].classList.add("rook", "second-player");

            // adding black Rook
            if (x == 1 && y == 1 || x == 1 && y == 8) boxes[z].classList.add("rook", "first-player");

            // adding second-player queen 
            if (x == 8 && y == 4) boxes[z].classList.add("queen", "second-player");

            // adding black queen 
            if (x == 1 && y == 4) boxes[z].classList.add("queen", "first-player");

            // adding second-player king 
            if (x == 8 && y == 5) boxes[z].classList.add("king", "second-player");

            // adding black king 
            if (x == 1 && y == 5) boxes[z].classList.add("king", "first-player");

            // adding click event 
            boxes[z].addEventListener("click", function(){
                moving(this);
              });
        
            z++;
        }
    }
}

initiateGame();

// when clicking get me the x and y from the piece
function moving(box) {
    
    // if it's first selection 
    if (selectedPieces == 0) {
        
        // checing which turn is it and rotating the x and y depending on it to make the logic works fine
        if (box.classList.contains(currentTurn)) {
            setXY(currentTurn);

            console.log("yes u can play");
    
        } else {
            return console.log("not ur turn") ;
    
        } 
        
        // Checking if the box contains a piece
        if (piecesNames.some(piecesNames => box.classList.contains(piecesNames))) {

            // adding .selected to the first selection 
            box.classList.add("selected");

            // giving values to the array
            xAxis.push(box.getAttribute("data-x"))
            yAxis.push(box.getAttribute("data-y"))

            selectedPieces++;
        } 
        
        // if it's second selection 
        } else if (selectedPieces == 1) {

            xAxis.push(box.getAttribute("data-x"))
            yAxis.push(box.getAttribute("data-y"))
            
            // checking if the second click on the same box 
            if (xAxis[0] == xAxis[1] && yAxis[0] == yAxis[1]) {
                
                // Cancels the movement and reseting the array 
                document.querySelector(`[data-x="${xAxis[0]}"][data-y="${yAxis[0]}"]`).classList.remove("selected");
                console.log("Same piece bitch");
                selectedPieces = 0;
                return xAxis = [], yAxis = [];
            }
            else {
                // giving values to the array

                console.log("Data sent to pawnLogic");
                console.log(xAxis, yAxis);
                // Giving the target position axis to the function
                pawnLogic();
            }
        }
        
        else  {
            console.log("Can't press here now");  
        }

    // if the div empty do nothing

    // if the div contains pawn do pawn function
    // console.log(`x=${box.getAttribute("data-x")} y= ${box.getAttribute("data-y")}`);
}
  


// Start Pieces Logic where x y the current position and x2 y2 the target position

function pawnLogic() {
    // updating the opponent for later use
    detectOpponent();

    // moving the pawn one step ahead 
    if ( parseInt(xAxis[0]) == parseInt(xAxis[1]- 1) && parseInt(yAxis[0]) == parseInt(yAxis[1]) && 
        piecesNames.some(piecesNames => document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.contains(piecesNames)) == false   ) {

        console.log("pawn moved one step");
        // Remove the classed from the current position
        
        doAnimation("normalMove");    

        // Make class to the target position and add .moved to the pawn
        endTurn("pawn");
    } 

    
    // pawn capturing if there is a opponent piece in the target position
    else if (parseInt(xAxis[0]) == parseInt(xAxis[1]) - 1 && 
        document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.contains(opponent) == true && 
        (parseInt(yAxis[0]) == parseInt(yAxis[1]) - 1 || parseInt(yAxis[0]) == parseInt(yAxis[1]) + 1)  
        ) {
        
        doAnimation("capture");    
        endTurn("pawn");

        
        /* 
        if ((x + 1) && (y - 1)) || ((x + 1) && (y + 1)) and have .second-player 
        6 - 4 can capture from : 
        
        7 - 3  
        7 - 5 
        */ 
        }

       // if it's pawn's first move make it two jumps
       else if (document.querySelector(`[data-x="${xAxis[0]}"][data-y="${yAxis[0]}"]`).classList.contains("moved") == false) {
           if (parseInt(xAxis[0]) == parseInt(xAxis[1]- 2) && parseInt(yAxis[0]) == parseInt(yAxis[1]) &&
               piecesNames.some(piecesNames => document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.contains(piecesNames)) == false   )
           {
               doAnimation("normalMove");
               endTurn("pawn");
               console.log("pawn moved two step");
           } 
       } 

    else { 
        console.log("Wrong move"); 
    }
    return xAxis.pop(),yAxis.pop();
    
}

// End Pieces Logic

// End Turn function 
function endTurn(piece) {
    selectedPieces = 0;

    // preventing player from pressing till the animation done
    document.body.style.pointerEvents="none";
    
    // Start Moving the piece 
    // Removing classes from the current position
    document.querySelector(`[data-x="${xAxis[0]}"][data-y="${yAxis[0]}"]`).classList.remove(piece, currentTurn);
    document.querySelector(`[data-x="${xAxis[0]}"][data-y="${yAxis[0]}"]`).classList.remove("moved");

    // in case capture removing whatever the enemy unit in the new position
    piecesNames.some(piecesNames => document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.remove(piecesNames, opponent));

    // adding classes to the new position
    document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.add(piece, currentTurn, "second-choice");
    document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"]`).classList.add("moved");

    // End Moving the piece 

    // Ending the turn and clear selections
    setTimeout(() => {
        document.querySelector(".selected").classList.remove("selected");
        document.querySelector(".second-choice").classList.remove("second-choice");

        // giving the ability to press again 
        document.body.style.pointerEvents="initial";
    }, "1000");

    SwitchcurrentTurn();

    return xAxis = [], yAxis = [];
}

// Making animation when a piece moves
function doAnimation(animationType) {
    // detecting if it's capture move or normal move to determine the animationtype 
    animationType == "normalMove" ? animationType = "fa-bounce" : animationType = "fa-beat";
    
    document.querySelector(`[data-x="${xAxis[1]}"][data-y="${yAxis[1]}"] span`).classList.add(animationType);
    
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
[5] If it's second player turn convert the y numerical using function. [ done ]
[6] fix auto respawn pawns 
[7] Make the second player logic properly. [ done ]
[8] Let the user know which boxes he can move to.
[9] Let the user know which player turn is it.
*/ 