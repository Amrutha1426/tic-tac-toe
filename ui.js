/**
 * UI management for the Tic-Tac-Toe game
 * Handles DOM manipulation and UI events
 */

const GameUI = (() => {
  // Private variables
  let soundEnabled = true;
  let timer = null;
  let timeLeft = 30;
  let confettiInterval = null;
  let bubbles = [];
  const MAX_BUBBLES = 15;
  
  // Cached DOM elements
  const elements = {
    // Screens
    welcomeScreen: document.getElementById('welcome-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    // Welcome screen elements
    pvpModeBtn: document.getElementById('pvp-mode'),
    pvcModeBtn: document.getElementById('pvc-mode'),
    playerSetup: document.getElementById('player-setup'),
    player1Input: document.getElementById('player1-name'),
    player2Input: document.getElementById('player2-name'),
    player2Container: document.getElementById('player2-container'),
    aiDifficultyContainer: document.getElementById('ai-difficulty'),
    difficultyButtons: document.querySelectorAll('.btn-difficulty'),
    startGameBtn: document.getElementById('start-game'),
    
    // Game screen elements
    cells: document.querySelectorAll('.cell'),
    currentPlayerDisplay: document.getElementById('current-player'),
    timerDisplay: document.getElementById('timer'),
    playerXName: document.getElementById('player-x-name'),
    playerOName: document.getElementById('player-o-name'),
    playerXScore: document.getElementById('player-x-score'),
    playerOScore: document.getElementById('player-o-score'),
    drawScore: document.getElementById('draw-score'),
    undoBtn: document.getElementById('undo-btn'),
    restartBtn: document.getElementById('restart-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    
    // Result screen elements
    resultText: document.getElementById('result-text'),
    confettiContainer: document.getElementById('confetti-container'),
    playAgainBtn: document.getElementById('play-again'),
    backToMenuBtn: document.getElementById('back-to-menu'),
    
    // Other UI elements
    themeToggle: document.getElementById('theme-toggle'),
    soundToggle: document.getElementById('sound-toggle'),
    toast: document.getElementById('toast'),
    bubblesContainer: document.querySelector('.bubbles-container')
  };
  
  // Sound effects
  const sounds = {
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'),
    win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
    lose: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'),
    draw: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-neutral-game-over-tone-2566.mp3'),
    tick: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-clock-ticking-1056.mp3')
  };
  
  /**
   * Initializes the UI
   */
  const initialize = () => {
    // Initialize bubbles background
    createBubbles();
    animateBubbles();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load settings
    loadSettings();
  };
  
  /**
   * Creates background bubbles
   */
  const createBubbles = () => {
    const container = elements.bubblesContainer;
    container.innerHTML = '';
    bubbles = [];
    
    for (let i = 0; i < MAX_BUBBLES; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Random properties
      const size = Math.random() * 100 + 50;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.animationDuration = `${duration}s`;
      
      container.appendChild(bubble);
      bubbles.push(bubble);
    }
  };
  
  /**
   * Animates background bubbles
   */
  const animateBubbles = () => {
    setInterval(() => {
      // Remove a random bubble and create a new one
      if (bubbles.length >= MAX_BUBBLES) {
        const randomIndex = Math.floor(Math.random() * bubbles.length);
        const oldBubble = bubbles[randomIndex];
        if (oldBubble && oldBubble.parentNode) {
          oldBubble.parentNode.removeChild(oldBubble);
          bubbles.splice(randomIndex, 1);
        }
      }
      
      // Add a new bubble
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Random properties
      const size = Math.random() * 100 + 50;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.animationDuration = `${duration}s`;
      
      elements.bubblesContainer.appendChild(bubble);
      bubbles.push(bubble);
    }, 3000);
  };
  
  /**
   * Sets up event listeners for UI elements
   */
  const setupEventListeners = () => {
    // Game mode selection
    elements.pvpModeBtn.addEventListener('click', () => {
      selectGameMode('pvp');
    });
    
    elements.pvcModeBtn.addEventListener('click', () => {
      selectGameMode('pvc');
    });
    
    // Difficulty selection
    elements.difficultyButtons.forEach(button => {
      button.addEventListener('click', () => {
        selectDifficulty(button.dataset.difficulty);
      });
    });
    
    // Start game button
    elements.startGameBtn.addEventListener('click', startGame);
    
    // Game cells
    elements.cells.forEach(cell => {
      cell.addEventListener('click', () => {
        handleCellClick(cell);
      });
    });
    
    // Game control buttons
    elements.undoBtn.addEventListener('click', handleUndoClick);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.newGameBtn.addEventListener('click', backToMenu);
    
    // Result screen buttons
    elements.playAgainBtn.addEventListener('click', restartGame);
    elements.backToMenuBtn.addEventListener('click', backToMenu);
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Sound toggle
    elements.soundToggle.addEventListener('click', toggleSound);
  };
  
  /**
   * Loads settings from storage
   */
  const loadSettings = () => {
    const settings = GameStorage.getSettings();
    
    // Apply sound setting
    soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
    if (!soundEnabled) {
      elements.soundToggle.classList.remove('sound-on');
      elements.soundToggle.classList.add('sound-off');
      elements.soundToggle.querySelector('.toggle-icon').textContent = '🔇';
    }
    
    // Apply theme setting
    if (settings.darkMode) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      elements.themeToggle.querySelector('.toggle-icon').textContent = '☀️';
    }
  };
  
  /**
   * Selects game mode (PvP or PvC)
   * @param {String} mode - Game mode ('pvp' or 'pvc')
   */
  const selectGameMode = (mode) => {
    // Update UI
    elements.pvpModeBtn.classList.toggle('active', mode === 'pvp');
    elements.pvcModeBtn.classList.toggle('active', mode === 'pvc');
    
    // Show/hide AI difficulty selection
    elements.aiDifficultyContainer.classList.toggle('hidden', mode !== 'pvc');
    elements.player2Container.classList.toggle('hidden', mode === 'pvc');
    
    // Show player setup
    elements.playerSetup.classList.remove('hidden');
    
    // Update game mode
    GamePlayers.setGameMode(mode);
    
    // Play sound
    playSound('click');
  };
  
  /**
   * Selects AI difficulty
   * @param {String} difficulty - AI difficulty
   */
  const selectDifficulty = (difficulty) => {
    elements.difficultyButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.difficulty === difficulty);
    });
    
    GamePlayers.setAIDifficulty(difficulty);
    
    // Play sound
    playSound('click');
  };
  
  /**
   * Starts the game
   */
  const startGame = () => {
    // Get player names
    const player1Name = elements.player1Input.value.trim() || 'Player X';
    const player2Name = elements.player2Input.value.trim() || 'Player O';
    
    // Initialize players
    GamePlayers.initialize({
      player1Name,
      player2Name,
      resetScores: false
    });
    
    // Initialize game board
    GameBoard.initialize();
    
    // Update UI
    updateGameUI();
    updateScoreboardUI();
    
    // Show game screen
    showScreen('game');
    
    // Start timer
    startTimer();
    
    // Play sound
    playSound('click');
  };
  
  /**
   * Handles cell click event
   * @param {HTMLElement} cell - Clicked cell element
   */
  const handleCellClick = (cell) => {
    const index = parseInt(cell.dataset.index);
    const result = GameBoard.makeMove(index);
    
    // If move is valid
    if (result.valid) {
      // Update UI
      updateGameUI();
      
      // Play sound
      playSound('click');
      
      // Reset timer
      resetTimer();
      
      // Check if game is over
      if (result.gameOver) {
        setTimeout(() => {
          handleGameOver(result.winner, result.isDraw);
        }, 500);
        return;
      }
      
      // If next player is AI, make AI move
      handleAITurn();
    }
  };
  
  /**
   * Handles AI turn
   */
  const handleAITurn = () => {
    const state = GameBoard.getState();
    const players = GamePlayers.getPlayers();
    
    // If current player is AI
    if (state.currentPlayer === 'O' && players.o.isAI) {
      // Disable user interaction
      disableCellClicks();
      
      // Make AI move after a short delay
      setTimeout(() => {
        const difficulty = GamePlayers.getAIDifficulty();
        const aiMove = GameAI.makeMove(state.board, state.currentPlayer, difficulty);
        
        if (aiMove !== -1) {
          const result = GameBoard.makeMove(aiMove);
          
          // Update UI
          updateGameUI();
          
          // Play sound
          playSound('click');
          
          // Reset timer
          resetTimer();
          
          // Check if game is over
          if (result.gameOver) {
            setTimeout(() => {
              handleGameOver(result.winner, result.isDraw);
            }, 500);
          } else {
            // Re-enable user interaction
            enableCellClicks();
          }
        }
      }, 800);
    }
  };
  
  /**
   * Handles undo button click
   */
  const handleUndoClick = () => {
    const result = GameBoard.undoMove();
    if (result) {
      // Update UI
      updateGameUI();
      
      // Play sound
      playSound('click');
      
      // Reset timer
      resetTimer();
      
      // If next player is AI, undo again
      const state = GameBoard.getState();
      const players = GamePlayers.getPlayers();
      if (state.currentPlayer === 'O' && players.o.isAI) {
        handleUndoClick();
      }
    } else {
      showToast('Nothing to undo!');
    }
  };
  
  /**
   * Handles game over
   * @param {String|null} winner - Winner's mark or null if draw
   * @param {Boolean} isDraw - Whether the game ended in a draw
   */
  const handleGameOver = (winner, isDraw) => {
    // Update scores
    const scores = GamePlayers.updateScore(winner);
    updateScoreboardUI();
    
    // Show result screen
    if (isDraw) {
      showResult("It's a draw!");
      playSound('draw');
    } else {
      const players = GamePlayers.getPlayers();
      const winnerName = winner === 'X' ? players.x.name : players.o.name;
      showResult(`${winnerName} wins!`);
      playSound(winnerName === 'Computer' ? 'lose' : 'win');
      
      // Highlight winning cells
      const winPattern = GameBoard.getWinPattern();
      if (winPattern) {
        winPattern.forEach(index => {
          elements.cells[index].classList.add('win');
        });
      }
      
      // Show confetti for human win
      if (winnerName !== 'Computer') {
        createConfetti();
      }
    }
    
    // Stop timer
    stopTimer();
  };
  
  /**
   * Updates the game UI based on current state
   */
  const updateGameUI = () => {
    const state = GameBoard.getState();
    const players = GamePlayers.getPlayers();
    
    // Update board cells
    state.board.forEach((mark, index) => {
      elements.cells[index].className = 'cell';
      if (mark) {
        elements.cells[index].classList.add(mark.toLowerCase());
      }
    });
    
    // Update current player display
    const currentPlayer = state.currentPlayer === 'X' ? players.x : players.o;
    elements.currentPlayerDisplay.textContent = currentPlayer.name;
    
    // Update player names in scoreboard
    elements.playerXName.textContent = players.x.name;
    elements.playerOName.textContent = players.o.name;
  };
  
  /**
   * Updates the scoreboard UI
   */
  const updateScoreboardUI = () => {
    const scores = GamePlayers.getScores();
    
    elements.playerXScore.textContent = scores.x;
    elements.playerOScore.textContent = scores.o;
    elements.drawScore.textContent = scores.draw;
  };
  
  /**
   * Shows the specified screen
   * @param {String} screenName - Name of the screen to show ('welcome', 'game', or 'result')
   */
  const showScreen = (screenName) => {
    // Hide all screens
    elements.welcomeScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.resultScreen.classList.remove('active');
    
    // Show specified screen
    switch (screenName) {
      case 'welcome':
        elements.welcomeScreen.classList.add('active');
        break;
      case 'game':
        elements.gameScreen.classList.add('active');
        break;
      case 'result':
        elements.resultScreen.classList.add('active');
        break;
    }
  };
  
  /**
   * Shows result screen with the specified message
   * @param {String} message - Result message
   */
  const showResult = (message) => {
    elements.resultText.textContent = message;
    showScreen('result');
  };
  
  /**
   * Creates confetti animation
   */
  const createConfetti = () => {
    // Clear existing confetti
    elements.confettiContainer.innerHTML = '';
    
    // Create new confetti pieces
    for (let i = 0; i < 50; i++) {
      createConfettiPiece();
    }
    
    // Continue adding confetti
    confettiInterval = setInterval(() => {
      createConfettiPiece();
    }, 200);
    
    // Stop after a few seconds
    setTimeout(() => {
      clearInterval(confettiInterval);
    }, 3000);
  };
  
  /**
   * Creates a single confetti piece
   */
  const createConfettiPiece = () => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random properties
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#6bff89', '#ffbe6d'];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${left}%`;
    confetti.style.backgroundColor = backgroundColor;
    confetti.style.animationDuration = `${animationDuration}s`;
    
    elements.confettiContainer.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, animationDuration * 1000);
  };
  
  /**
   * Restarts the game
   */
  const restartGame = () => {
    // Initialize game board
    GameBoard.initialize();
    
    // Update UI
    updateGameUI();
    
    // Show game screen
    showScreen('game');
    
    // Start timer
    startTimer();
    
    // Play sound
    playSound('click');
  };
  
  /**
   * Goes back to the menu
   */
  const backToMenu = () => {
    // Clear intervals
    stopTimer();
    if (confettiInterval) {
      clearInterval(confettiInterval);
    }
    
    // Show welcome screen
    showScreen('welcome');
    
    // Reset player inputs
    elements.player1Input.value = '';
    elements.player2Input.value = '';
    
    // Play sound
    playSound('click');
  };
  
  /**
   * Starts the move timer
   */
  const startTimer = () => {
    // Clear existing timer
    stopTimer();
    
    // Reset time
    timeLeft = 30;
    elements.timerDisplay.textContent = timeLeft;
    
    // Start new timer
    timer = setInterval(() => {
      timeLeft--;
      elements.timerDisplay.textContent = timeLeft;
      
      // Play tick sound for last 5 seconds
      if (timeLeft <= 5 && timeLeft > 0) {
        playSound('tick');
      }
      
      // Time's up
      if (timeLeft <= 0) {
        handleTimeUp();
      }
    }, 1000);
  };
  
  /**
   * Resets the move timer
   */
  const resetTimer = () => {
    startTimer();
  };
  
  /**
   * Stops the move timer
   */
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  
  /**
   * Handles time up event
   */
  const handleTimeUp = () => {
    stopTimer();
    
    const state = GameBoard.getState();
    const players = GamePlayers.getPlayers();
    
    // If game is not over
    if (!state.gameOver) {
      // Make random move for current player
      const emptyCells = state.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
      
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomMove = emptyCells[randomIndex];
        
        const result = GameBoard.makeMove(randomMove);
        
        // Update UI
        updateGameUI();
        
        // Show toast
        const currentPlayer = state.currentPlayer === 'X' ? players.x.name : players.o.name;
        showToast(`Time's up! Random move made for ${currentPlayer}`);
        
        // Reset timer
        resetTimer();
        
        // Check if game is over
        if (result.gameOver) {
          setTimeout(() => {
            handleGameOver(result.winner, result.isDraw);
          }, 500);
          return;
        }
        
        // If next player is AI, make AI move
        handleAITurn();
      }
    }
  };
  
  /**
   * Shows a toast message
   * @param {String} message - Toast message
   */
  const showToast = (message) => {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 3000);
  };
  
  /**
   * Toggles theme between light and dark
   */
  const toggleTheme = () => {
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      elements.themeToggle.querySelector('.toggle-icon').textContent = '🌙';
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      elements.themeToggle.querySelector('.toggle-icon').textContent = '☀️';
    }
    
    // Save setting
    const settings = GameStorage.getSettings();
    settings.darkMode = !isDark;
    GameStorage.saveSettings(settings);
    
    // Play sound
    playSound('click');
  };
  
  /**
   * Toggles sound on/off
   */
  const toggleSound = () => {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
      elements.soundToggle.classList.remove('sound-off');
      elements.soundToggle.classList.add('sound-on');
      elements.soundToggle.querySelector('.toggle-icon').textContent = '🔊';
    } else {
      elements.soundToggle.classList.remove('sound-on');
      elements.soundToggle.classList.add('sound-off');
      elements.soundToggle.querySelector('.toggle-icon').textContent = '🔇';
    }
    
    // Save setting
    const settings = GameStorage.getSettings();
    settings.soundEnabled = soundEnabled;
    GameStorage.saveSettings(settings);
  };
  
  /**
   * Plays a sound effect
   * @param {String} sound - Sound name
   */
  const playSound = (sound) => {
    if (soundEnabled && sounds[sound]) {
      sounds[sound].currentTime = 0;
      sounds[sound].play().catch(err => console.error("Error playing sound:", err));
    }
  };
  
  /**
   * Disables cell clicks
   */
  const disableCellClicks = () => {
    elements.cells.forEach(cell => {
      cell.style.pointerEvents = 'none';
    });
  };
  
  /**
   * Enables cell clicks
   */
  const enableCellClicks = () => {
    elements.cells.forEach(cell => {
      cell.style.pointerEvents = 'auto';
    });
  };
  
  /**
   * Checks if sound is enabled
   * @returns {Boolean} Whether sound is enabled
   */
  const isSoundEnabled = () => {
    return soundEnabled;
  };
  
  // Public API
  return {
    initialize,
    updateGameUI,
    updateScoreboardUI,
    showScreen,
    showToast,
    playSound,
    isSoundEnabled
  };
})();