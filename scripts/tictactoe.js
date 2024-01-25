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
    //Log the play
    console.log(
      `${activePlayer.name} is marking cell row: ${row} x column: ${column}...`
    );

    board.makePlay(row, column, getActivePlayer().mark);

    //TODO: CHECK FOR A WINNER HERE
    // let winState = checkWinState(row, column);

    //Switch the player turn
    switchPlayerTurn();
    printNewRound();
  };

  /**
   * Creates and returns arrays of all cells that may be necessary to win a game of Tic Tac Toe.
   * Used by the checkWinState function
   */
  const getGoalSets = (row, col) => {
    let currentBoardState = board.getBoard();

    //Set up arrays to hold the different values
    let horizontalSet = [];
    let verticalSet = [];
    let diagonalDownRightSet = [];
    let diagonalUpRightSet = [];

    //Look at each cell in each row and add a cell to a specific array. Return the four arrays.
    //There are 4 possible lists we want:
    ////Horizontal: the cells in the same row (easy);
    ////Vertical: the cells in the same column (easy);
    ////Diagonal-down-right: the cells in a diagonal that descends as it goes right
    ////Diagonal-up-right: the cells in a diagonal that descends as it goes right
    //It the cell is in the same vertical column then
    currentBoardState.forEach((row, rowIndex) => {
      //Used to calculate correct diagonal position. When 1 row above cell, diagonal is 1 column to left or right
      let offset = row - rowIndex;

      //The second loop may not be necessary.
      //--!!TRY LATER JUST USING ROWS/WITHOUT THE SECOND LOOP!!--
      row.forEach((cell, columnIndex) => {
        if (rowIndex === row) {
          //Cell is in the same row
          horizontalSet.push(cell.getValue());
        } else if (columnIndex === col) {
          //Cell is in the same column
          verticalSet.push(cell.getValue);
        } else if (rowIndex < row) {
          //All rows above the cell
          //The cell may be one of the diagonals "above" the current cell
        } else {
          //All rows below the cell
          //The cell may be
        }
      });
    });
  };

  // const checkWinState = (row, col) => {
  //   let diagonalPossible = column > 0 && column < board.getBoard.length - 1;
  //   if (diagonalPossible) {
  //   }
  // };

  //Start a new game here
  printNewRound();

  const getBoard = () => board;

  return { playRound, getActivePlayer, getBoard };
}

const game = GameController();
