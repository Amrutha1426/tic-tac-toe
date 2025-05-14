/**
 * AI opponent for the Tic-Tac-Toe game
 * Implements different difficulty levels
 */

const GameAI = (() => {
  // Private variables and methods
  const difficulties = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  };

  /**
   * Makes a move based on the current difficulty level
   * @param {Array} board - Current game board
   * @param {String} playerMark - AI player's mark (X or O)
   * @param {String} difficulty - Difficulty level
   * @returns {Number} Index of the chosen move
   */
  const makeMove = (board, playerMark, difficulty = difficulties.EASY) => {
    switch (difficulty) {
      case difficulties.HARD:
        return minimaxMove(board, playerMark);
      case difficulties.MEDIUM:
        return Math.random() < 0.6 
          ? strategicMove(board, playerMark) 
          : randomMove(board);
      case difficulties.EASY:
      default:
        return randomMove(board);
    }
  };

  /**
   * Makes a random valid move
   * @param {Array} board - Current game board
   * @returns {Number} Index of the chosen move
   */
  const randomMove = (board) => {
    const availableMoves = board
      .map((cell, index) => cell === '' ? index : null)
      .filter(cell => cell !== null);

    if (availableMoves.length === 0) return -1;
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  };

  /**
   * Makes a semi-strategic move:
   * 1. Win if possible
   * 2. Block opponent's win if possible
   * 3. Take center if available
   * 4. Take a random move
   * 
   * @param {Array} board - Current game board
   * @param {String} playerMark - AI player's mark (X or O)
   * @returns {Number} Index of the chosen move
   */
  const strategicMove = (board, playerMark) => {
    const opponentMark = playerMark === 'X' ? 'O' : 'X';
    
    // Check for winning move
    const winningMove = findWinningMove(board, playerMark);
    if (winningMove !== -1) return winningMove;
    
    // Check for blocking move
    const blockingMove = findWinningMove(board, opponentMark);
    if (blockingMove !== -1) return blockingMove;
    
    // Take center if available
    if (board[4] === '') return 4;
    
    // Take a random move
    return randomMove(board);
  };

  /**
   * Finds a winning move for the given player
   * @param {Array} board - Current game board
   * @param {String} playerMark - Player's mark (X or O)
   * @returns {Number} Index of winning move or -1 if none
   */
  const findWinningMove = (board, playerMark) => {
    // Check all win patterns
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
      [0, 4, 8], [2, 4, 6]              // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      // If two cells have the player's mark and the third is empty
      if (board[a] === playerMark && board[b] === playerMark && board[c] === '') {
        return c;
      }
      if (board[a] === playerMark && board[c] === playerMark && board[b] === '') {
        return b;
      }
      if (board[b] === playerMark && board[c] === playerMark && board[a] === '') {
        return a;
      }
    }
    
    return -1;
  };

  /**
   * Makes the optimal move using the minimax algorithm
   * @param {Array} board - Current game board
   * @param {String} playerMark - AI player's mark (X or O)
   * @returns {Number} Index of the chosen move
   */
  const minimaxMove = (board, playerMark) => {
    const opponentMark = playerMark === 'X' ? 'O' : 'X';
    let bestScore = -Infinity;
    let bestMove = -1;
    
    // Check each available move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        // Try this move
        board[i] = playerMark;
        // Calculate score from this move
        const score = minimax(board, 0, false, playerMark, opponentMark);
        // Undo move
        board[i] = '';
        
        // Update best move if needed
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  };

  /**
   * Minimax algorithm implementation
   * @param {Array} board - Current game board
   * @param {Number} depth - Current depth in the game tree
   * @param {Boolean} isMaximizing - Whether current player is maximizing
   * @param {String} playerMark - AI player's mark (X or O)
   * @param {String} opponentMark - Opponent's mark (X or O)
   * @returns {Number} Score of the board position
   */
  const minimax = (board, depth, isMaximizing, playerMark, opponentMark) => {
    // Check for terminal states
    const winner = checkWinner(board);
    if (winner === playerMark) return 10 - depth;
    if (winner === opponentMark) return depth - 10;
    if (isBoardFull(board)) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = playerMark;
          const score = minimax(board, depth + 1, false, playerMark, opponentMark);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = opponentMark;
          const score = minimax(board, depth + 1, true, playerMark, opponentMark);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  /**
   * Checks if the board has a winner
   * @param {Array} board - Current game board
   * @returns {String|null} Winner's mark or null if no winner
   */
  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
      [0, 4, 8], [2, 4, 6]              // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    return null;
  };

  /**
   * Checks if the board is full
   * @param {Array} board - Current game board
   * @returns {Boolean} True if board is full, false otherwise
   */
  const isBoardFull = (board) => {
    return !board.includes('');
  };

  // Public API
  return {
    makeMove,
    difficulties
  };
})();