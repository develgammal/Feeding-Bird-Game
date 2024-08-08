// ........................................
// 1. Interval Settings :
// ........................................

// Initial intervals for how often mole characters should appear
let minInterval = 2000;
let maxInterval = 20000;
let quickInterval = 500;
let hungryInterval = 1500;

// ........................................
// 2. Score and Level Configuration :
// ........................................

// Score and level config
let winScore = 100;
let score = 0;
let totalScore = 0;
let level = 1;

// ........................................
// 3. Game Timer :
// ........................................

// Decrementing Game timer (in seconds)
let gameTime = 40;
setInterval(function () {
  if (gameTime >= 0) {
    gameTime -= 1;
  }
}, 1000);

// ........................................
// 4. DOM Elements :
// ........................................

// Container for the worm element that the bird feeds in moles mouth
const wormContainer = document.querySelector(".worm-container");

// ........................................
// 5. Interval Functions :
// ........................................

// Function to get a random interval between minInterval and maxInterval
const getRandomInterval = () =>
  Date.now() + minInterval + Math.floor(Math.random() * maxInterval);

// Functions to calculate quick and hungry intervals
const getQuickInterval = () => Date.now() + quickInterval;
const getHungryInterval = () => Date.now() + hungryInterval;

// ........................................
// 6. Audio Params :
// ........................................

// Audio triggers
let playMusic = true;
let playClock = true;

// Audio file paths
const bonusSound = new Audio("./snd/bonus.wav");
const feedSound = new Audio("./snd/quick.wav");
const minusSound = new Audio("./snd/cry.wav");
const loseSound = new Audio("./snd/lose.wav");
const winSound = new Audio("./snd/win.wav");
const buttonSound = new Audio("./snd/coin.wav");
const tickSound = new Audio("./snd/tick.wav");

// ........................................
// 7. Level Management :
// ........................................

// Function to handle next level reset when the user wins and clicks the next level button
const nextLevelReset = () => {
  buttonSound.play();

  document.querySelector("aside").classList.toggle("danger", false);
  wormContainer.style.width = "5%";

  level++;
  score = 0;
  gameTime = 30;
  playMusic = true;
  playClock = true;

  document.querySelector(".bg").classList.toggle("hide", false);
  document.querySelector(".win").classList.toggle("show", false);
  document.querySelector(".lose").classList.toggle("show", false);

  // Adjust difficulty by decreasing intervals
  if (quickInterval >= 80 && hungryInterval >= 800) {
    quickInterval -= 30;
    hungryInterval -= 125;
  }
};

// ........................................
// 8. Mole Elements :
// ........................................

// Array containing mole elements and their initial status
const moles = [
  { status: "sad", next: getQuickInterval(), king: false, devil: false, node: document.getElementById("hole-0") },
  { status: "sad", next: getQuickInterval(), king: true, devil: false, node: document.getElementById("hole-1") },
  { status: "sad", next: getQuickInterval(), king: false, devil: true, node: document.getElementById("hole-2") },
  { status: "sad", next: getQuickInterval(), king: false, devil: false, node: document.getElementById("hole-3") },
  { status: "sad", next: getQuickInterval(), king: true, devil: false, node: document.getElementById("hole-4") },
  { status: "sad", next: getQuickInterval(), king: false, devil: false, node: document.getElementById("hole-5") },
  { status: "sad", next: getQuickInterval(), king: false, devil: false, node: document.getElementById("hole-6") },
  { status: "sad", next: getQuickInterval(), king: true, devil: false, node: document.getElementById("hole-7") },
  { status: "sad", next: getQuickInterval(), king: false, devil: false, node: document.getElementById("hole-8") },
  { status: "sad", next: getQuickInterval(), king: false, devil: false, node: document.getElementById("hole-9") },
];

// ........................................
// 9. Mole Status Management :
// ........................................

