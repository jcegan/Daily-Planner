const weekPg = document.getElementById('weekly');
const weekDays = document.getElementsByClassName('date-day');
const nextPgBtn = document.getElementById('next-btn');
const prvPgBtn = document.getElementById('previous-btn');



prvPgBtn.addEventListener('click', () => {
    let weekDaysArr = [...weekDays];
    weekDaysArr.forEach((day) => {
        let dateValues = day.innerText.match(/\d+/g);
        let date = new Date('20' + dateValues[2] + '-' + dateValues[1] + '-' + dateValues[0]);
        date.setDate(date.getDate() - 7)
        let updatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).replace(/\d\d/, '');
        day.innerText = updatedDate;
    })
});

nextPgBtn.addEventListener('click', () => {
    let weekDaysArr = [...weekDays];
    weekDaysArr.forEach((day) => {
        let dateValues = day.innerText.match(/\d+/g);
        let date = new Date('20' + dateValues[2] + '-' + dateValues[1] + '-' + dateValues[0]);
        date.setDate(date.getDate() + 7)
        let updatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).replace(/\d\d/, '');
        day.innerText = updatedDate;
    })
});