/**
 * Game board management for the Tic-Tac-Toe game
 * Handles the game state, move validation, and win conditions
 */

const GameBoard = (() => {
  // Private variables and methods
  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameOver = false;
  let winPattern = null;
  let moveHistory = [];

  /**
   * Initializes or resets the game board
   */
  const initialize = () => {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameOver = false;
    winPattern = null;
    moveHistory = [];
    
    return { board, currentPlayer, gameOver };
  };

  /**
   * Makes a move on the board
   * @param {Number} index - Index of the cell (0-8)
   * @returns {Object} Object containing updated game state
   */
  const makeMove = (index) => {
    // If game is over or cell is already filled, return without making a move
    if (gameOver || board[index] !== '') {
      return { valid: false, board, currentPlayer, gameOver, winPattern };
    }
    
    // Record move in history
    moveHistory.push({
      index,
      player: currentPlayer,
      board: [...board]
    });
    
    // Make the move
    board[index] = currentPlayer;
    
    // Check for win or draw
    const winner = checkWinner();
    if (winner) {
      gameOver = true;
      return { 
        valid: true, 
        board, 
        currentPlayer, 
        gameOver, 
        winner, 
        winPattern,
        isDraw: false
      };
    }
    
    // Check for draw
    if (isBoardFull()) {
      gameOver = true;
      return { 
        valid: true, 
        board, 
        currentPlayer, 
        gameOver, 
        winner: null, 
        winPattern: null,
        isDraw: true
      };
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    return { 
      valid: true, 
      board, 
      currentPlayer, 
      gameOver, 
      winner: null, 
      winPattern: null,
      isDraw: false
    };
  };

  /**
   * Checks if the board has a winner
   * @returns {String|null} Winner's mark or null if no winner
   */
  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
      [0, 4, 8], [2, 4, 6]              // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        winPattern = pattern;
        return board[a];
      }
    }
    
    return null;
  };

  /**
   * Checks if the board is full
   * @returns {Boolean} True if board is full, false otherwise
   */
  const isBoardFull = () => {
    return !board.includes('');
  };

  /**
   * Gets the current state of the board
   * @returns {Object} Object containing current game state
   */
  const getState = () => {
    return {
      board: [...board],
      currentPlayer,
      gameOver,
      winPattern
    };
  };

  /**
   * Sets the game state from a saved state
   * @param {Object} state - Object containing game state
   */
  const setState = (state) => {
    if (!state || !state.board) {
      return initialize();
    }
    
    board = [...state.board];
    currentPlayer = state.currentPlayer || 'X';
    gameOver = state.gameOver || false;
    winPattern = state.winPattern || null;
    moveHistory = state.moveHistory || [];
    
    return getState();
  };

  /**
   * Undoes the last move
   * @returns {Object|null} Object containing updated game state or null if no moves to undo
   */
  const undoMove = () => {
    if (moveHistory.length === 0) {
      return null;
    }
    
    const lastMove = moveHistory.pop();
    board = [...lastMove.board];
    currentPlayer = lastMove.player;
    gameOver = false;
    winPattern = null;
    
    return { 
      valid: true, 
      board, 
      currentPlayer, 
      gameOver, 
      winner: null, 
      winPattern: null,
      isDraw: false
    };
  };
  
  /**
   * Gets the current win pattern
   * @returns {Array|null} Winning cells indices or null if no winner
   */
  const getWinPattern = () => {
    return winPattern;
  };

  // Public API
  return {
    initialize,
    makeMove,
    getState,
    setState,
    undoMove,
    getWinPattern
  };
})();