// Function to update mole statuses
const getNextStatus = (mole) => {
  switch (mole.status) {
    case "hungry":
      if (mole.king) {
        mole.node.children[0].src = "./img/king-mole-sad.png";
      } else if (mole.devil) {
        mole.node.children[0].src = "./img/devil-mole.png";
      } else {
        mole.node.children[0].src = "./img/mole-sad.png";
      }
      mole.status = "sad";
      mole.next = getQuickInterval();
      break;

    case "sad":
    case "fed":
      mole.next = getQuickInterval();
      if (mole.king) {
        mole.node.children[0].src = "./img/king-mole-leaving.png";
      } else {
        mole.node.children[0].src = "./img/mole-leaving.png";
      }
      mole.status = "leaving";
      break;

    case "leaving":
      mole.next = getRandomInterval();
      mole.king = false;
      mole.devil = false;
      mole.node.children[0].classList.toggle("gone", true);
      mole.status = "gone";
      break;

    case "gone":
      mole.status = "hungry";
      const assignStatus = () => {
        let randomValue = Math.random();
        if (randomValue > 0.82) {
          mole.king = true;
        } else if (randomValue < 0.2) {
          mole.devil = true;
        }
      };
      assignStatus();

      mole.next = getHungryInterval();
      mole.node.children[0].classList.toggle("hungry", true);
      mole.node.children[0].classList.toggle("gone", false);
      if (mole.king) {
        mole.node.children[0].src = "./img/king-mole-hungry.png";
      } else if (mole.devil) {
        mole.node.children[0].src = "./img/devil-mole.png";
      } else {
        mole.node.children[0].src = "./img/mole-hungry.png";
      }
      break;
  }
};

// ........................................
// 10. Event Handling :
// ........................................

// Function to handle click events on moles
const handleClick = (e) => {
  document.querySelector(".double-points").classList.toggle("show", false);
  document.querySelector(".minus-points").classList.toggle("show", false);

  if (e.target.tagName !== "IMG" || !e.target.classList.contains("hungry")) {
    return;
  }
  const mole = moles[+e.target.dataset.index];

  mole.status = "fed";
  mole.next = getQuickInterval();
  mole.node.children[0].classList.toggle("hungry", false);
  feedSound.play();

  if (mole.king) {
    bonusSound.play();
    mole.node.children[0].src = "./img/king-mole-fed.png";
    score += 20;
    totalScore += 20;
    document.querySelector(".double-points").classList.toggle("show", true);
  } else if (mole.devil) {
    minusSound.play();
    mole.node.children[0].src = "./img/devil-mole.png";
    score -= 20;
    totalScore -= 20;
    document.querySelector(".minus-points").classList.toggle("show", true);
  } else {
    mole.node.children[0].src = "./img/mole-fed.png";
    score += 10;
    totalScore += 10;
  }
  wormContainer.style.width = `${(score / winScore) * 100}%`;
};

// ........................................
// 11. Win/Lose Conditions :
// ........................................

// Function to handle win conditions
const win = () => {
  playClock = false;

  if (playMusic) {
    winSound.play();
    playMusic = false;
  }
  document.querySelector(".bg").classList.toggle("hide", true);
  document.querySelector(".win").classList.toggle("show", true);
  document.querySelector(".double-points").classList.toggle("show", false);
  document.querySelector(".minus-points").classList.toggle("show", false);
};

// Function to handle lose conditions
const lose = () => {
  playClock = false;

  if (playMusic) {
    loseSound.play();
    playMusic = false;
  }
  document.querySelector(".bg").classList.toggle("hide", true);
  document.querySelector(".lose").classList.toggle("show", true);
  document.querySelector(".double-points").classList.toggle("show", false);
  document.querySelector(".minus-points").classList.toggle("show", false);
};

// Add event listener for clicks on the game wrapper
document.querySelector(".wrapper").addEventListener("click", handleClick);

// ........................................
// 12. Game Frame Update :
// ........................................

// Function to update the game frame and check win/lose conditions
const nextFrame = () => {
  if (score >= winScore) {
    win();
  } else if (score < 0 || gameTime <= 0) {
    lose();
  }
  const now = Date.now();

  for (let i = 0; i < moles.length; i++) {
    if (moles[i].next < now) {
      getNextStatus(moles[i]);
    }
  }

  // Update main tracker with current level and total score
  const mainTracker = (document.querySelector("main").innerHTML = `LEVEL: ${level}  SCORE: ${totalScore}`);

  // Play ticking sound when time is running out
  if (gameTime < 5 && playClock) {
    tickSound.play();
    playClock = false;
    document.querySelector("aside").classList.toggle("danger", true);
  }

  // Update time display
  const timeDisplay = (document.querySelector("aside").innerHTML = `&#8987;${gameTime}:00`);

  // Request the next animation frame
  requestAnimationFrame(nextFrame);
};

// Start the game by requesting the first animation frame
requestAnimationFrame(nextFrame);
