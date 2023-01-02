const socket = io();

// Getting DOM elements from the interface
const messageForm = document.getElementById("message-form");
const messageBox = document.getElementById("message");
const chat = document.getElementById("chat");

//Getting DOM elements from the nicknameForm
const nickForm = document.getElementById("nickForm");
const nickError = document.getElementById("nickError");
const nickname = document.getElementById("nickname");

// Getting DOM elements from the users
const users = document.getElementById("usernames");

// Events
nickForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (nickname.value.trim() !== "") {
        socket.emit("new user", nickname.value, (data) => {
            if (data) {
                document.getElementById("nickWrap").style.display = "none";
                document.getElementById("contentWrap").style.display = "block";
            } else {
                nickError.innerHTML = `
                    <div class="alert alert-danger">
                        That username already exists.
                    </div>
                `;
            }
            nickname.value = "";
        });
    } else {
        nickError.innerHTML = `
            <div class="alert alert-danger">
                Please type a username.
            </div>
        `;
    }
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("send message", messageBox.value, (data) => {
        chat.innerHTML += `<p class="alert alert-danger">${data}</p>`;
    });
    messageBox.value = "";
});

socket.on("new message", (data) => {
    chat.innerHTML += `<b>${data.nick}</b>: ${data.msg}<br/>`;
});

socket.on("usernames", (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
    }
    users.innerHTML = html;
});

socket.on("whisper", (data) => {
    chat.innerHTML += `<p class="alert alert-success">${data.msg}</p>`;
});

socket.on("load old msgs", (docs) => {
    for (let i = 0; i < docs.length; i++) {
        displayMsg(docs[i]);
    }
});

socket.on("user left", (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
    }
    users.innerHTML = html;
});

function displayMsg(data) {
    chat.innerHTML += `<b>${data.nick}</b>: ${data.msg}<br/>`;
}