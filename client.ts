import { wrtcConnect, WrtcSocket } from "./WebRTC-Socket";

let Socket = wrtcConnect("127.0.0.1", 9001);

Socket.on("connect", () => {
  console.log("we are connected");
  Socket.send("Hello Bridge");
});

Socket.on("data", (data) => {
  Socket.close();
});

Socket.pipe(process.stdout);
