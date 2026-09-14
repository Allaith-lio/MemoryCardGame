const startsec = document.getElementsByClassName("startGame")[0];
const mainGame = document.getElementsByClassName("maingame")[0];
let playername = document.getElementById("playerName");
let playerAge = document.getElementById("playerAge");
const Select = document.getElementById("slcDificalut");
const startBtn = document.getElementById("startbtn");
const gameinfo = document.getElementById("timer");
const cardscontainer = document.getElementsByClassName("cardscontainer")[0];
const suminfo = document.getElementById("sumclick");
const restartbtn = document.getElementById("restartbtn");
const backmenubtn = document.getElementById("backbtn");
const cards = document.querySelectorAll(".card");
const correctMatching = document.getElementById("mathcesresult");
const result = document.getElementById("result");
const resultsec = document.getElementById("resultsseec");
const gameoversec = document.getElementById("gameoversec");
const gameoverresult = document.getElementById("gameoverresult");
const bestresultssec = document.getElementById("bestresultssec");
const bestresultslist = document.getElementById("bestresultslist");
const playagainbtn = document.getElementById("playagainbtn");
const resultbackbtn = document.getElementById("resultbackbtn");
const bestresultbtn = document.getElementById("bestresultbtn");
const bestbackbtn = document.getElementById("bestbackbtn");
const bestmenubtn = document.getElementById("bestmenubtn");
const audio = document.getElementById("audio");
const flibcardaudio = document.getElementById("flibcard");
const errorMessage = document.getElementById("errormessage");
const themeButton = document.getElementById("themebtn");
const soundButton = document.getElementById("soundbtn");
const clockaudio = document.getElementById("clockaudio");
const loseraudio = document.getElementById("loseraudio");
const victoryaudio = document.getElementById("victoryaudio");
const gameAudios = [audio, flibcardaudio, clockaudio, loseraudio, victoryaudio];
let sumclick = 0;
let timer;
let sec = 60;
let firstcard, secondcard;
let ifFlippedCard = false;
let rightchecking = 0;
let lock = false;
let results = JSON.parse(localStorage.getItem("memoryGameResults") || "[]");

function setTheme(isDarkMode) {
  document.body.classList.toggle("dark-mode", isDarkMode);
  themeButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
  themeButton.setAttribute(
    "aria-label",
    isDarkMode ? "Enable light mode" : "Enable dark mode",
  );
}

function setSoundMuted(isMuted) {
  gameAudios.forEach((gameAudio) => {
    gameAudio.muted = isMuted;
  });
  soundButton.textContent = isMuted ? "Sound Off" : "Sound On";
  soundButton.setAttribute(
    "aria-label",
    isMuted ? "Unmute game sounds" : "Mute game sounds",
  );
}

suminfo.textContent = `${0}`;

function showErrorMessage(message) {
  errorMessage.textContent = message;
}

function resetCards() {
  cards.forEach((card) => {
    card.classList.remove("flipped");
    card.addEventListener("click", flibcard);
  });
  firstcard = undefined;
  secondcard = undefined;
  ifFlippedCard = false;
  lock = false;
  loseraudio.pause();
}

function resetGame() {
  clearInterval(timer);
  resetCards();
  startsec.classList.remove("hidden");
  mainGame.classList.add("hidden");
  resultsec.classList.add("hidden");
  gameoversec.classList.add("hidden");
  bestresultssec.classList.add("hidden");
}

function showResults() {
  clearInterval(timer);
  lock = true;
  mainGame.classList.add("hidden");
  result.textContent = `${sumclick} clicks and ${rightchecking} matching pairs`;
  saveResult();
  resultsec.classList.remove("hidden");
}

function showGameOver() {
  clearInterval(timer);
  lock = true;
  mainGame.classList.add("hidden");
  gameoverresult.textContent = `${sumclick} clicks and ${rightchecking} matching pairs`;
  gameoversec.classList.remove("hidden");
  audio.pause();
  flibcardaudio.pause();
  loseraudio.play();
}

function saveResult() {
  const playerResult = {
    name: localStorage.getItem("playerName") || "Unknown player",
    age: localStorage.getItem("playerAge") || "Not provided",
    clicks: sumclick,
  };

  results.push(playerResult);
  localStorage.setItem("memoryGameResults", JSON.stringify(results));
}

function showBestResults() {
  const sortedResults = [...results].sort(
    (first, second) => first.clicks - second.clicks,
  );

  bestresultslist.replaceChildren();

  if (sortedResults.length === 0) {
    const emptyResult = document.createElement("li");
    emptyResult.textContent = "No completed games yet.";
    bestresultslist.append(emptyResult);
  } else {
    sortedResults.forEach((playerResult) => {
      const resultItem = document.createElement("li");
      resultItem.textContent = `${playerResult.name}, age ${playerResult.age}: ${playerResult.clicks} clicks`;
      bestresultslist.append(resultItem);
    });
  }

  resultsec.classList.add("hidden");
  bestresultssec.classList.remove("hidden");
}

