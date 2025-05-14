/**
 * Player management for the Tic-Tac-Toe game
 * Handles player data and scores
 */

const GamePlayers = (() => {
  // Private variables
  let players = {
    x: {
      name: 'Player X',
      isAI: false
    },
    o: {
      name: 'Player O',
      isAI: false
    }
  };
  
  let scores = {
    x: 0,
    o: 0,
    draw: 0
  };
  
  let aiDifficulty = GameAI.difficulties.EASY;
  let gameMode = 'pvp'; // 'pvp' or 'pvc'
  
  /**
   * Initializes player data
   * @param {Object} settings - Object containing player settings
   */
  const initialize = (settings = {}) => {
    // Load saved data from storage
    const savedPlayers = GameStorage.getPlayers();
    const savedScores = GameStorage.getScores();
    const savedSettings = GameStorage.getSettings();
    
    players = {
      x: {
        name: settings.player1Name || savedPlayers.x || 'Player X',
        isAI: false
      },
      o: {
        name: settings.player2Name || savedPlayers.o || 'Player O',
        isAI: gameMode === 'pvc'
      }
    };
    
    gameMode = settings.gameMode || savedSettings.gameMode || 'pvp';
    aiDifficulty = settings.aiDifficulty || savedSettings.aiDifficulty || GameAI.difficulties.EASY;
    
    // Update player data based on game mode
    if (gameMode === 'pvc') {
      players.o.name = 'Computer';
      players.o.isAI = true;
    }
    
    // Reset or load scores
    if (settings.resetScores) {
      scores = { x: 0, o: 0, draw: 0 };
    } else {
      scores = savedScores;
    }
    
    // Save player data
    savePlayerData();
    
    return { players, scores, gameMode, aiDifficulty };
  };
  
  /**
   * Saves player data to storage
   */
  const savePlayerData = () => {
    GameStorage.savePlayers({
      x: players.x.name,
      o: players.o.name
    });
    
    GameStorage.saveScores(scores);
    
    GameStorage.saveSettings({
      gameMode,
      aiDifficulty,
      soundEnabled: GameUI.isSoundEnabled(),
      darkMode: document.body.classList.contains('dark-theme')
    });
  };
  
  /**
   * Updates the score for the specified player
   * @param {String} winner - Mark of the winner (X, O) or 'draw'
   */
  const updateScore = (winner) => {
    if (winner === 'X') {
      scores.x++;
    } else if (winner === 'O') {
      scores.o++;
    } else {
      scores.draw++;
    }
    
    savePlayerData();
    return { ...scores };
  };
  
  /**
   * Gets player data
   * @returns {Object} Object containing player data
   */
  const getPlayers = () => {
    return { ...players };
  };
  
  /**
   * Gets score data
   * @returns {Object} Object containing score data
   */
  const getScores = () => {
    return { ...scores };
  };
  
  /**
   * Gets game mode
   * @returns {String} Current game mode
   */
  const getGameMode = () => {
    return gameMode;
  };
  
  /**
   * Sets game mode
   * @param {String} mode - Game mode ('pvp' or 'pvc')
   */
  const setGameMode = (mode) => {
    gameMode = mode;
    
    players.o.isAI = (mode === 'pvc');
    if (mode === 'pvc') {
      players.o.name = 'Computer';
    }
    
    savePlayerData();
  };
  
  /**
   * Gets AI difficulty
   * @returns {String} Current AI difficulty
   */
  const getAIDifficulty = () => {
    return aiDifficulty;
  };
  
  /**
   * Sets AI difficulty
   * @param {String} difficulty - AI difficulty
   */
  const setAIDifficulty = (difficulty) => {
    aiDifficulty = difficulty;
    savePlayerData();
  };
  
  /**
   * Gets the player mark for the current turn
   * @param {String} currentMark - Current player's mark (X or O)
   * @returns {Object} Object containing player data for current turn
   */
  const getCurrentPlayer = (currentMark) => {
    return currentMark === 'X' ? players.x : players.o;
  };
  
  // Public API
  return {
    initialize,
    getPlayers,
    getScores,
    updateScore,
    getGameMode,
    setGameMode,
    getAIDifficulty,
    setAIDifficulty,
    getCurrentPlayer
  };
})();