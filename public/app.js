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

let taskData = JSON.parse(localStorage.getItem("data")) || [];

const clearForm = () => {
    taskNameInput.value = '';
    taskTimeInput.value = '';
}

const showTaskForm = () => {
    taskForm.classList.toggle('hidden');
}

const loadTasks = () => {
    taskData = JSON.parse(localStorage.getItem("data")) || [];
    weekDays.forEach((day) => {
        let tasksOfDay = [];
        day.parentElement.parentElement.children[2].innerHTML = '';
        taskData.forEach((task) => {
            if (day.innerText === task.date) {
                tasksOfDay.push(task);
            } 
        })
        let sortedDayTasks = tasksOfDay.sort((a, b) => {
            const [aHours, aMinutes] = a.time.split(':').map(Number);
            const [bHours, bMinutes] = b.time.split(':').map(Number);
            return (aHours ? aHours : 23 * 60 + aMinutes ? aMinutes : 59) - (bHours ? bHours : 23 * 60 + bMinutes ? bMinutes : 59);
        });
        sortedDayTasks.forEach((task) => {
            day.parentElement.parentElement.children[2].innerHTML += `<div class="task">
                <p class='task-title'>${task.title}</p>
                <p class='task-time'>${task.time ? '-' + task.time + '-' : '-Any time-'}</p>
                <button class='btn btn-info btn-sm edit-task-btn' onclick='editTaskHandler(event)'><i class="fas fa-edit"></i></button>
                <button class='btn btn-danger btn-sm delete-task-btn' onclick='deleteTask(event)'><i class="fas fa-trash"></i></button>
            </div>`;
        })
    })
}

const deleteTask = (e) => {
    let filteredTaskData = taskData.filter((task) => {
        return task.date !== e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText || task.title !== e.currentTarget.parentElement.children[0].innerText || '-' + task.time + '-' !== (e.currentTarget.parentElement.children[1].innerText === '-Any time-' ? '--' : e.currentTarget.parentElement.children[2].innerText);
    })
    localStorage.setItem('data', JSON.stringify(filteredTaskData));
    loadTasks();
}

let taskEditing = {};

const editTaskHandler = (e) => {
    if (taskForm.classList.contains('hidden')){
        clearForm();
        taskFormDate.innerText = e.currentTarget.parentElement.parentElement.parentElement.children[1].innerText + ' ' + e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText;
        taskNameInput.value = e.currentTarget.parentElement.children[0].innerText;
        taskTimeInput.value = e.currentTarget.parentElement.children[1].innerText === '-Any time-' ? '' : e.currentTarget.parentElement.children[1].innerText.match(/\d+:\d+/);
        taskEditing.date = e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText;
        taskEditing.title = e.currentTarget.parentElement.children[0].innerText;
        taskEditing.time = e.currentTarget.parentElement.children[1].innerText === '-Any time-' ? '' : e.currentTarget.parentElement.children[1].innerText.match(/\d+:\d+/);
        taskFormSubmit.innerText = 'Update';
        showTaskForm();
    }
}

const editTask = (date) => {
    let currTask = {
        date: String(date.match(/\d+\/\d+\/\d+/)),
        title: taskNameInput.value,
        time: taskTimeInput.value
    }
    taskData.splice(taskData.findIndex((el) => el.date === taskEditing.date && el.title === taskEditing.title && el.time == (taskEditing.time ? taskEditing.time : '')), 1, currTask);
    localStorage.setItem('data', JSON.stringify(taskData))
    clearForm();
    loadTasks();
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
    e.preventDefault();
    if(taskFormSubmit.innerText === 'Update'){
        taskFormSubmit.innerText = 'Add';
    }
    clearForm();
    taskEditing = {};
    showTaskForm();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(taskFormSubmit.innerText === 'Update'){
        editTask(e.currentTarget.children[0].innerText);
        taskFormSubmit.innerText = 'Add';
    } else {
        addTask(e.currentTarget.children[0].innerText);
    }
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