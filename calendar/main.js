const dateTitle = document.querySelector('.date-title')
const lastMonthBtn = document.querySelector('.last-month-btn')
const nextMonthBtn = document.querySelector('.next-month-btn')
const todayBtn = document.querySelector('.today-btn')
const createModal = bootstrap.Modal.getOrCreateInstance('#create_todo_modal')
const dateInput = document.querySelector('#date_input')
const todoInput = document.querySelector('#todo_item_input')
const storageKey = 'my-todo'

const updateModal = bootstrap.Modal.getOrCreateInstance('#update_todo_modal')
const updateDateInput = document.querySelector('#date_update_input')
const updateTodoInput = document.querySelector('#todo_item_update_input')
const updateTodoBtn = document.querySelector('#update_todo_modal .update-btn')
const deleteTodoBtn = document.querySelector('#update_todo_modal .delete-btn')
let todoItemObj = {}
let currentYear, currentMonth, today

window.addEventListener('load', function (event) {
    getTodoFromStorage()
    initCalendar()
})

lastMonthBtn.addEventListener('click', function (event) {
    currentMonth--
    if (currentMonth < 1) {
        currentMonth = 12
        currentYear--
    }
    showTitle(currentYear, currentMonth)
    renderingCalendar()
})

nextMonthBtn.addEventListener('click', function (event) {
    currentMonth++
    if (currentMonth > 12) {
        currentMonth = 1
        currentYear++
    }
    showTitle(currentYear, currentMonth)
    renderingCalendar()
})

todayBtn.addEventListener('click', function (event) {
    initCalendar()
})

document.querySelector('#create_todo_modal').addEventListener('hidden.bs.modal', function (event) {
    todoInput.value = ''
})



function initCalendar() {
    const now = new Date()
    today = now
    currentYear = now.getFullYear()
    currentMonth = now.getMonth() + 1
    showTitle(currentYear, currentMonth)
    renderingCalendar()
    dateInput.value = getDateStr(today)
}

function showTitle(year, month) {
    dateTitle.textContent = `${year} / ${month.toString().padStart(2, '0')}`
}

function renderingCalendar() {
    /** Date物件 
     * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Date
     * 取得 2023/7/31 -> let dt = new Date(2023,6,31)
     * 取得 2023/8/1 -> let dt = new Date(2023,6,32)
     * 取得 2023/6/30 -> let dt = new Date(2023,6,-1)
     */

    const firstDateOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDateOfCurrentMonth = new Date(currentYear, currentMonth, 0)

    /** 日曆的第一天與當月1號的關係（1號星期幾，0-6）：
     * 0,1,2,3,4,5,6
     * 日 一 二 三 四 五 六
     * 1,2,3,4,5,6,7      --->(1-0)
     * 0,1,2,3,4,5,6      --->(1-1)
     * -1,0,1,2,3,4,5     --->(1-2)
     * -2,-1,0,1,2,3,4    --->(1-3)
     * -3,-2,-1,0,1,2,3   --->(1-4)
     * -4,-3,-2,-1,0,1,2  --->(1-5)
     * -5,-4,-3,-2,-1,0,1 --->(1-6)
     */
    let start = 1 - firstDateOfCurrentMonth.getDay()
    /** 日曆上顯示的最後一格與當月最後一天的關係(假如 f:30號)
     * 0,1,2,3,4,5,6
     * 日 一 二 三 四 五 六
     * f,1,2,3,4,5,6    --->(30 + (6 - 0))
     *  ,f,1,2,3,4,5    --->(30 + (6 - 1))
     *  , ,f,1,2,3,4    --->(30 + (6 - 2))
     * ......
     *  , , , , ,f,1    --->(30 + (6 - 5))
     *  , , , , , ,f    --->(30 + (6 - 6))
     * .......
     */
    const end = lastDateOfCurrentMonth.getDate() + (6 - lastDateOfCurrentMonth.getDay())
    const dateArea = document.querySelector('.date-area')
    dateArea.innerHTML = ''
    for (start; start <= end; start++) {
        const curr = new Date(currentYear, currentMonth - 1, start)
        const dateDom = document.createElement('div')
        dateDom.classList.add('border', 'col')

        const dateEl = document.createElement('span')
        dateEl.classList.add('d-inline-block', 'w-100', 'text-center')
        if (curr.getFullYear() === today.getFullYear() &&
            curr.getMonth() === today.getMonth() &&
            curr.getDate() === today.getDate()) {
            dateEl.classList.add('badge', 'rounded-pill', 'text-bg-primary')
        }
        dateEl.textContent = curr.getDate()
        dateDom.append(dateEl)

        if (curr.getMonth() + 1 !== currentMonth) {
            dateDom.classList.add('text-black-50')
        }

        const currDateStr = getDateStr(curr)

        const currTodoItems = todoItemObj[currDateStr]
        if (currTodoItems) {
            const ul = document.createElement('ul')
            currTodoItems.forEach((todo, idx) => {
                const li = document.createElement('li')
                li.textContent = todo
                li.addEventListener('click', function (event) {
                    updateDateInput.value = currDateStr
                    updateTodoInput.value = todo
                    updateTodoBtn.onclick = function () {
                        updateTodo(currDateStr, idx, updateTodoInput.value.trim())
                    }
                    deleteTodoBtn.onclick = function () {
                        deleteTodo(currDateStr, idx)
                    }
                    updateModal.show()
                    event.stopPropagation()
                })
                ul.append(li)
            })
            dateDom.append(ul)
        }

        dateDom.addEventListener('click', function () {
            dateInput.value = getDateStr(curr)
            createModal.show()
        })

        dateArea.append(dateDom)
    }
}

function createTodo() {

    const dateString = dateInput.value
    const todoContent = todoInput.value.trim()
    if (todoContent === '') {
        return
    }
    setTodoToStorage(dateString, todoContent)
    todoInput.value = ''
    createModal.hide()
}

function getTodoFromStorage() {
    const todoObj = JSON.parse(localStorage.getItem(storageKey))
    if (todoObj)
        todoItemObj = todoObj
}

function setTodoToStorage(dateStr, content) {
    if (!Array.isArray(todoItemObj[dateStr])) {
        todoItemObj[dateStr] = []
    }

    todoItemObj[dateStr].push(content)
    resetStorage()
    initCalendar()
}

function resetStorage() {
    let todoItemsJson = JSON.stringify(todoItemObj)
    localStorage.setItem(storageKey, todoItemsJson)
}

function deleteTodo(dateStr, idx) {
    todoItemObj[dateStr].splice(idx, 1)
    resetStorage()
    updateModal.hide()
    initCalendar()
}

function updateTodo(dateStr, idx, todoContent) {
    todoItemObj[dateStr][idx] = todoContent
    resetStorage()
    updateModal.hide()
    initCalendar()
}

function getDateStr(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}