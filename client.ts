import { wrtcConnect, WrtcSocket } from "./WebRTC-Socket";

let Socket = wrtcConnect("127.0.0.1", 9001);

Socket.on("connect", () => {
  console.log(Socket.remoteAddress);
  console.log(Socket.remotePort);
  console.log("we are connected");
  Socket.send("Hello Bridge");
});

Socket.pipe(process.stdout);

process.stdin.pipe(Socket);
