const socket = io();


const messageForm = document.getElementById("message-sending"),chatBox = document.getElementById("message-chat-container");
let messageToSend = document.getElementById("message-to-send"),sendButton = document.getElementById("send-btn");
let roomMan = document.getElementById("room-strong");
var leave = document.getElementById("leave-btn");



//To take username and room from the login form 

var {username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true,
});

if(room == "" || room == null || room == " "){
    room = `Global${String.fromCodePoint(0x1F30D)}`;
}
roomMan.innerText = room;

//Function for adding message
let addMessage = (message) => {
    var messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerHTML = message;
    chatBox.append(messageBox);
    chatBox.scrollTop = chatBox.scrollHeight;
}

var today = new Date();

//When you're logged in the chat.
addMessage(`You joined the chat ! (${today.getHours()}h:${today.getMinutes()}mn)`);

//Displaying the message
socket.on("chat-message", data => {
    addMessage(`<h4>${data.username}</h4>${data.message}`);
})

//when you join a room
socket.emit("join-room", room)


socket.emit("new-user", username)

socket.on("user-connected", username => {
    addMessage(`${username} has joined the chat !`);
})

socket.on("user-disconnected", username => {
    addMessage(`${username} has left the chat !`);
})


//When you send a message 
messageForm.addEventListener("submit", event => {
    event.preventDefault();
    var message = messageToSend.value;
    if(message == "" || message == " "){
        return}
    else{
    addMessage(`<h4>You</h4>${message}`);
    socket.emit("send-chat-message",message);
    messageToSend.value = "";
    }
})

leave.addEventListener("click", () =>{
    location.href = "index.html";
})
