import { wrtcCreateServer, WrtcSocket } from "./WebRTC-Socket";
import { Buffer } from "buffer";

let SocketServer = wrtcCreateServer((socket) => {

  console.log(socket.remoteAddress);
  console.log(socket.remotePort);
  console.log("we are connected");
  socket.send("Hello client\n");
  let x = Buffer.from("THIS IS A BUFFER");
  socket.send(x);

  socket.on("data", (payload) => {
    if (Buffer.isBuffer(payload))
      payload = payload.toString();
    console.log("recieved: ", payload);
  });

});

SocketServer.listen(9001);
