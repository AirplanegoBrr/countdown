const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var tempData = require('./data.json');
if (tempData == null) {
    tempData = {
        users:[]
    }
} else {
    if (tempData.users == null) {
        tempData.users = [];
    }
}

//save data
async function saveData() {
    fs.writeFile('./data.json', JSON.stringify(tempData), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

//view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('countdown');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('signup', (data) => {
        console.log(data);
        //make a random token
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        //add user to tempData
        tempData.users.push({
            username: data.username,
            password: data.password,
            token: token
        });
        //send back the token
        socket.emit('login', token);
        //save data
        saveData();
    });
    socket.on('login', (data) => {
        console.log(data);
        //check if user exists
        var user = tempData.users.find(user => user.username === data.username);
        if(user){
            //check if password is correct
            if(user.password === data.password){
                //send token
                socket.emit('login', {
                    token: user.token
                });
            }
        }
    });
    socket.on('token', (data)=>{
        console.log(data);
        //check if token is valid
        var user = tempData.users.find(user => user.token === data.token);
        if(user){
            //send user data
            socket.emit('token', {
                status: true
            });
        } else {
            socket.emit('token', {
                status: false
            });
        }
    })
});

server.listen(3333, () => {
    console.log('listening on *:3000');
});