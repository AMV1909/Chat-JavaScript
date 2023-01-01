import chatSchema from "./models/Chat.js";

export const sockets = (io) => {
    let users = {};

    io.on("connection", (socket) => {
        console.log("New connection", socket.id);

        socket.on("new user", async (data, callback) => {
            await chatSchema
                .find()
                .then((data) => {
                    socket.emit("load old msgs", data);
                })
                .catch((err) => console.log(err));

            if (data in users) {
                callback(false);
            } else {
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateusers();
            }
        });

        socket.on("send message", async (data, callback) => {
            var msg = data.trim();

            if (msg.substr(0, 3) === "/w ") {
                msg = msg.substr(3);
                const index = msg.indexOf(" ");
                if (index !== -1) {
                    var name = msg.substr(0, index);
                    var msg = msg.substr(index + 1);
                    if (name in users) {
                        users[name].emit("whisper", {
                            msg,
                            nick: socket.nickname,
                        });
                    } else {
                        callback("Error! Please enter a valid user.");
                    }
                } else {
                    callback("Error! Please enter your message.");
                }
            } else {
                const newMsg = new chatSchema({ msg, nick: socket.nickname });

                await newMsg
                    .save()
                    .then(() => console.log("Message saved"))
                    .catch((err) => console.log(err));

                io.sockets.emit("new message", {
                    msg,
                    nick: socket.nickname,
                });
            }
        });

        socket.on("disconnect", () => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateusers();
        });

        const updateusers = () => {
            io.sockets.emit("usernames", Object.keys(users));
        };
    });
};
