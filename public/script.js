const socket = io('http://localhost:3000');

const roomContainer = document.getElementById('room-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');

if(messageForm != null) {

    const name = prompt('what is your name?');
    appendMessage('you joined the chat');
    socket.emit('new-user', roomName, name);

    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const message = messageInput.value;
        socket.emit('send-chat-message', roomName, message);
        messageInput.value = '';
    })
}

socket.on('room-created', room => {
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`
    roomLink.innerText = 'join';
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
})

socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
})

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}