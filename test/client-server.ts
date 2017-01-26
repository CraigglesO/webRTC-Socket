import * as test from "blue-tape";
import { wrtcCreateServer, wrtcConnect, WrtcSocket } from "../webRTC-Socket";


test("Test Client and Server talking", (t) => {
  t.plan(2);

  // Server
  let SocketServer = wrtcCreateServer((socket) => {

    socket.send("Hello client");

    socket.on("data", (data) => {
      t.equal(data, "Hello Server");
      socket.close();
      SocketServer.close();
    });

  });

  SocketServer.listen(9001);

  // Client
  let clientSocket = wrtcConnect(9001, "127.0.0.1");

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
