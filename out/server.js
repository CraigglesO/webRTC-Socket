"use strict";
const WebRTC_Socket_1 = require("./WebRTC-Socket");
const buffer_1 = require("buffer");
let SocketServer = WebRTC_Socket_1.wrtcCreateServer((socket) => {
    console.log("we are connected");
    socket.send("Hello client\n");
    let x = buffer_1.Buffer.from("THIS IS A BUFFER");
    socket.send(x);
    socket.on("data", (payload) => {
        console.log("recieved: ", payload);
        socket.close();
        SocketServer.close();
    });
});
SocketServer.listen(9001);
