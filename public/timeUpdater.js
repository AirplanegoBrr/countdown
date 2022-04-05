//This file controls the time updater AKA the countdown
countdowns = document.getElementById('countdowns');

setInterval(()=>{
    var data = localStorage.getItem('data');
    data = JSON.parse(data);
    console.log("[Updater]: ",data);
    for (i in data){
        var de = data[i]
        var element = document.getElementById(data[i].id);
        //if there is no element, create one
        if (!element) {
            element = document.createElement('div');
            element.id = data[i].id;
            element.className = "countdown";
            countdowns.appendChild(element);
        }
        var dateOfEnd = Date.parse(de.date + " " + de.time)
        var now = new Date()
        var timeLeft = dateOfEnd - now
        //convert timeLeft to days, hours, minutes, seconds
        var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        element.innerHTML = `<h1>${de.name}</h1><h2>${de.date} at</h2><h2>${de.time}</h2><h2>${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds</h2><button onclick="remove2(${de.id})">Remove</button>`
    }

}, 1500);