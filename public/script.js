//Grabing elements
main = document.getElementById('main');
loginForm = document.getElementById('loginForm');
signupForm = document.getElementById('signupForm');

//Main
add = document.getElementById('add');
countdowns = document.getElementById('countdowns');
//Main end

//Date maker
dateMaker = document.getElementById('dateMaker');
form = document.getElementById('abc');

//Date end

//Other
formInputs = form.elements;
var toggleShow = false
var rawData = []
var storedData = JSON.parse(localStorage.getItem('data'))
//Other end

console.log("[Main]: Grabbed all elements")

//Make sure we dont show the maker
dateMaker.style.display = 'none'

//get stored data
if (storedData) {
    rawData = storedData
}

//Add our Listeners
form.addEventListener("submit", formSubmit);
add.addEventListener("click", addNew);
document.getElementById("setTime").addEventListener("click", setTime);

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
function remove2(e){
    //remove e element
    e.remove()
    rawData.splice(e.id, 1)
    localStorage.setItem('data', JSON.stringify(rawData))
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
        var format = "MDY"

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
        var randomTokenID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var json = {
            name: name,
            date: dateFormated,
            dateRaw: date,
            time: time,
            timeMade: Date.now(),
            id: randomTokenID
        }
        rawData.push(json)
        console.log(json)
        console.log(rawData)


        console.log(JSON.stringify(json))
        console.log(JSON.stringify(rawData))
        localStorage.setItem('data', JSON.stringify(rawData))

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