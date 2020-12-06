/*
  Checks if white has any valid moves
  */

const filterWhite = board => {
  let whiteCells = []

  for(let r = 0; r < 8; r++) {
    for(let c = 0; c < 8; c++) {
      if (board[r][c].bHasWhiteChip || board[r][c].bHasWhiteKing)
        whiteCells.push(board[r][c])
    }
  }

  return whiteCells
}

const filterBlack = board => {
  let blackCells = []

  for(let r = 0; r < 8; r++) {
    for(let c = 0; c < 8; c++) {
      if (board[r][c].bHasBlackChip || board[r][c].bHasBlackKing)
        blackCells.push(board[r][c])
    }
  }

  return blackCells
}

export const checkIfWhiteStuck = (board) => {
  let whiteCells = filterWhite(board)
  //console.log("whiteCells")
  let bBlocked = true

  for (const cell of whiteCells) {
    //console.log(cell.nRow + ' ' + cell.nCol)
    // checks whether top right is blocked
    if(bBlocked === true && cell.nCol < 8 && cell.nRow < 8) {
      if (board[cell.nRow][cell.nCol].bHasWhiteChip || board[cell.nRow][cell.nCol].bHasWhiteKing) { // check for ally top right block
        ;
      } else if (board[cell.nRow][cell.nCol].bHasBlackChip || board[cell.nRow][cell.nCol].bHasBlackKing) { // check for top right capture
          if (cell.nCol < 7 && cell.nRow < 7) {
            if (!(board[cell.nRow + 1][cell.nCol + 1].bHasBlackChip || board[cell.nRow + 1][cell.nCol + 1].bHasBlackKing || board[cell.nRow + 1][cell.nCol + 1].bHasWhiteChip || board[cell.nRow + 1][cell.nCol + 1].bHasWhiteKing)) { // check for top right capture block 
              bBlocked = false
            }
          } 
      } else {
        bBlocked = false
      }
    }

    // checks whether top left is blocked
    if(bBlocked === true &&cell.nCol > 1 && cell.nRow < 8) {
      if (board[cell.nRow][cell.nCol - 2].bHasWhiteChip || board[cell.nRow][cell.nCol - 2].bHasWhiteKing) { // check for ally top left block
        ;
      } else if (board[cell.nRow][cell.nCol - 2].bHasBlackChip || board[cell.nRow][cell.nCol - 2].bHasBlackKing) { // check for top left capture
          if (cell.nCol > 2 && cell.nRow < 7) {
            if (!(board[cell.nRow + 1][cell.nCol - 3].bHasBlackChip || board[cell.nRow + 1][cell.nCol - 3].bHasBlackKing || board[cell.nRow + 1][cell.nCol - 3].bHasWhiteChip || board[cell.nRow + 1][cell.nCol - 3].bHasWhiteKing)) { // check for top left capture block 
              bBlocked = false
            }
          }
      } else {
        bBlocked = false
      }
    }
  }

  return bBlocked
}

/*
  Checks if black has any valid moves
  */
 export const checkIfBlackStuck = (board) => {
  let blackCells = filterBlack(board)
  //console.log("BLACK")
  let bBlocked = true

  for (const cell of blackCells) {
    //console.log(cell.nRow + ' ' + cell.nCol)
    // checks whether bot right is blocked
    if(bBlocked === true && cell.nCol < 8 && cell.nRow > 1) {
      if (board[cell.nRow - 2][cell.nCol].bHasBlackChip || board[cell.nRow - 2][cell.nCol].bHasBlackKing) { // check for ally top right block
        //console.log("ally");
      } else if (board[cell.nRow - 2][cell.nCol].bHasWhiteChip || board[cell.nRow - 2][cell.nCol].bHasWhiteKing) { // check for top right capture
          //console.log("enemy");
          if (cell.nCol < 7 && cell.nRow > 2) {
            if (!(board[cell.nRow - 3][cell.nCol + 1].bHasBlackChip || board[cell.nRow - 3][cell.nCol + 1].bHasBlackKing || board[cell.nRow - 3][cell.nCol + 1].bHasWhiteChip || board[cell.nRow - 3][cell.nCol + 1].bHasWhiteKing)) { // check for top right capture block 
              bBlocked = false
            }
          } 
      } else {
        //console.log("empty");
        bBlocked = false
      }
    } else {
      //console.log("skip")
    }
    //console.log(bBlocked)

    // checks whether bot left is blocked
    if(bBlocked === true && cell.nCol > 1 && cell.nRow > 1) {
      if (board[cell.nRow - 2][cell.nCol - 2].bHasBlackChip || board[cell.nRow - 2][cell.nCol - 2].bHasBlackKing) { // check for ally top left block
        //console.log("ally");
      } else if (board[cell.nRow - 2][cell.nCol - 2].bHasWhiteChip || board[cell.nRow - 2][cell.nCol - 2].bHasWhiteKing) { // check for top left capture
          //console.log("enemy");
          if (cell.nCol > 2 && cell.nRow > 2) {
            if (!(board[cell.nRow - 3][cell.nCol - 3].bHasBlackChip || board[cell.nRow - 3][cell.nCol - 3].bHasBlackKing || board[cell.nRow - 3][cell.nCol - 3].bHasWhiteChip || board[cell.nRow - 3][cell.nCol - 3].bHasWhiteKing)) { // check for top left capture block 
              bBlocked = false
            }
          }
      } else {
        //console.log("empty");
        bBlocked = false
      }
    } else {
      //console.log("skip")
    }
    //console.log(bBlocked)
  }

  return bBlocked
}
