const dom = {
    loginForm: document.getElementById('welcome-form'),
    messagesSection: document.getElementById('messages-section'),
    messagesList: document.getElementById('messages-list'),
    addMessageForm: document.getElementById('add-messages-form'),
    userNameInput: document.getElementById('username'),
    messageContentInput: document.getElementById('message-content')
};

let userName = "";
dom.messageContentInput.setAttribute('autoComplete', 'off');

const socket = io();
socket.on('message', (event) => addMessage(event.author, event.content));
socket.on('newUser', (event) => {
    if (event.name !== userName) {
        addMessage('ChatBot', event.name + ' has joined the conversation!');
    }
});

const login = (event) => {
    event.preventDefault();

    const username = dom.userNameInput.value.trim();
    if(username) {
        userName = username;
        dom.loginForm.classList.remove('show');
        dom.messagesSection.classList.add('show');
        console.log('Login success');
        socket.emit('join', userName)
    } else {
        alert('Username cannot be empty.');
    }
};

dom.loginForm.addEventListener('submit', login);

const sendMessage = (event) => {
    event.preventDefault();

    const message = dom.messageContentInput.value;

    if(message === ""){
        alert('Message cant be empty');
    } else {
        addMessage(userName, message);
        socket.emit('message', { author: userName, content: message })
        dom.messageContentInput.value = "";
    }
};

dom.addMessageForm.addEventListener('submit', sendMessage);

const addMessage = (author, content) => {

    const message = document.createElement('li');

    message.classList.add('message', 'message--received');

    if(author === userName) {
        message.classList.add('message--self');
        author = 'You';
    }
    if (author === 'ChatBot') {
        message.classList.add('message--bot');
    }

    const authorElement = document.createElement('h3');
    authorElement.classList.add('message__author');
    authorElement.textContent = author;

    const contentElement = document.createElement('div');
    contentElement.classList.add('message__content');
    contentElement.textContent = content;

    message.appendChild(authorElement);
    message.appendChild(contentElement);

    dom.messagesList.appendChild(message);
};
