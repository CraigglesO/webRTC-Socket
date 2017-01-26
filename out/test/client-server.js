"use strict";
const test = require("blue-tape");
const webRTC_Socket_1 = require("../webRTC-Socket");
test("Test Typescript-Ready", (t) => {
    t.plan(2);
    let SocketServer = webRTC_Socket_1.wrtcCreateServer((socket) => {
        socket.send("Hello client");
        socket.on("data", (data) => {
            t.equal(data, "Hello Server");
            socket.close();
            SocketServer.close();
        });
    });
    SocketServer.listen(4001);
    let clientSocket = webRTC_Socket_1.wrtcConnect("127.0.0.1", 4001);
    clientSocket.on("connect", () => {
        clientSocket.send("Hello Server");
    });
    clientSocket.on("data", (data) => {
        t.equal(data, "Hello client");
        clientSocket.close();
    });
    setTimeout(() => {
        t.end();
    }, 3500);
});
