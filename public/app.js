const yearMonthTitle = document.getElementById('year-month-title');
const weekPg = document.getElementById('weekly');
const monthPg = document.getElementById('monthly');
const yearPg = document.getElementById('yearly');

const monthTaskEditor = document.getElementById('month-task-editor');
const monthTaskEditorDateText = document.getElementById('month-task-editor-date-text');
const monthTaskEditorTasksBox = document.getElementById('month-task-editor-tasks-box');
const monthTaskEditorAddBtn = document.getElementById('month-task-editor-add-btn');

const weeklyDateTitles = [...document.getElementsByClassName('date-month-title')];
const tasksBoxes = [...document.getElementsByClassName('tasks-box')];
const monthTiles = [...document.getElementsByClassName('month-tile')];
const monthDays = [...document.getElementsByClassName('month-date')];
const taskAmounts = [...document.getElementsByClassName('task-amount')];
const yearTiles = [...document.getElementsByClassName('year-tile')];
const yearTileGrids = [...document.getElementsByClassName('tile-grid')];

const nextPgBtn = document.getElementById('next-btn');
const prvPgBtn = document.getElementById('previous-btn');
const addTaskBtns = [...document.getElementsByClassName('add-btn')];

const taskForm = document.getElementById('task-form');
const taskFormDate = document.getElementById('task-form-date');
const taskFormCancel = document.getElementById('task-form-cancel');
const taskNameInput = document.getElementById('task-name-input');
const taskTimeInput = document.getElementById('task-time-input');
const taskFormSubmit = document.getElementById('task-form-submit');

const yearBtn = document.getElementById('year-btn');
const monthBtn = document.getElementById('month-btn');
const weekBtn = document.getElementById('week-btn');

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let taskData = JSON.parse(localStorage.getItem("data")) || [];
let currDateOfTaskConstructing;
const todaysDate = new Date();

const clearForm = () => {
    taskNameInput.value = '';
    taskTimeInput.value = '';
};

const clearTasks = () => {
    tasksBoxes.forEach((box) => {
        box.innerHTML = '';
    });
    monthTaskEditorTasksBox.innerHTML = '';
}

const showTaskForm = () => {
    taskForm.classList.toggle('hidden');
};

const getOffsetDate = (year, month, date) => {
    let modifiedMonth = month;
    let modifiedYear = year;
    if (date < 15) {
        modifiedMonth = month === 11 ? 0 : month + 1;
    } else {
        modifiedMonth = month === 0 ? 11 : month - 1;
    };
    if (modifiedMonth === 0) {
        modifiedYear = Number(year) + 1;
    } else if(modifiedMonth === 11) {
        modifiedYear = Number(year) - 1;
    };
    return new Date(modifiedYear, modifiedMonth, date);
};

let dateOfTasksLoading;

const loadTasks = (e) => {
    taskData = JSON.parse(localStorage.getItem("data")) || [];
    clearTasks();
    const currMonth = months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/)));
    const currYear = yearMonthTitle.innerText.match(/\d+/);
    if(monthPg.classList.contains('hidden') && weekPg.classList.contains('hidden')){
        //load year tasks
    } else if(/*yearPg.classList.contains('hidden') &&*/ weekPg.classList.contains('hidden')){
        if (e) {
            if (e.currentTarget.classList.contains('grey')) {
                dateOfTasksLoading = getOffsetDate(currYear, currMonth, e.currentTarget.children[0].innerText.match(/\d+/));
            } else {
                dateOfTasksLoading = new Date(currYear, currMonth, e.currentTarget.children[0].innerText.match(/\d+/));
            };
        } else {
            if (months[currDateOfTaskConstructing.getMonth()].match(/^.../)[0] !== months[currMonth].match(/^.../)[0]){
                dateOfTasksLoading = getOffsetDate(currYear, currMonth, currDateOfTaskConstructing.getDate());
            } else { 
                dateOfTasksLoading = currDateOfTaskConstructing;
            };
        };
        monthTaskEditorDateText.innerText = `${daysOfWeek[dateOfTasksLoading.getDay()].match(/^.../)} ${dateOfTasksLoading.getDate()} ${months[dateOfTasksLoading.getMonth()].match(/^.../)}`;
        displayTasks(monthTaskEditorTasksBox);
    } else {
        tasksBoxes.forEach((dayTask) => {
            if (months[currMonth].match(/^.../)[0] !== String(dayTask.parentElement.children[0].innerText).match(/...$/)[0]){
                dateOfTasksLoading = new Date(currMonth === 11 ? Number(currYear) + 1 : currYear, currMonth === 11 ? 0 : currMonth + 1, dayTask.parentElement.children[0].innerText.match(/\d+/));
            } else {
                dateOfTasksLoading = new Date(currYear, currMonth, dayTask.parentElement.children[0].innerText.match(/\d+/));
            };
            displayTasks(dayTask);
        });
    }
};

