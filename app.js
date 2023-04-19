const reset_button = document.getElementById('reset_button')
const score_counter = document.getElementById('score_counter')
const overlay = document.getElementById('game_over')
const overlay_score = document.getElementById('overlay_score')
const new_game = document.getElementById('new_game')
const start_overlay = document.getElementById('start_overlay')
const high_score = document.getElementById('high_score')
const dark_mode = document.getElementById('dark_mode')

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

let highScore = 0
let score = 0
let sequence = []
let playerSequence = []
let sequenceCount = 0
let canInteract = false
let gameStarted = false
let speedMultiplier = 1
let darkMode = false

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkHighscore() {
    let highscoreCookie = getCookie("highscore")
    if (highscoreCookie != "") { // if highscore cookie exists set as variable
        highScore = highscoreCookie
        high_score.innerText = `High Score: ${highScore}`
    }
    let darkmodeCookie = getCookie("darkmode")
    if (darkmodeCookie != "") {
        if (darkmodeCookie = false) {
            document.body.classList.remove("darkMode")
            dark_mode.classList.remove("light")
            dark_mode.innerHTML = '<i class="bi bi-moon-fill"></i>'
            darkMode = false
        } else {
            document.body.classList.add("darkMode")
            dark_mode.classList.add("light")
            dark_mode.innerHTML = '<i class="bi bi-brightness-high-fill"></i>'
            darkMode = true
        }
    }
}

checkHighscore()

function toggleInput(toggle) {
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

function updateScoreCounter() {
    score_counter.innerText = score
}

function generateSequence(currentsequence) {
    let temparray = currentsequence
    const randColour = Math.floor(Math.random() * 4) + 1
    temparray.push(randColour)
    return temparray
}

async function flashSquare(square) {
    const el = document.getElementById(`colour${square}`)
    el.classList.add('flash')
    await sleep(500 / speedMultiplier)
    el.classList.remove('flash')
}

async function flashSequence(sequence) {
    toggleInput(false)
    await sleep(1000)
    for (let colour of sequence) {
        await flashSquare(colour)
        await sleep(300 / speedMultiplier)
    }
    toggleInput(true)
}

async function startGame() {
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

async function endGame(gameover) {
    if (gameover) {
        overlay_score.innerText = "FINAL SCORE: " + score
        overlay.classList.add('shown')
    }
    gameStarted = false
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
            if (playerSequence[sequenceCount] !== sequence[sequenceCount]) { // if input is incorrect end the game
                if (score > highScore) {
                    high_score.innerText = `High Score: ${score}`
                    document.cookie = `highscore=${score}`
                }
                endGame(true)
            } else {
                if (playerSequence.length == sequence.length) { // check if sequence is complete
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

dark_mode.addEventListener("click", () => {
    if (darkMode == false) {
        document.body.classList.add("darkMode")
        dark_mode.classList.add("light")
        dark_mode.innerHTML = '<i class="bi bi-brightness-high-fill"></i>'
        document.cookie = "darkmode=true"
        darkMode = true
    } else {
        document.body.classList.remove("darkMode")
        dark_mode.classList.remove("light")
        dark_mode.innerHTML = '<i class="bi bi-moon-fill"></i>'
        document.cookie = "darkmode=false"
        darkMode = false
    }
})

