# Memory Card Game

A browser-based memory matching game built with semantic HTML, modern CSS, and vanilla JavaScript. Players flip cards to find all matching pairs before the countdown reaches zero, while trying to complete the board with as few clicks as possible.

## Features

- 16-card board containing 8 matching pairs
- Random card arrangement at the start of every game
- Three difficulty levels with different time limits
- Countdown timer with a warning state during the final 10 seconds
- Click counter and correct-match counter
- Card flip animation with input locking during mismatched-card reveal
- Win screen when all pairs are found
- Game-over screen when time expires
- Restart and return-to-menu controls
- Best-results leaderboard sorted by lowest click count
- Local browser storage for player information and completed-game results
- Light and dark visual themes
- Toggleable background music and sound effects
- Responsive layout for desktop and mobile screens
- Accessible labels and visible keyboard focus states for controls

## How to Play

1. Enter a player name and age on the main menu.
2. Select a difficulty level.
3. Select **Start Game**.
4. Flip two cards at a time by clicking them.
5. Remember the revealed cards and look for their matching pair.
6. Continue until all 8 pairs have been matched or the timer reaches zero.

Each matching pair is identified by its shared `data-index` value. The card images use different suits and colors, but cards with the same number form a pair.

## How to Win

You win by matching all 8 pairs before the timer expires. The game then displays your total number of clicks and the number of matching pairs found.

The game rewards efficient memory and planning: fewer clicks produce a better result. A click score is recorded when a second card is selected, so one attempted pair counts as one click in the results system.

## How to Lose

The game ends when the timer reaches `00:00` before all pairs are matched. The game-over screen shows your current click count and the number of pairs found.

Incomplete games are not added to the completed-game leaderboard. You can choose **Play Again** to start a fresh board or return to the main menu.

## Difficulty Levels

The interface currently displays the middle option as `Mudium`; this is the game's Medium setting.

| Level | Timer interval | Effective time limit | Description |
| --- | ---: | ---: | --- |
| Easy | 1 second per countdown step | 60 seconds | The most relaxed time limit |
| Medium (`Mudium`) | 0.5 seconds per countdown step | 30 seconds | A balanced challenge |
| Hard | 0.25 seconds per countdown step | 15 seconds | A fast-paced challenge |

The countdown always starts at 60 steps. The selected difficulty determines how quickly those steps are consumed. When fewer than 10 steps remain, the timer changes to a warning color and a clock sound is played.

## Game Rules and Behavior

- Only two cards can be selected as part of one comparison.
- A card that is already matched cannot be selected again.
- If two selected cards match, they remain face up and are removed from future interaction.
- If the cards do not match, they remain visible briefly and flip back after one second.
- While mismatched cards are waiting to flip back, additional card input is locked.
- Starting or restarting a game resets the timer, board order, click count, and match count.
- The board is shuffled with the Fisher-Yates shuffle algorithm whenever a game starts or restarts.

## Results and Persistence

Completed-game results are stored in the browser using `localStorage`. The leaderboard sorts results from fewest clicks to most clicks.

The application stores:

- `memoryGameResults`: completed-game entries containing the player name, age, and click count
- `playerName`: the most recently entered player name
- `playerAge`: the most recently entered player age
- `darkMode`: the selected theme preference
- `soundMuted`: the selected sound preference

Because the data is stored locally, results are tied to the current browser and device. Clearing browser storage removes the saved results and preferences.

## Controls

### Main menu

- **Dark Mode / Light Mode**: switches the page theme and remembers the preference
- **Sound On / Sound Off**: enables or mutes all game audio and remembers the preference
- **Start Game**: validates the required player fields and begins a new game
- Difficulty selector: chooses the timer speed

### During a game

- **Restart**: creates a new shuffled board and resets all counters
- **Back to Main Menu**: exits the current game and resets the visible game state

### Result screens

- **Play Again**: starts another shuffled game using the selected difficulty
- **Get Back To Main Menu**: returns to the player setup screen
- **Show Best Result**: opens the saved completed-game leaderboard
- **Back To Result**: returns from the leaderboard to the completion screen

## Project Structure

```text
Project 3/
├── index.html                 # Page structure, game screens, cards, and audio elements
├── logic.js                   # Game state, interactions, timer, scoring, and persistence
├── style.css                  # Layout, card animation, themes, responsive styles, and states
├── Images/
│   ├── backface.jpg           # Shared card-back image
│   ├── 1 black.jpg ... 8 black.jpg
│   └── 1 red.jpg ... 8 red.jpg # Card-face images used by the eight pairs
├── audio1.mp3                 # Background music
├── clock clicking.mp3         # Low-time warning sound
├── Flip Card SOUND Effect.mp3 # Card flip sound
├── Lose sound effects.mp3     # Game-over sound
└── VICTORY SOUND EFFECT .mp3  # Winning sound
```

## Important JavaScript Functions

The main game logic is contained in `logic.js`.

| Function | Responsibility |
| --- | --- |
| `startGame()` | Validates player input, resets the board, shuffles cards, starts the timer, and saves player details |
| `restartGame()` | Starts a new round without returning to the setup screen |
| `flibcard()` | Handles card selection, matching, card locking, and flip-back behavior |
| `shuffle()` | Randomizes the card order using Fisher-Yates shuffling |
| `setTime()` | Initializes the countdown and handles the low-time warning and timeout |
| `whatthetipe()` | Converts the selected difficulty into a timer interval |
| `countClick()` | Increments and displays the number of attempted pair selections |
| `showResults()` | Displays the winning result and saves the completed game |
| `showGameOver()` | Displays the timeout result and plays the losing sound |
| `saveResult()` | Adds the completed game to local browser storage |
| `showBestResults()` | Sorts and renders saved results from best to worst |
| `resetCards()` | Hides all cards and restores the card interaction state |
| `resetGame()` | Clears the active game and returns to the main menu |
| `setTheme()` | Applies the selected light or dark theme |
| `setSoundMuted()` | Mutes or unmutes every game audio element |

## Technology Stack

- **HTML5** for the page structure and game screens
- **CSS3** for responsive layout, theme styling, transitions, and 3D card flips
- **JavaScript (ES6+)** for game logic, DOM interaction, timing, audio, and browser storage
- **Web Storage API** for local results and preferences
- **No external framework or package installation required**

## Running the Project

This is a static front-end project and does not require a build step.

### Option 1: Open directly

Open `index.html` in a modern web browser.

### Option 2: Use a local development server

From the project directory, run any static server, for example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Using a local server is recommended during development because it provides consistent handling for local assets and media files.

## Browser Compatibility

The game is designed for current browsers that support:

- JavaScript modules and modern ES6 syntax
- CSS 3D transforms and transitions
- `localStorage`
- HTML audio playback
- Responsive CSS media queries

Some browsers may restrict audio until the user interacts with the page. Starting the game provides that interaction and allows the game sounds to play.

## Development Notes

- Card matching is based on the cards' `data-index` attributes rather than image filenames.
- The same card collection is reused for every round; shuffling changes only the displayed order.
- Results are saved only after a successful completion.
- Audio files are referenced by their exact filenames, including spaces, so they should not be renamed without updating `index.html`.
- The game uses local browser storage rather than a server or database, so results are not shared between devices or browsers.

## License

No license file is currently included. Add a license before distributing the project publicly if you want to define how others may use, modify, or share it.