const displayTasks = (day) => {
    let tasksOfDay = [];
    let taskDate = {
        year: dateOfTasksLoading.getFullYear(),
        month: dateOfTasksLoading.getMonth(),
        date: dateOfTasksLoading.getDate()
    };
    taskData.forEach((task) => {
        if (JSON.stringify(task.date) === JSON.stringify(taskDate)) {
            tasksOfDay.push(task);
        };
    });
    let sortedDayTasks = tasksOfDay.sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        return (aHours ? aHours : 23 * 60 + aMinutes ? aMinutes : 59) - (bHours ? bHours : 23 * 60 + bMinutes ? bMinutes : 59);
    });
    sortedDayTasks.forEach((task) => {
        day.innerHTML += `<div class="task">
            <p class='task-title'>${task.title}</p>
            <p class='task-time'>${task.time ? `-${task.time}-` : '-Any time-'}</p>
            <button class='btn btn-info btn-sm edit-task-btn' onclick='editTaskHandler(event)'><i class="fas fa-edit"></i></button>
            <button class='btn btn-danger btn-sm delete-task-btn' onclick='deleteTask(event)'><i class="fas fa-trash"></i></button>
        </div>`;
    });
};

const deleteTask = (e) => {
    const currMonth = months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/)));
    const currYear = yearMonthTitle.innerText.match(/\d+/)[0];
    let dateOfTaskDeleting;
    if (months.findIndex((month) => month.match(/^.../)[0] === e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText.match(/...$/)[0]) !== currMonth){
        dateOfTaskDeleting = getOffsetDate(currYear, currMonth, e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText.match(/\d+/)[0])
    } else {
        dateOfTaskDeleting = new Date(currYear, currMonth, e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText.match(/\d+/)[0]);
    };
    let filteredTaskData = taskData.filter((task) => {
        let canRemove = false;
        const { year, month, date } = task.date;
        if(year === dateOfTaskDeleting.getFullYear() && month === dateOfTaskDeleting.getMonth() && date === dateOfTaskDeleting.getDate()){
            if(task.title === e.currentTarget.parentElement.children[0].innerText && `-${task.time}-` === (e.currentTarget.parentElement.children[1].innerText === '-Any time-' ? '--' : e.currentTarget.parentElement.children[1].innerText)){
                canRemove = !canRemove;
            };
        };
        return canRemove === false;
    });
    localStorage.setItem('data', JSON.stringify(filteredTaskData));
    currDateOfTaskConstructing = dateOfTaskDeleting;
    loadTasks();
};

let taskEditing = {};

const editTaskHandler = (e) => {
    if (taskForm.classList.contains('hidden')){
        clearForm();
        const currMonth = months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/)));
        const currYear = yearMonthTitle.innerText.match(/\d+/)[0];
        let dateOfTaskEditing;
        if (months.findIndex((month) => month.match(/^.../)[0] === e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText.match(/...$/)[0]) !== currMonth){
            dateOfTaskEditing = getOffsetDate(currYear, currMonth, e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText.match(/\d+/)[0])
        } else {
            dateOfTaskEditing = new Date(currYear, currMonth, e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText.match(/\d+/)[0]);
        };
        taskFormDate.innerText = weekPg.classList.contains('hidden') ? e.currentTarget.parentElement.parentElement.parentElement.children[0].innerText : e.currentTarget.parentElement.parentElement.parentElement.children[0].children[0].innerText + ' ' + e.currentTarget.parentElement.parentElement.parentElement.children[0].children[1].innerText;
        taskNameInput.value = e.currentTarget.parentElement.children[0].innerText;
        taskTimeInput.value = e.currentTarget.parentElement.children[1].innerText === '-Any time-' ? '' : e.currentTarget.parentElement.children[1].innerText.match(/\d+:\d+/);
        taskEditing = {
            date: {
                year: dateOfTaskEditing.getFullYear(),
                month: dateOfTaskEditing.getMonth(),
                date: dateOfTaskEditing.getDate()
            },
            title: taskNameInput.value,
            time: taskTimeInput.value
        };
        currDateOfTaskConstructing = dateOfTaskEditing;
        taskFormSubmit.innerText = 'Update';
        showTaskForm();
    };
};

