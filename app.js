const reset_button = document.getElementById('reset_button')
const score_counter = document.getElementById('score_counter')

const colour1btn = document.getElementById('colour1')
const colour2btn = document.getElementById('colour2')
const colour3btn = document.getElementById('colour3')
const colour4btn = document.getElementById('colour4')

const GAME_SETTINGS = {
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let score = 0
let sequence = []
let playerSequence = []
let canInteract = true

function updateScoreCounter () {
    score_counter.innerText = "Score: " + score
}

function generateSequence (currentsequence) {
    let temparray = currentsequence
    const randColour = Math.floor(Math.random() * 4) + 1
    temparray.push(randColour)
    return temparray
}

async function flashSquare (square) {
    const el = document.getElementById(`colour${square}`)
    el.classList.add('flash')
    await sleep(500)
    el.classList.remove('flash')
}

async function flashSequence (sequence) {
    canInteract = false
    for (let colour of sequence) {
        await flashSquare(colour)
        await sleep(300)
    }
    canInteract = true
}

async function resetGame () {
    score = 0
    sequence = []
    playerSequence = []
    updateScoreCounter()
    sequence = generateSequence(sequence)
    await flashSequence(sequence)
}

reset_button.addEventListener("click", () => {
    resetGame()
})

colour1btn.addEventListener("click", () => {
    if (canInteract == true) {
        score++
        updateScoreCounter()
        sequence = generateSequence(sequence)
        console.log(sequence)
    }
})