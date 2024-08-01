const express = require('express');
const path = require('path');
const socket =  require('socket.io');

const app = express();
const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
const io = socket(server);

const messages = [];
const users = [];

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  });

  io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.on('join', (name) => {
        console.log('Oh, I\'ve got something from ' + socket.id)
        users.push({name: name, id: socket.id});
        console.log("Users table:", users);
        socket.broadcast.emit('newUser', { name });
    });

    socket.on('message', (message) => {
         console.log('Oh, I\'ve got something from ' + socket.id)
         messages.push(message); 
         socket.broadcast.emit('message', message);
    });



    socket.on('disconnect', () =>{
        const userIndex = users.findIndex(user => user.id === socket.id);
        if(userIndex !== -1) {
            users.splice(userIndex, 1);
            console.log(users);
        }
    });

    socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
    console.log('I\'ve added a listener on message and disconnect events \n');
  });