const editTask = (dateObj) => {
    const currTask = {
        date: {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth(),
            date: dateObj.getDate()
        },
        title: taskNameInput.value,
        time: taskTimeInput.value
    };
    taskData.splice(taskData.findIndex((el) => el.date.year === taskEditing.date.year && el.date.month === taskEditing.date.month && el.date.date === taskEditing.date.date && el.title === taskEditing.title && el.time == (taskEditing.time ? taskEditing.time : '')), 1, currTask);
    localStorage.setItem('data', JSON.stringify(taskData));
    clearForm();
    loadTasks();
}

const addTask = (dateObj) => {
    let currTask = {
        date: {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth(),
            date: dateObj.getDate()
        },
        title: taskNameInput.value,
        time: taskTimeInput.value
    };
    taskData.push(currTask);
    localStorage.setItem('data', JSON.stringify(taskData));
    loadTasks();
};

const getWeekDayDates = (i, firstOfMonth) => {
    const updatedDate = new Date(firstOfMonth); 
    switch (firstOfMonth.getDay()){
        case 0:
            updatedDate.setDate((firstOfMonth.getDate() + i) - 6);
            break;
        case 1:
            updatedDate.setDate(firstOfMonth.getDate() + i);
            break;
        case 2:
            updatedDate.setDate((firstOfMonth.getDate() + i) - 1);
            break;
        case 3:
            updatedDate.setDate((firstOfMonth.getDate() + i) - 2);
            break;
        case 4:
            updatedDate.setDate((firstOfMonth.getDate() + i) - 3);
            break;
        case 5:
            updatedDate.setDate((firstOfMonth.getDate() + i) - 4);
            break;
        case 6:
            updatedDate.setDate((firstOfMonth.getDate() + i) - 5);
            break;
        default:
            updatedDate.setDate((firstOfMonth.getDate()));
    };
    return updatedDate;
};

const loadYear = () => {
    yearMonthTitle.innerText = months[0] + ' ' + yearMonthTitle.innerText.match(/\d+/);
    yearTileGrids.forEach((tile) => {
        tile.innerHTML = '';
    });
    for (let i = 0; i < yearTileGrids.length; i++){
        const firstOfMonth = new Date(yearMonthTitle.innerText.match(/\d+/), i, 1);
        for (let j = 1; j < 8; j++){
            yearTileGrids[i].innerHTML += `<div id='weekday-tile-${i}-${j}' class='year-box weekday-tile'>${(j === 7 ? daysOfWeek[0] : daysOfWeek[j]).match(/^./)}</div>`;
        };
        for (let j = 0; j < 35; j++){
            const updatedDateObj = getWeekDayDates(j, firstOfMonth);
            yearTileGrids[i].innerHTML += `<div id='tile-${i}-${j}' class='year-box'>${updatedDateObj.getDate()}</div>`;
            const currTile = document.getElementById(`tile-${i}-${j}`);
            const numOfTasks = taskData.filter((task) => task.date.year === updatedDateObj.getFullYear() && task.date.month === updatedDateObj.getMonth() && task.date.date === updatedDateObj.getDate()).length;
            switch (numOfTasks){
                case 0:
                    break;
                case 1:
                    currTile.classList.add('box-color-1');
                    break;
                case 2:
                    currTile.classList.add('box-color-2');
                    break;
                case 3:
                    currTile.classList.add('box-color-3');
                    break;
                default:
                    currTile.classList.add('box-color-4');
            };
        };
    };
};

const loadMonth = () => {
    lockMonthTaskEditor = false;
    for (let i = 0; i < monthDays.length; i++){
        monthDays[i].parentElement.classList.remove('grey');
        monthDays[i].parentElement.classList.remove('locked');
        const firstOfMonth = new Date(yearMonthTitle.innerText.match(/\d+/), months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/))), 1);
        const currMonth = firstOfMonth.getMonth();
        const updatedDateObj = getWeekDayDates(i, firstOfMonth);
        monthDays[i].innerText = updatedDateObj.getDate();
        taskAmounts[i].innerText = `${taskData.filter((task) => task.date.year === updatedDateObj.getFullYear() && task.date.month === updatedDateObj.getMonth() && task.date.date === updatedDateObj.getDate()).length} Items`;
        taskAmounts[i].innerHTML.match(/^[0-9]/) > 0 ? taskAmounts[i].classList.add('bold') : taskAmounts[i].classList.remove('bold');
        if(updatedDateObj.getMonth() !== currMonth){
            monthDays[i].parentElement.classList.add('grey');
        };
    };
};

