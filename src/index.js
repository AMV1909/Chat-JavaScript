import { Server } from "socket.io";
import http from "http";

import "./database/db.js";
import { app } from "./app.js";
import { sockets } from "./sockets.js";

const server = http.createServer(app);
const io = new Server(server);

sockets(io);

// Start the server
server.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});
