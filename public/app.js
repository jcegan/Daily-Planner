const weekPg = document.getElementById('weekly');
const weekDays = [...document.getElementsByClassName('date-day')];
const nextPgBtn = document.getElementById('next-btn');
const prvPgBtn = document.getElementById('previous-btn');
const addTaskBtns = [...document.getElementsByClassName('add-btn')];
const taskForm = document.getElementById('task-form');
const taskFormDate = document.getElementById('task-form-date');
const taskFormCancel = document.getElementById('task-form-cancel');
const taskNameInput = document.getElementById('task-name-input');
const taskTimeInput = document.getElementById('task-time-input');
const taskFormSubmit = document.getElementById('task-form-submit');

const taskData = JSON.parse(localStorage.getItem("data")) || [];
console.log(taskData)
const clearForm = () => {
    taskNameInput.value = '';
    taskTimeInput.value = '';
}

const showTaskForm = () => {
    taskForm.classList.toggle('hidden');
}

const loadTasks = () => {
    weekDays.forEach((day) => {
        day.parentElement.parentElement.children[2].innerHTML = '';
        taskData.forEach((task) => {
            if (day.innerText === task.date) {
                day.parentElement.parentElement.children[2].innerHTML += `<div class="task">
                    <p>${task.title}</p>
                    <p>${task.time}</p>
                </div>`;
            } 
        })
    })
}

const addTask = (date) => {
    let currTask = {
        date: String(date.match(/\d+\/\d+\/\d+/)),
        title: taskNameInput.value,
        time: taskTimeInput.value
    }
    taskData.push(currTask);
    localStorage.setItem('data', JSON.stringify(taskData))
    loadTasks()
}

addTaskBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        taskFormDate.innerText = e.currentTarget.parentElement.children[1].innerText + ' ' + e.currentTarget.parentElement.children[0].innerText;
        if (taskForm.classList.contains('hidden')){
            clearForm();
            showTaskForm();
        }
    })
});

taskFormCancel.addEventListener('click', (e) => {
    console.log('cancel')
    e.preventDefault();
    clearForm();
    showTaskForm();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(e.currentTarget.children[0].innerText);
    showTaskForm();
})

prvPgBtn.addEventListener('click', () => {;
    weekDays.forEach((day) => {
        let dateValues = day.innerText.match(/\d+/g);
        let date = new Date('20' + dateValues[2] + '-' + dateValues[1] + '-' + dateValues[0]);
        date.setDate(date.getDate() - 7)
        let updatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).replace(/\d\d/, '');
        day.innerText = updatedDate;
    })
    loadTasks();
});

nextPgBtn.addEventListener('click', () => {
    weekDays.forEach((day) => {
        let dateValues = day.innerText.match(/\d+/g);
        let date = new Date('20' + dateValues[2] + '-' + dateValues[1] + '-' + dateValues[0]);
        date.setDate(date.getDate() + 7)
        let updatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).replace(/\d\d/, '');
        day.innerText = updatedDate;
    })
    loadTasks();
});

window.onload = () => {
    loadTasks();
}