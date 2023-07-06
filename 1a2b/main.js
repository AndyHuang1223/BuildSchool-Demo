const startBtn = document.getElementById('start_btn')
const restartBtn = document.getElementById('restart_btn')
const showAnswerBtn = document.getElementById('show_answer_btn')
const guessInput = document.getElementById('guess_input')
const guessBtn = document.getElementById('guess_btn')
const guessHistoryList = document.getElementById('guess_history_list')

const gameMsgToast = document.getElementById('game_msg_toast')

const endGameModal = bootstrap.Modal.getOrCreateInstance('#end_game_modal')
const endGameBtn = document.getElementById('end_game_btn')

let answer

startBtn.addEventListener('click', function () {
    initDomHandler()
    startGameBtnHandler()
    generateAns()
})

restartBtn.addEventListener('click', function () {
    showHint('請按開始按鈕')
    initDomHandler()
})

showAnswerBtn.addEventListener('click', function () {
    showHint(answer)
})

guessBtn.addEventListener('click', function () {
    guessHandle()
})

guessInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        guessHandle()
    }

})

endGameBtn.addEventListener('click', function (event) {
    endGameModal.hide()
    initDomHandler()
    startGameBtnHandler()
    generateAns()
})

window.addEventListener('load', function (event) {
    initDomHandler()
})

function guessHandle() {

    const val = guessInput.value.trim()
    if (val == '' || isNaN(val)) {
        showHint('請輸入合法的數字')
        guessInput.value = ''
        return
    }

    if (guessInput.value.length > 4 || new Set(val.split('')).size !== 4) {
        showHint('請確認輸入數字數量')
        guessInput.value = ''
        return
    }

    let a = 0, b = 0
    for (let i = 0; i < answer.length; i++) {
        if (val[i] === answer[i]) {
            a++
        } else if (answer.includes(val[i])) {
            b++
        }
    }

    const guessResult = {
        a: a,
        b: b,
        guessNum: val
    }

    insertHistory(guessResult)

    if (a === 4) {
        endGameModal.show()
        guessBtn.disabled = true
        guessInput.disabled = true
        startBtn.disabled = false
    }
    
    guessInput.value = ''
    guessInput.focus()
}

function initDomHandler() {
    startBtn.disabled = false
    restartBtn.disabled = true
    showAnswerBtn.disabled = true
    guessBtn.disabled = true
    guessInput.disabled = true
    guessHistoryList.innerHTML = ''
}

function startGameBtnHandler() {
    startBtn.disabled = true
    restartBtn.disabled = false
    showAnswerBtn.disabled = false
    guessBtn.disabled = false
    guessInput.disabled = false
}

function generateAns() {
    const numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    numArr.sort(() => getRandomArbitrary(-1, 1))
    answer = numArr.slice(0, 4).reduce((acc, curr) => {
        return acc + curr
    }, '')

}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function insertHistory(guessResult) {
    const li = `<li class="list-group-item"><span class="badge ${guessResult.a === 4 ? 'bg-success' : 'bg-danger'}">${guessResult.a}A${guessResult.b}B</span> ${guessResult.guessNum}</li>`
    guessHistoryList.innerHTML += li
}

function showHint(msg = '') {
    gameMsgToast.querySelector('.toast-body').textContent = msg

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(gameMsgToast)

    toastBootstrap.show()
}