const loadWeek = () => {
    const firstOfMonth = yearMonthTitle.innerText === '' ? new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1) : new Date(yearMonthTitle.innerText.match(/\d+/), months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/))), 1);
    yearMonthTitle.innerText = months[firstOfMonth.getMonth()] + ' ' + firstOfMonth.getFullYear();
    const currMonth = firstOfMonth.getMonth();
    for (let i = 0; i < weeklyDateTitles.length; i++){
        weeklyDateTitles[i].parentElement.parentElement.classList.remove('grey');
        const updatedDateObj = getWeekDayDates(i, firstOfMonth);
        weeklyDateTitles[i].innerText = `${updatedDateObj.getDate()} ${months[updatedDateObj.getMonth()].match(/^.../)}`;
        if(updatedDateObj.getMonth() !== currMonth){
            weeklyDateTitles[i].parentElement.parentElement.classList.add('grey');
            if(i === 0){
                const prvMonth = months[currMonth - 1 === -1 ? 11 : currMonth - 1];
                yearMonthTitle.innerText = `${prvMonth} ${(prvMonth === 'December' ? (Number(yearMonthTitle.innerText.match(/\d+/)) - 1) : yearMonthTitle.innerText.match(/\d+/))}`;
            };
        };
    };
};

addTaskBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        taskFormDate.innerText = monthPg.classList.contains('hidden') ? `${e.currentTarget.parentElement.children[0].children[0].innerText} ${e.currentTarget.parentElement.children[0].children[1].innerText}` : e.currentTarget.parentElement.children[0].innerText;
        const currMonth = months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/)));
        const currYear = yearMonthTitle.innerText.match(/\d+/);
        if (e.currentTarget.parentElement.children[0].innerText.match(/...$/)[0] !== months[currMonth].match(/^.../)[0] && weekPg.classList.contains('hidden')) {
            currDateOfTaskConstructing = getOffsetDate(currYear, currMonth, e.currentTarget.parentElement.children[0].innerText.match(/\d+/));
        } else if (months[currMonth].match(/^.../)[0] !== String(e.currentTarget.parentElement.children[0].innerText).match(/...$/)[0] && monthPg.classList.contains('hidden')){
            currDateOfTaskConstructing = new Date(currMonth === 11 ? Number(currYear) + 1 : currYear, currMonth === 11 ? 0 : currMonth + 1, e.currentTarget.parentElement.children[0].innerText.match(/\d+/));
        } else {
            currDateOfTaskConstructing = new Date(currYear, currMonth, e.currentTarget.parentElement.children[0].innerText.match(/\d+/));
        };
        if (taskForm.classList.contains('hidden')){
            clearForm();
            showTaskForm();
        };
    });
});

taskFormCancel.addEventListener('click', (e) => {
    e.preventDefault();
    if(taskFormSubmit.innerText === 'Update'){
        taskFormSubmit.innerText = 'Add';
    };
    clearForm();
    taskEditing = {};
    showTaskForm();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(taskFormSubmit.innerText === 'Update'){
        editTask(currDateOfTaskConstructing);
        taskFormSubmit.innerText = 'Add';
    } else {
        addTask(currDateOfTaskConstructing);
    };
    showTaskForm();
});

let lockMonthTaskEditor = false;

monthTiles.forEach((tile) => {
    tile.addEventListener('mouseover', (e) => {
        if(!lockMonthTaskEditor){
            loadTasks(e);    
            monthTaskEditor.classList.remove('hidden');
        };
    });
    tile.addEventListener('click', (e) => {
        if(tile.classList.contains('locked')){
            tile.classList.remove('locked');
            lockMonthTaskEditor = false;
        } else {
            monthTiles.forEach((tile) => {
                tile.classList.remove('locked');
            });
        tile.classList.add('locked');
        lockMonthTaskEditor = true;
        loadTasks(e);
        };
    });
});

yearTiles.forEach((tile) => {
    tile.addEventListener('click', (e) => {
        yearMonthTitle.innerText = `${e.currentTarget.children[0].innerText} ${yearMonthTitle.innerText.match(/\d+/)}`;
        clearTasks();
        loadMonth();
        yearPg.classList.toggle('hidden');
        monthPg.classList.toggle('hidden');
        yearBtn.disabled = false;
        weekBtn.disabled = false;
        monthBtn.disabled = true;
        lockMonthTaskEditor = false;
    });
});

yearBtn.addEventListener('click', () => {
    clearTasks();
    loadYear();
    if(monthPg.classList.contains('hidden')){
        weekPg.classList.toggle('hidden');
    } else {
        monthPg.classList.toggle('hidden');
    };
    yearPg.classList.toggle('hidden');
    yearBtn.disabled = true;
    monthBtn.disabled = false;
    weekBtn.disabled = false;
})

