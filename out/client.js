"use strict";
const WebRTC_Socket_1 = require("./WebRTC-Socket");
let Socket = WebRTC_Socket_1.wrtcConnect("127.0.0.1", 9001);
Socket.on("connect", () => {
    console.log("we are connected");
    Socket.send("Hello Bridge");
});
Socket.on("data", (data) => {
    Socket.close();
});
Socket.pipe(process.stdout);
