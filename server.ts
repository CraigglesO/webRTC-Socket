import { wrtcCreateServer, WrtcSocket } from "./WebRTC-Socket";
import { Buffer } from "buffer";

let SocketServer = wrtcCreateServer((socket) => {

  console.log("we are connected");
  socket.send("Hello client\n");
  let x = Buffer.from("THIS IS A BUFFER");
  socket.send(x);

  socket.on("data", (payload) => {
    console.log("recieved: ", payload);
    socket.close();
    SocketServer.close();
  });

});

SocketServer.listen(9001);
