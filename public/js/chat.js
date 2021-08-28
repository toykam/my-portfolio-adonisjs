const socket = io()


socket.on('reply', (data) => {
    // console.log(data)
    addToMessage(data)
})

// console.log('hello')

var startChatBtn = document.getElementById('start-chat-btn')
var userName = document.getElementById('user-name-input')
var chatContent = document.getElementById('chat-content')
var chatMessageInput = document.getElementById('chat-message-input')
var sendMessageBtn = document.getElementById('send-message-btn')

chatContent.scrollTop = chatContent.offsetHeight

// startChatBtn.addEventListener('click', () => {
//     // alert(userName.value)
// })

sendMessageBtn.addEventListener('click', () => {
    var message = {
        message: chatMessageInput.value,
        sender: document.getElementById('user-name').value
    };

    socket.emit('send-message', message)
    fetch('/contact/save-chat', {
        method: "POST",
        body: message
    }).then((res) => {
        console.log(res)
        addToMessage(message)
    }).catch(() => {
        alert('An error occurred')
    })
})


function addToMessage(message) {
    var messageHtml = `
    <div class="container ${message.sender == 'bot'? '' : 'darker'}">
        <img src="https://www.w3schools.com/w3images/bandmember.jpg" alt="Avatar">
        <p>${message.message}</p>
        <span class="time-right">11:00</span>
    </div>
    `

    chatContent.append(messageHtml)
    chatContent.scrollTop = chatContent.offsetHeight
}

// console.log(document.cookie)