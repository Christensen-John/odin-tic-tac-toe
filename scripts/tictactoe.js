function ScreenController() {
  const htmlBoard = document.querySelector(".gameboard");
  const htmlPlayerIndicator = document.querySelector(".playerIndicator");
  const game = GameController();

  const updateScreen = (winMarker) => {
    let board = game.getBoard();
    if (winMarker === 0) {
      displayTie();
      //tie
    } else if (winMarker === 1) {
      displayWin(board);
      //active player wins
    } else {
      resetHTMLContent();
      updateHTMLPlayerIndicator();
      updateHTMLGameBoard(board);
    }
  };

  //Helper Functions
  const resetHTMLContent = () => {
    htmlBoard.innerHTML = "";
    htmlPlayerIndicator.innerHTML = "";
  };

  const updateHTMLPlayerIndicator = () => {
    let currentPlayer = game.getActivePlayer().name;
    htmlPlayerIndicator.innerHTML = `${currentPlayer}'s turn`;
  };

  const updateHTMLGameBoard = (brd) => {
    brd.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        let buttonText = "_";
        let cellVal = cell.getValue();
        if (cellVal === "X" || cellVal === "O") {
          buttonText = cellVal;
        }
        cellButton.textContent = buttonText;
        htmlBoard.appendChild(cellButton);
      });
    });
  };

  const displayTie = () => {
    window.alert("The game is a tie! Play again?");
    resetGameWindow();
  };

  const displayWin = (brd) => {
    window.alert(`${brd.getActivePlayer()} wins!`);
    resetGameWindow();
  };

  const resetGameWindow = () => {
    //TODO
  };

  function clickHandlerBoard(e) {
    let cellRow = Number(e.target.dataset.row);
    let cellColumn = Number(e.target.dataset.column);
    if (!cellRow && !cellColumn) return;

    let winMarker = game.playRound(cellRow, cellColumn);
    updateScreen(winMarker);
  }

  htmlBoard.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

function Gameboard() {
  const boardSize = 3;
  const board = [];

  //Create the tic tac toe board immediately upon callind the Gameboard factory function:
  //The board will be a 2D array of equal length and width;
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i].push(Cell());
    }
  }

  /**
   * @returns a 2D array representing the board state
   */
  const getBoard = () => board;

  /**
   *
   * @param {int} row The row to be played on
   * @param {int} column The column to be played on
   * @param {Player} player The Player that is making a game move
   * @returns
   */
  const makePlay = (row, column, playerMark) => {
    console.log(board[row][column].playSquare(playerMark));
    //Add the mark of the player to the cell
  };

  /**
   * Prints the current board state.
   * Only used during games on the console
   */
  const printBoard = () => {
    let boardState = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardState);
  };

  const getVerticalColumn = (column) => {
    //Returns all cells in a vertical column
    let columnSet = [];
    board.forEach((row) => {
      columnSet.push(row[column].getValue());
    });
    return columnSet;
  };

  const getRow = (row) => {
    //Returns all cells in a row
    let rowSet = [];
    board[row].forEach((cell) => {
      rowSet.push(cell.getValue());
    });
    return rowSet;
  };

  //Returns all cells in a down-right diagonal
  const getDownRightDiagonal = (cellRow, cellColumn) => {
    let diagonalSet = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        let rowOffset = rowIndex - cellRow;
        let columnOffset = columnIndex - cellColumn;
        //Cells in the down/right angle set have the same values when normalized by distance from the chosen cell.
        if (rowOffset === columnOffset) {
          diagonalSet.push(cell.getValue());
        }
      });
    });
    return diagonalSet;
  };

  const getUpRightDiagonal = (cellRow, cellColumn) => {
    let diagonalSet = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        let rowOffset = rowIndex - cellRow;
        let columnOffset = columnIndex - cellColumn;
        //Cells in the up/right angle set have opposite values for row and column when normalized by distance from the chosen cell.
        //Therefore one value of the pair needs to be muliplied by -1 to check if they are the "same" distance.
        if (rowOffset * -1 === columnOffset) {
          diagonalSet.push(cell.getValue());
        }
      });
    });
    return diagonalSet;
  };

  const getCellSets = (row, column) => {
    let sets = [];
    sets.push(getVerticalColumn(column));
    sets.push(getRow(row));
    sets.push(getDownRightDiagonal(row, column));
    sets.push(getUpRightDiagonal(row, column));
    return sets;
  };

  return {
    getBoard,
    makePlay,
    printBoard,
    getCellSets,
  };
}

