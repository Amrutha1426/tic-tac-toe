/**
 * Main application logic for the Tic-Tac-Toe game
 * Initializes and coordinates all game components
 */

// Initialize the game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  GameUI.initialize();
  
  // Initialize players with default settings
  GamePlayers.initialize();
  
  // Initialize empty game board
  GameBoard.initialize();
  
  // Load saved game state if available
  const savedGameState = GameStorage.getGameState();
  
  if (savedGameState) {
    // Ask user if they want to continue the saved game
    setTimeout(() => {
      if (confirm('Do you want to continue your saved game?')) {
        // Load saved game state
        GameBoard.setState(savedGameState.board);
        GamePlayers.initialize(savedGameState.players);
        
        // Update UI
        GameUI.updateGameUI();
        GameUI.updateScoreboardUI();
        GameUI.showScreen('game');
      } else {
        // Clear saved game state
        GameStorage.clearGameState();
      }
    }, 500);
  }
  
  // Save game state before page unload
  window.addEventListener('beforeunload', () => {
    // Only save if game is in progress
    const state = GameBoard.getState();
    if (!state.gameOver && state.board.some(cell => cell !== '')) {
      GameStorage.saveGameState({
        board: state,
        players: {
          gameMode: GamePlayers.getGameMode(),
          aiDifficulty: GamePlayers.getAIDifficulty()
        }
      });
    }
  });
});