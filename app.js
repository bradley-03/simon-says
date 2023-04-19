const reset_button = document.getElementById('reset_button')
const score_counter = document.getElementById('score_counter')
const overlay = document.getElementById('game_over')
const overlay_score = document.getElementById('overlay_score')
const new_game = document.getElementById('new_game')
const start_overlay = document.getElementById('start_overlay')

const colour_buttons = [
    document.getElementById('colour1'),
    document.getElementById('colour2'),
    document.getElementById('colour3'),
    document.getElementById('colour4'),
]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const MAX_SPEED_MULTIPLIER = 3.5

let score = 0
let sequence = []
let playerSequence = []
let sequenceCount = 0
let canInteract = false
let gameStarted = false
let speedMultiplier = 1

function toggleInput (toggle) {
    if (toggle == false) {
        for (let button of colour_buttons) {
            button.disabled = true
        }
        canInteract = false
    } else {
        for (let button of colour_buttons) {
            button.disabled = false
        }
        canInteract = true
    }
}

function updateScoreCounter () {
    score_counter.innerText = score
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
    await sleep(500 / speedMultiplier)
    el.classList.remove('flash')
}

async function flashSequence (sequence) {
    toggleInput(false)
    await sleep(1000)
    for (let colour of sequence) {
        await flashSquare(colour)
        await sleep(300 / speedMultiplier)
    }
    toggleInput(true)
}

async function startGame () {
    speedMultiplier = 1
    score = 0
    sequence = []
    playerSequence = []
    updateScoreCounter()
    gameStarted = true
    start_overlay.classList.add('hidden')
    toggleInput(true)

    sequenceCount = 0
    sequence = generateSequence(sequence)
    await flashSequence(sequence)

}

async function endGame (gameover) {
    if (gameover) {
        overlay_score.innerText = "FINAL SCORE: " + score
        overlay.classList.add('shown')
    }
    gameStarted = false
    reset_button.innerText = "Start"
}

reset_button.addEventListener("click", () => {
    if (gameStarted == false) {
        startGame()
    } else {
        endGame()
    }
})

new_game.addEventListener("click", () => {
    overlay.classList.remove('shown')
    startGame()
})

for (let i = 0; i < colour_buttons.length; i++) {
    colour_buttons[i].addEventListener("click", async () => {
        if (canInteract == true) {
            playerSequence.push(i + 1)
            if (playerSequence[sequenceCount] !== sequence[sequenceCount]) { // if input is incorrect
                endGame(true)
            } else {
                if (playerSequence.length == sequence.length) {
                    playerSequence = []
                    sequenceCount = 0
                    score++
                    updateScoreCounter()
                    sequence = generateSequence(sequence)
                    if (speedMultiplier < MAX_SPEED_MULTIPLIER) {
                        speedMultiplier += 0.1;
                    }
                    
                    await flashSequence(sequence)
                } else {
                    sequenceCount++
                }
            }
        }
    })
}

