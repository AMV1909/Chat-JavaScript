$(() => {
    const socket = io();

    // Getting DOM elements from the interface
    const $messageForm = $("#message-form");
    const $messageBox = $("#message");
    const $chat = $("#chat");

    //Getting DOM elements from the nicknameForm
    const $nickForm = $("#nickForm");
    const $nickError = $("#nickError");
    const $nickname = $("#nickname");

    // Getting DOM elements from the users
    const $users = $("#usernames");

    // Events
    $nickForm.submit((e) => {
        e.preventDefault();
        
        if ($nickname.val().trim() !== "") {
            socket.emit("new user", $nickname.val(), (data) => {
                if (data) {
                    $("#nickWrap").hide();
                    $("#contentWrap").show();
                } else {
                    $nickError.html(`
                        <div class="alert alert-danger">
                            That username already exists.
                        </div>
                    `);
                }
                $nickname.val("");
            });
        } else {
            $nickError.html(`
                <div class="alert alert-danger">
                    Please type a username.
                </div>
            `);
        }
    });

    $messageForm.submit((e) => {
        e.preventDefault();
        socket.emit("send message", $messageBox.val(), (data) => {
            $chat.append(`<p class="alert alert-danger">${data}</p>`);
        });
        $messageBox.val("");
    });

    socket.on("new message", (data) => {
        $chat.append(`<b>${data.nick}</b>: ${data.msg}<br/>`);
        $chat.scrollTop($chat[0].scrollHeight);
    });

    socket.on("usernames", (data) => {
        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });

    socket.on("whisper", (data) => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    socket.on("load old msgs", (data) => {
        for (let i = 0; i < data.length; i++) {
            displayMsg(data[i]);
        }

        $chat.scrollTop($chat[0].scrollHeight);
    });

    function displayMsg(data) {
        $chat.append(`<b>${data.nick}</b>: ${data.msg}<br/>`);
    }
});
