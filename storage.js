/**
 * Storage management for the Tic-Tac-Toe game
 * Handles saving and retrieving game data to/from localStorage
 */

const GameStorage = (() => {
  // Storage keys
  const STORAGE_KEYS = {
    PLAYERS: 'tictactoe-players',
    SCORES: 'tictactoe-scores',
    SETTINGS: 'tictactoe-settings',
    GAME_STATE: 'tictactoe-state'
  };

  /**
   * Saves player names to localStorage
   * @param {Object} players - Object containing player names
   */
  const savePlayers = (players) => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  };

  /**
   * Retrieves player names from localStorage
   * @returns {Object} Object containing player names or default values
   */
  const getPlayers = () => {
    const players = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return players ? JSON.parse(players) : { x: 'Player X', o: 'Player O' };
  };

  /**
   * Saves game scores to localStorage
   * @param {Object} scores - Object containing game scores
   */
  const saveScores = (scores) => {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  };

  /**
   * Retrieves game scores from localStorage
   * @returns {Object} Object containing game scores or default values
   */
  const getScores = () => {
    const scores = localStorage.getItem(STORAGE_KEYS.SCORES);
    return scores ? JSON.parse(scores) : { x: 0, o: 0, draw: 0 };
  };

  /**
   * Saves game settings to localStorage
   * @param {Object} settings - Object containing game settings
   */
  const saveSettings = (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  };

  /**
   * Retrieves game settings from localStorage
   * @returns {Object} Object containing game settings or default values
   */
  const getSettings = () => {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      gameMode: 'pvp',
      aiDifficulty: 'easy',
      soundEnabled: true,
      darkMode: false
    };
  };

  /**
   * Saves current game state to localStorage
   * @param {Object} gameState - Object containing current game state
   */
  const saveGameState = (gameState) => {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  };

  /**
   * Retrieves game state from localStorage
   * @returns {Object|null} Object containing game state or null if no saved state
   */
  const getGameState = () => {
    const gameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return gameState ? JSON.parse(gameState) : null;
  };

  /**
   * Clears saved game state from localStorage
   */
  const clearGameState = () => {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  };

  /**
   * Resets all game data in localStorage
   */
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEYS.PLAYERS);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    // Don't remove settings to preserve user preferences
  };

  // Public API
  return {
    savePlayers,
    getPlayers,
    saveScores,
    getScores,
    saveSettings,
    getSettings,
    saveGameState,
    getGameState,
    clearGameState,
    resetAll
  };
})();