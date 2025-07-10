// Connect to the socket.io server
const socket = io('http://localhost:8000');

// Get DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio notification for incoming messages
const audio = new Audio('massege_ting.mp3');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if (position === 'left') {
        audio.play();
    }



    // Scroll to the bottom when a new message appears
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Prompt user for their name and notify server
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// When a new user joins
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// When a message is received from the server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// When a user leaves the chat
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});

// When the message form is submitted
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});
