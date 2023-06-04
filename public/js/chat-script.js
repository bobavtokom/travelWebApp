const socket = io();

// Handle 'connect' event
socket.on('connect', () => {
  console.log('Connected to the server.');

  fetch('/messages')
    .then((response) => response.json())
    .then((messages) => {
      messages.forEach((message) => {
        appendMessage(`Server: ${message.content}`);
      });
    })
    .catch((error) => {
      console.error('Error retrieving messages:', error);
    });
  // Handle 'chat message' event
  socket.on('chat message', (message) => {
    appendMessage(message);
  });

  // Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
  });
});

// Handle form submission
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const messageInput = document.getElementById('input');
  const message = messageInput.value;
  socket.emit('chat message', message);
  messageInput.value = '';
  appendMessage(`You: ${message}`);
});
function appendMessage(message) {
  const messages = document.getElementById('messages');
  const li = document.createElement('li');
  li.textContent = message;
  messages.appendChild(li);
}


var chatboxToggle = document.querySelector('.chatbox-toggle')
var chatboxMessage = document.querySelector('#live-chat')

chatboxToggle.addEventListener('click', function () {
  console.log('hi');
  chatboxMessage.classList.toggle('show-chat')
});