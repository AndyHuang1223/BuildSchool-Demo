const guessBtn = document.querySelector('#guess_btn')
const restartBtn = document.querySelector('#restart_btn')
const showAnswerBtn = document.getElementById('show_answer_btn')
const guessInput = document.getElementById('guess_input')
const hint = document.querySelector('.hint')
let answer, guessNum, minNum, maxNum

window.onload = function () {
    init()
    setDomEvent()
}

function setDomEvent() {
    showAnswerBtn.addEventListener('click', function () {
        alert(answer)
    })
    restartBtn.addEventListener('click', function () {
        init()
    })
    guessBtn.addEventListener('click', guess)
}

function guess() {
    hint.textContent = ''
    const val = guessInput.value.trim()

    if (val == '' || isNaN(val)) {
        alert('請輸入正確的數字')
        guessInput.value = ''
        showHint()
        return
    }

    guessNum = parseInt(val)

    if(guessNum < minNum || guessNum > maxNum){
        showHint()
        guessInput.value = ''
        alert('請確認要輸入的範圍')
        return
    }

    if (guessNum === answer) {
        alert(`猜對了！答案是 ${answer}`)
        guessInput.value = ''
        init()
        return
    } else if (guessNum < answer) {
        minNum = guessNum
    } else if (guessNum > answer) {
        maxNum = guessNum
    } 
    guessInput.value = ''
    showHint()
}
function init() {
    minNum = 1
    maxNum = 100
    answer = generateAnswer()
    showHint()
}

function showHint(){
    hint.textContent = `請輸入${minNum} - ${maxNum}之間的數字`
}

function generateAnswer() {
    return getRandomInt(minNum, maxNum)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
