import * as test from "blue-tape";
import { wrtcCreateServer, wrtcConnect, WrtcSocket } from "../webRTC-Socket";


test("Test Typescript-Ready", (t) => {
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
  let clientSocket = wrtcConnect("127.0.0.1", 9001);

  clientSocket.on("connect", () => {
    clientSocket.send("Hello Server");
  });

  clientSocket.on("data", (data) => {
    t.equal(data, "Hello client");
    clientSocket.close();
  });

  setTimeout(() => {
    t.end();
  }, 4000);
});
