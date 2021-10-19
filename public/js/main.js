const socket = io();
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const chatForm = document.getElementById('chat-form')

//get username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//To join a room
socket.emit('joinroom', { username, room })

//get room users and room info
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room),
        outputUsers(users)
})

//output any message by server
socket.on('message', message => {
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})

//to send message to server
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value

    //emitting message to server
    socket.emit('chatMessage', msg)

    //clear Input
    e.target.elements.msg.value = ''

})



function outputMessage(msg) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
                     ${msg.text}
                     </p>`

    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room
}


function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}
