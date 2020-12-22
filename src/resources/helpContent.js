export default {
  // Register
  intro: {
    CHECKERS_DESC: 'Checkers, also known as Draughts, is a two-player strategy board game which involves \
                    diagonal moves of uniform game pieces and mandatory captures by jumping over opponent’s pieces. ',
  },
  prepObj: {
    PREPARATION: 'The game is played on an 8x8 standard chess board of 64 black and white checkered squares \
                  with each player having 12 starting pieces. The board is positioned with a light colored square \
                  on the bottom right corner, while the checkers are set up on dark colored squares. ',
    OBJECTIVE: 'The objective of the game is to capture all opponent’s checker pieces or to trap the opponent so \
                that no move can be made. In the pictures below, black has capture all white pieces (left) and black \
                has cornered all white pieces (right).'
  },
  mechanics: {
    INTRO: 'The game begins with one player, having the white checker pieces, making the first move. On each turn, \
            move any one of your checker pieces by any allowed movement described below. After you make the move, the turn \
            is over. The game goes on with players alternating turns. ',
    REG_MOVEMENT: 'A single checker piece can only move one space diagonally forward to an empty square.',
    REG_CAPTURE_1: 'If a player can make a capture, he / she has to make that capture.',
    REG_CAPTURE_2: 'A capture is made when the player uses his / her checker piece to jump over the opponent’s checker piece and lands \
                    in the same diagonal. A jump can only be made when the square behind the opponent’s checker piece is open and only one \
                    checker piece may be captured in a single jump.',
    REG_CAPTURE_3: 'More than one checker piece can be captured during a turn by making multiple jumps with the same checker piece. The \
                    move comes to an end only when the position of the piece no longer permits it to take any more pieces or when the piece \
                    arrives at the far edge of the board.',
    REG_CAPTURE_4: 'A normal checker piece can only capture / jump forward (towards the opponent), and cannot capture / jump backwards.',
    KING_UPGRADE: 'If a player’s checker piece reaches the farthest row or the other side of the board, that checker piece is crowned King. ',
    KING_MOVEMENT: 'King pieces are “flying kings”, which means that a King checker piece can move multiple spaces diagonally forward or \
                    backward on the same diagonal. ',
    KING_CAPTURE_1: 'A king checker piece can capture the opponent’s checker piece forward and backward diagonally. A capture can only be \
                    made if all three of these conditions are met:',
    KING_CAPTURE_2: 'The opponent’s checker piece is on the same diagonal as the king checker piece',
    KING_CAPTURE_3: 'The squares between them must be unoccupied', 
    KING_CAPTURE_4: 'Any direct square after the piece that will be captured is also unoccupied',
    KING_CAPTURE_5: 'If continuous capture is possible, then the player must keep capturing until the position of the piece no longer permits \
                    it to make any more captures. '
  },
  howToWin: {
    WIN_CONDITIONS: 'The winner is declared when one of the following conditions is met: ',
    CONDITION_1: 'The opposing player is unable to make any more moves with his / her pieces',
    CONDITION_2: 'The opposing player has no checker pieces left',
    CONDITION_3: 'The opposing player’s time has ran out',
    DRAW_OFFER: 'A “draw” button will appear if each player has 3 or less checker pieces left. A player may offer a draw option to his / \
                her opponent. If a player refuses the offer of a draw, the player is required to make a capture within 20 moves from that point.',
    DRAW_SUCCESS: 'If the player failed to make a capture within 20 moves, then the result of the game will be a draw.',
    DRAW_RESET: 'If the player makes a capture within 20 moves. The draw counter will reset to 0 and the count will start all over again until a \
                winner is declared or when a draw is determined. ',
    POINT_SYSTEM: 'At the end of the game, the winner will have his total points increased by 1 while the loser\'s will be decresed by 0.5. For \
                  a draw, both players will receive 0.5 points.'
  }
}