const grid = document.getElementById("grid");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");

let cardValues = ["🍎","🍎","🍌","🍌","🍇","🍇","🍉","🍉","🍓","🍓","🍒","🍒","🥝","🥝","🍍","🍍"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
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

    let shuffled = shuffle([...cardValues]);

    shuffled.forEach((value) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;
        card.textContent = value;  
        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    });
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
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        firstCard = null;
        secondCard = null;
        matches++;
        if (matches === cardValues.length / 2) {
            message.textContent = "🎉 ניצחת! כל הזוגות נמצאו!";
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1000);
    }
}

restartBtn.addEventListener("click", createBoard);

createBoard();
