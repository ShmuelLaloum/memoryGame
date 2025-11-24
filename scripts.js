const grid = document.getElementById("grid");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const bestScoreDisplay = document.getElementById("bestScore");
const timerDisplay = document.getElementById("timer");
const levelBtns = document.querySelectorAll(".levelBtn");

let cardValues = ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍","🥑","🍑","🍋","🍊","🍐","🍏","🍈","🥭","🍅","🥕"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;
const levels = {
    easy:   { rows: 4, cols: 4 },
    medium: { rows: 5, cols: 4 },
    hard:   { rows: 6, cols: 6 }
};

let gridRows = 4;
let gridCols = 4;
let currentLevel = "easy"; 

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerDisplay.textContent = seconds;
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

function displayBestScore() {
    const best = JSON.parse(localStorage.getItem("bestScore_" + currentLevel));
    if (best) {
        bestScoreDisplay.textContent = `שיא (${currentLevel}): ${best.moves} מהלכים, ${best.time} שניות`;
    } else {
        bestScoreDisplay.textContent = `שיא (${currentLevel}): -`;
    }
}

function saveBestScore() {
    const best = JSON.parse(localStorage.getItem("bestScore_" + currentLevel));
    if (!best || moves < best.moves || (moves === best.moves && seconds < best.time)) {
        localStorage.setItem("bestScore_" + currentLevel, JSON.stringify({moves, time: seconds}));
    }
    displayBestScore();
}

function createBoard() {
    grid.innerHTML = "";
    moves = 0;
    matches = 0;
    movesDisplay.textContent = moves;
    message.textContent = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    startTimer();

    const totalCards = gridRows * gridCols;
    const numPairs = totalCards / 2;

    let selectedValues = cardValues.slice(0, numPairs);
    let boardValues = shuffle([...selectedValues, ...selectedValues]);

    grid.style.gridTemplateColumns = `repeat(${gridCols}, 100px)`;

    boardValues.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        cardFront.textContent = value;

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.dataset.value = value;
        card.addEventListener("click", flipCard);

        grid.appendChild(card);
    });

    displayBestScore();
}

function flipCard(e) {
    if (lockBoard) return;
    const card = e.currentTarget;
    if (card === firstCard) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;
    movesDisplay.textContent = moves;

    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        handleMatch();
    } else {
        handleNoMatch();
    }
}

function handleMatch() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    firstCard = null;
    secondCard = null;
    matches++;

    if (matches === (gridRows * gridCols) / 2) {
        message.textContent = `🎉 ניצחת! זמן: ${seconds} שניות`;
        clearInterval(timer);
        saveBestScore();
    }
}

function handleNoMatch() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }, 1000);
}


levelBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const level = btn.dataset.level;
        currentLevel = level;

        gridRows = levels[level].rows;
        gridCols = levels[level].cols;

        levelBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        createBoard();
    });
});


restartBtn.addEventListener("click", createBoard);

createBoard();