monthBtn.addEventListener('click', () => {
    clearTasks();
    loadMonth();
    monthTaskEditor.classList.add('hidden');
    if (weekPg.classList.contains('hidden')){
        yearPg.classList.toggle('hidden');
    } else {
        weekPg.classList.toggle('hidden');
    };
    monthPg.classList.toggle('hidden');
    yearBtn.disabled = false;
    weekBtn.disabled = false;
    monthBtn.disabled = true;
    lockMonthTaskEditor = false;
});

weekBtn.addEventListener('click', () => {
    clearTasks();
    loadWeek();
    if (monthPg.classList.contains('hidden')){
        yearPg.classList.toggle('hidden');
    } else {
        monthPg.classList.toggle('hidden');
    };
    weekPg.classList.toggle('hidden');
    yearBtn.disabled = false;
    monthBtn.disabled = false;
    weekBtn.disabled = true;
    loadTasks();
});

prvPgBtn.addEventListener('click', () => {
    const mondayDateObj = new Date(yearMonthTitle.innerText.match(/\d+/), months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/))), monthPg.classList.contains('hidden') ? weeklyDateTitles[0].innerText.match(/\d+/) : 1);
    let mondayMonthNumber;
    let mondayYearNumber;
    if(monthPg.classList.contains('hidden') && weekPg.classList.contains('hidden')){
        yearMonthTitle.innerText = `January ${Number(yearMonthTitle.innerText.match(/\d+/)) - 1}`;
        loadYear();
    } else if(yearPg.classList.contains('hidden') && weekPg.classList.contains('hidden')){
        const prvMonth = months[mondayDateObj.getMonth() - 1 === -1 ? 11 : mondayDateObj.getMonth() - 1];
        yearMonthTitle.innerText = `${prvMonth} ${(prvMonth === 'December' ? (Number(yearMonthTitle.innerText.match(/\d+/)) - 1) : yearMonthTitle.innerText.match(/\d+/))}`;
        loadMonth();
    } else {
        weeklyDateTitles.forEach((day) => {
            day.parentElement.parentElement.classList.remove('grey');
        });
        for(let i = 0; i < weeklyDateTitles.length; i++){
            const updatedDateObj = new Date(mondayDateObj);
            updatedDateObj.setDate((updatedDateObj.getDate() + i) - 7);
            if(i === 0){
                mondayMonthNumber = updatedDateObj.getMonth();
                mondayYearNumber = updatedDateObj.getFullYear();
            };
            weeklyDateTitles[i].innerText = `${updatedDateObj.getDate()} ${months[updatedDateObj.getMonth()].match(/^.../)}`;
        };
        yearMonthTitle.innerText = `${months[mondayMonthNumber]} ${mondayYearNumber}`;
        loadTasks();
    };
});

nextPgBtn.addEventListener('click', () => {
    const mondayDateObj = new Date(yearMonthTitle.innerText.match(/\d+/), months.indexOf(String(yearMonthTitle.innerText.match(/[A-Za-z]+/))), monthPg.classList.contains('hidden') ? weeklyDateTitles[0].innerText.match(/\d+/) : 1);
    let mondayMonthNumber;
    let mondayYearNumber;
    if(monthPg.classList.contains('hidden') && weekPg.classList.contains('hidden')){
        yearMonthTitle.innerText = `January ${Number(yearMonthTitle.innerText.match(/\d+/)) + 1}`;
        loadYear();
    } else if(yearPg.classList.contains('hidden') && weekPg.classList.contains('hidden')){
        const nextMonth = months[mondayDateObj.getMonth() + 1 === 12 ? 0 : mondayDateObj.getMonth() + 1];
        yearMonthTitle.innerText = `${nextMonth} ${(nextMonth === 'January' ? (Number(yearMonthTitle.innerText.match(/\d+/)) + 1) : yearMonthTitle.innerText.match(/\d+/))}`;
        loadMonth();
    } else {
        weeklyDateTitles.forEach((day) => {
            day.parentElement.parentElement.classList.remove('grey');
        });
        for(let i = 0; i < weeklyDateTitles.length; i++){
            const updatedDateObj = new Date(mondayDateObj);
            updatedDateObj.setDate((updatedDateObj.getDate() + i) + 7);
            if(i === 0){
                mondayMonthNumber = updatedDateObj.getMonth();
                mondayYearNumber = updatedDateObj.getFullYear();
            };
            weeklyDateTitles[i].innerText = `${updatedDateObj.getDate()} ${months[updatedDateObj.getMonth()].match(/^.../)}`;
        };
        yearMonthTitle.innerText = `${months[mondayMonthNumber]} ${mondayYearNumber}`;
        loadTasks();
    };
});

window.onload = () => {
    loadWeek();
};