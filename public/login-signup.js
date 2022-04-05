console.log("[Login]: Loaded")
//Grab our IDed elements
main = document.getElementById('main');
loginForm = document.getElementById('loginForm');
signupForm = document.getElementById('signupForm');

//Add our Listeners
loginForm.addEventListener("submit", login);
signupForm.addEventListener("submit", signup);

//Start socket
var socket = io();

socket.on('connect', function () {
    console.log('[Login]: Connected to server');
});
//when socket sends login message, show login form
socket.on('login', (data) => {
    //set token in local storage
    localStorage.setItem('token', data.token);
    //reload page
    location.reload();
});
socket.on('token', (data) => {
    if (data.status) {
        console.log("[Login]: Token valid")
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        main.style.display = 'block';
    } else {
        console.log("[Login]: Token invalid")
        localStorage.setItem('token', null);
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        main.style.display = 'none';
    }
})

var token = localStorage.getItem('token')
//if no token
if (token == "" || token == null) {
    console.log('[Token]: no token')
    main.style.display = "none"
    loginForm.style.display = "block"
    signupForm.style.display = "none"
} else {
    console.log('[Token]: Token found, Checking validity')
    loginForm.style.display = "none"
    signupForm.style.display = "none"
    main.style.display = "none"
    //wait 1 second 
    setTimeout(() => {
        console.log('[Token]: Checking token')
        socket.emit('token', {
            token: token
        })
    }, 1000);
}

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