/**
 * A Cell is a square on a Tic Tac Toe Board and can hold one of the following values:
 * '': An empty square that a player might choose.
 * 'X': A mark for the "X" player
 * 'O': A mark for the "O" player
 */
function Cell() {
  //"Private" variable to hold the value of the cell
  let value = "";

  //Function that can return the value of the cell
  const getValue = () => value;

  /**
   *
   * @param {Player} player the Player object marking the cell
   * @returns A String that is either an error or the Player's mark
   */
  const playSquare = (playerMark) => {
    if (value !== "") {
      return "Error: Square already taken";
    }
    return (value = playerMark);
  };

  //Return an object with the Cell functions
  return { getValue, playSquare };
}

function GameController(
  PlayerOneName = "Player One",
  PlayerTwoName = "Player Two"
) {
  const board = Gameboard();

  //An array of player objects
  //Each player has a name and a mark (either X or O)
  const players = [
    {
      name: PlayerOneName,
      mark: "X",
    },
    {
      name: PlayerTwoName,
      mark: "O",
    },
  ];

  let activePlayer = players[0];

  /**
   * Switches the active player to the non-active player
   */
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  /**
   * Prints to the console the current board state and the name of the active player who's turn it is.
   */
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  /**
   * Plays through a single round of Tic Tac Toe. The current active player has chosen a cell and the game state
   * will update based on that play.
   * @param {int} row The row of the cell that the active player is choosing to play on
   * @param {int} column The column of the cell that the active player is choosing to play on
   */
  const playRound = (row, column) => {
    if (!isLegalMove(row, column)) {
      console.log(
        `Spot already played on! Please choose another spot to play.`
      );
      printNewRound();
    } else {
      //Log the play
      console.log(
        `${activePlayer.name} is marking cell row: ${row} x column: ${column}...`
      );

      //Make the play
      board.makePlay(row, column, getActivePlayer().mark);

      let winState = -1;
      //Check if move wins
      if (checkWinState(row, column)) {
        board.printBoard();
        console.log(`${activePlayer.name} wins!`);
        return 1;
      } else if (checkForDraw(board.getBoard())) {
        return 0;
      } else {
        //Move did not win. Switch players and play another round
        switchPlayerTurn();
        printNewRound();
        return -1;
      }
    }
  };

  const isLegalMove = (row, column) => {
    let cellToCheck = board.getBoard()[row][column];
    return cellToCheck.getValue() === "" ? true : false;
  };

  const checkWinState = (row, col) => {
    let sets = board.getCellSets(row, col);
    let winState = false;
    sets.forEach((set) => {
      checkSetEquality(set) ? (winState = true) : "continue";
    });
    return winState;
  };

  const checkSetEquality = (cellSet) => {
    if (cellSet.length < 3) {
      return false;
    }
    let cellEquality = true;
    let firstValue = cellSet[0];
    cellSet.forEach((value) => {
      firstValue === value ? "continue" : (cellEquality = false);
    });
    return cellEquality;
  };

  const checkForDraw = (brd) => {
    brd.forEach((row) => {
      row.forEach((cell) => {
        if (cell.getValue() === "") {
          return false;
        }
      });
    });
  };

  //Start a new game here
  printNewRound();

  //Function below for testing only
  // const getBoard = () => board;

  return {
    playRound,
    getActivePlayer,
    checkSetEquality,
    //Pass on the ability to see the board in a neat way without having to write two getboard functions in two modules
    getBoard: board.getBoard,
  };
}

// const game = GameController();
ScreenController();