function hideBestResults() {
  bestresultssec.classList.add("hidden");
  resultsec.classList.remove("hidden");
}

function resetAudio() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function flibcard() {
  if (lock || this.classList.contains("flipped")) return;
  const card = this;

  if (!ifFlippedCard) {
    ifFlippedCard = true;
    firstcard = card;
    flibcardaudio.play();
  } else {
    ifFlippedCard = false;
    secondcard = card;
    flibcardaudio.play();

    countClick();

    if (firstcard.dataset.index === secondcard.dataset.index) {
      firstcard.removeEventListener("click", flibcard);
      secondcard.removeEventListener("click", flibcard);
      rightchecking++;
      correctMatching.innerHTML = `${rightchecking}`;

      if (rightchecking === cards.length / 2) {
        showResults();
        victoryaudio.play();
        audio.pause();
      }
    } else {
      lock = true;
      setTimeout(() => {
        firstcard.classList.remove("flipped");
        secondcard.classList.remove("flipped");
        lock = false;
        flibcardaudio.play();
      }, 1000);
    }
  }

  card.classList.toggle("flipped");
}

function shuffle() {
  const cardArray = Array.from(cards);

  for (let index = cardArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cardArray[index], cardArray[randomIndex]] = [
      cardArray[randomIndex],
      cardArray[index],
    ];
  }

  cardArray.forEach((card) => {
    cardscontainer.appendChild(card);
  });
}

function setTime(gameinfo, type) {
  clearInterval(timer);
  sec = 60;
  gameinfo.classList.remove("warringcolor");
  gameinfo.textContent = `01:00`;

  timer = setInterval(() => {
    sec--;

    if (sec <= 0) {
      gameinfo.textContent = "00:00";
      showGameOver();
      clockaudio.pause();
      return;
    }

    gameinfo.textContent = `00:${String(sec).padStart(2, "0")}`;

    if (sec < 10) {
      gameinfo.classList.add("warringcolor");

      audio.volume = 0.1;
      // clockaudio.volume = ;
      clockaudio.play();
    }
  }, type);
}

function whatthetipe(type) {
  if (type === "Easy") return 1000;
  if (type === "Mudium") return 500;
  if (type === "Hard") return 250;
}

function startGame() {
  const name = playername.value.trim();
  const age = playerAge.value.trim();

  if (name === "" || age === "") {
    showErrorMessage("Please enter your name and your age");
    return;
  }

  errorMessage.textContent = "";
  startsec.classList.add("hidden");
  mainGame.classList.remove("hidden");
  resultsec.classList.add("hidden");
  gameoversec.classList.add("hidden");
  bestresultssec.classList.add("hidden");
  resetCards();
  shuffle();
  sumclick = 0;
  rightchecking = 0;
  suminfo.textContent = `${sumclick}`;
  correctMatching.textContent = `${rightchecking}`;

  setTime(gameinfo, whatthetipe(Select.value));
  audio.volume = 0.3;
  resetAudio();
  localStorage.setItem("playerName", name);
  localStorage.setItem("playerAge", age);
}

function restartGame() {
  resultsec.classList.add("hidden");
  gameoversec.classList.add("hidden");
  mainGame.classList.remove("hidden");
  resetCards();
  shuffle();
  sumclick = 0;
  rightchecking = 0;
  suminfo.textContent = `${sumclick}`;
  correctMatching.textContent = `${rightchecking}`;
  setTime(gameinfo, whatthetipe(Select.value));
  resetAudio();
}

function countClick() {
  sumclick++;
  suminfo.textContent = `${sumclick}`;
}

function backToMenu() {
  sumclick = 0;
  rightchecking = 0;
  suminfo.textContent = `${sumclick}`;
  correctMatching.textContent = `${rightchecking}`;
  resetGame();
  audio.pause();
  loseraudio.pause();
}

cards.forEach((card) => {
  card.addEventListener("click", flibcard);
});

startBtn.addEventListener("click", startGame);
restartbtn.addEventListener("click", restartGame);
backmenubtn.addEventListener("click", backToMenu);
playagainbtn.addEventListener("click", restartGame);
resultbackbtn.addEventListener("click", backToMenu);
document
  .getElementById("gameoverplaybtn")
  .addEventListener("click", restartGame);
document
  .getElementById("gameoverbackbtn")
  .addEventListener("click", backToMenu);
bestresultbtn.addEventListener("click", showBestResults);
bestbackbtn.addEventListener("click", hideBestResults);
bestmenubtn.addEventListener("click", backToMenu);
themeButton.addEventListener("click", () => {
  const isDarkMode = !document.body.classList.contains("dark-mode");
  setTheme(isDarkMode);
  localStorage.setItem("darkMode", String(isDarkMode));
});

soundButton.addEventListener("click", () => {
  const isMuted = !gameAudios[0].muted;
  setSoundMuted(isMuted);
  localStorage.setItem("soundMuted", String(isMuted));
});

setTheme(localStorage.getItem("darkMode") === "true");
setSoundMuted(localStorage.getItem("soundMuted") === "true");
