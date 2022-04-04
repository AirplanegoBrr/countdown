const dateMaker = document.getElementById('dateMaker');
const countdowns = document.getElementById('countdowns');
const main = document.getElementById('main');
const add = document.getElementById('add');
const form = document.getElementById('abc');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const formInputs = form.elements;
var socket = io();
//wait 2 seconds
socket.on('connect', function () {
    console.log('Connected to server');
});
//when socket sends login message, show login form
socket.on('login', (data) => {
    console.log(data);
    //set token in local storage
    localStorage.setItem('token', data.token);
    //reload page
    location.reload();
});
socket.on('token', (data) => {
    console.log(data)
    if (data.status) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        main.style.display = 'block';
    } else {
        localStorage.setItem('token', null);
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        main.style.display = 'none';
    }
})
var toggleShow = false
var rawData = []

//get stored data
var storedData = JSON.parse(localStorage.getItem('data'))
if (storedData) {
    rawData = storedData
}
var token = localStorage.getItem('token')
dateMaker.style.display = 'none'
//if no token
if (token == "" || token == null) {
    console.log('no token')
    main.style.display = "none"
    loginForm.style.display = "block"
    signupForm.style.display = "none"
} else {
    console.log('token')
    loginForm.style.display = "none"
    signupForm.style.display = "none"
    main.style.display = "none"
    //wait 1 second 
    setTimeout(() => {
        console.log('Checking token')
        socket.emit('token', {
            token: token
        })
    }, 1000);
}


form.addEventListener("submit", formSubmit);
document.getElementById("setTime").addEventListener("click", setTime);
add.addEventListener("click", addNew);

loginForm.addEventListener("submit", login);
signupForm.addEventListener("submit", signup);

function login(e) {
    e.preventDefault()
    var submitter = e.submitter.defaultValue
    console.log(submitter)
    if (submitter == "Login") {
        var username = loginForm.elements.username.value
        var password = loginForm.elements.password.value
        var data = {
            username: username,
            password: password
        }
        socket.emit('login', data)
    } else if (submitter == "Register") {
        loginForm.style.display = "none"
        signupForm.style.display = "block"
    }

}
function signup(e) {
    e.preventDefault()
    var submitter = e.submitter.defaultValue
    if (submitter == "Login") {
        loginForm.style.display = "block"
        signupForm.style.display = "none"
    } else if (submitter == "Signup") {
        var username = signupForm.elements.username.value
        var password = signupForm.elements.password.value
        var password2 = signupForm.elements.password2.value
        console.log(username, password, password2)
        if (password != password2) {
            alert("Passwords do not match")
        } else {
            var data = {
                username: username,
                password: password
            }
            socket.emit('signup', data)
        }
    }
}

function makeNewCountdown(name, date, time) {
    var newCountdown = document.createElement('div');
    newCountdown.className = 'countdown';
    newCountdown.innerHTML = `<h1>${name}</h1>
    <h2>${date}</h2>
    <h2>${time}</h2>`;
    countdowns.appendChild(newCountdown);
}
function addNew(e) {
    //console.log(e)
    if (toggleShow) {
        console.log("hide")
        dateMaker.style.display = 'none';
        toggleShow = false;
    } else {
        console.log("show")
        dateMaker.style.display = 'block';
        toggleShow = true;
    }
}
function setTime(e) {
    //get time now
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    //if min only has 1 digit, add a 0 in front
    if (min < 10) {
        min = "0" + min;
    }
    //if hour only has 1 digit, add a 0 in front
    if (hour < 10) {
        hour = "0" + hour;
    }
    var format = hour + ":" + min;
    console.log(format)
    console.log(formInputs.dateTIME.value)
    formInputs.dateTIME.value = format;
}
function formSubmit(e) {
    e.preventDefault();
    console.log(e)
    //check submitter
    if (e.submitter.defaultValue == "Cancel") {
        //close window
        dateMaker.style.display = 'none';
        toggleShow = false;
    } else if (e.submitter.defaultValue == "Add") {
        //add new countdown
        var name = formInputs.dateNAME.value;
        var date = formInputs.dateMMDDYYYY.value.split("-")
        var time = formInputs.dateTIME.value;
        var format = formInputs.dateFORMAT.value; //format will look like "DD/MM/YYYY"

        var dateFormated = []
        format.split("").forEach(function (char) {
            if (char == "D") {
                dateFormated.push(date[2])
            } else if (char == "M") {
                dateFormated.push(date[1])
            } else if (char == "Y") {
                dateFormated.push(date[0])
            }
        })
        dateFormated = dateFormated.join("/")
        console.log(dateFormated)
        makeNewCountdown(name, dateFormated, time);
        var json = {
            name: name,
            date: dateFormated,
            time: time,
            format: format,
            time: time,
            timeMade: Date.now()
        }
        rawData.push(json)
        console.log(json)
        console.log(rawData)


        console.log(JSON.stringify(json))
        console.log(JSON.stringify(rawData))

        //close window
        dateMaker.style.display = 'none';
        toggleShow = false;
    } else if (e.submitter.defaultValue == "Raw") {
        var raw = prompt("Please enter the raw data (It should be json!)");
        //format raw 
        raw = JSON.parse(raw);
        //if array else if object
        if (Array.isArray(raw)) {
            console.log("array")
        } else if (typeof (raw) === "object") {
            console.log("object")
        }
    }
}