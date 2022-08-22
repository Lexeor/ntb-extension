const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
]

const defaultSettings = {
    modules: {
        search: {
            visible: true
        },
        clock: {
            visible: true
        },
        favourites: {
            visible: true
        },
        weather: {
            visible: true
        }
    },
    colors: []
};

function getFormattedTime(dateObj) {
    return `${('0'+dateObj.getHours()).slice(-2)}:${('0'+dateObj.getMinutes()).slice(-2)}`;
}

function getFormattedDateAndTime(dateObj) {
    const day = ('0'+dateObj.getDate()).slice(-2);
    const month = ('0'+(dateObj.getMonth()+1)).slice(-2);
    const year = dateObj.getFullYear();

    const hour = ('0' + dateObj.getHours()).slice(-2);
    const minute = ('0' + dateObj.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hour}:${minute}`;
}

function getCompactLabel(label) {
    return label.length > 16 ? label.substring(0, 14) + "..." : label;
}

function getCurrentTimeOfDay() {
    const now = new Date();
    if(now.getHours() > 4) {
        if(now.getHours() < 10)
            return 'morning';
        if(now.getHours() < 16)
            return 'day';
        if(now.getHours() < 18)
            return 'evening';
    }
    return 'night';
}

export {days, months, defaultSettings, getFormattedTime, getFormattedDateAndTime, getCompactLabel, getCurrentTimeOfDay}