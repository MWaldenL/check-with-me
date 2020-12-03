import {
  bBlackExistsAdj,
  bWhiteExistsAdj,
} from '@/store/services/moveCaptureService'

const pieceGetter

/*
  Checks if white has any valid moves
  */
export const checkIfWhiteStuck = (board, whiteCells) => {
  let bBlockedLeft = true
  let bBlockedRight = true

  for (const cell of whiteCells) {
    // for top left
    if (board[cell.nRow][cell.nCol].bHasBlackChip || board[cell.nRow][cell.nCol].bHasBlackKing) { // check for ally top left block
      

    } else if (board[cell.nRow][cell.nCol].bHasWhiteChip || board[cell.nRow][cell.nCol].bHasWhiteKing) { // check for top left capture
      if (board[cell.nRow][cell.nCol].bHasBlackChip || board[cell.nRow][cell.nCol].bHasBlackKing) { // check for ally top left capture block
        
      } else {
        bIsStuck = false;
      }
    }

    // for top right
    if (board[cell.nRow][cell.nCol].bHasBlackChip || board[cell.nRow][cell.nCol].bHasBlackKing) { // check for ally top right block
      

    } else if (board[cell.nRow][cell.nCol].bHasWhiteChip || board[cell.nRow][cell.nCol].bHasWhiteKing) { // check for top right capture
      if (board[cell.nRow][cell.nCol].bHasBlackChip || board[cell.nRow][cell.nCol].bHasBlackKing) { // check for ally top right capture block
        
      } else {
        bIsStuck = false;
      }
    }
  }

  return bBlockedLeft && bBlockedRight
}

/*
  Checks if black has any valid moves
  */
 export const checkifBlackStuck = (board, blackCells) => {
  // check for ally block

  // check for capture

  // check for king capture
  
}
