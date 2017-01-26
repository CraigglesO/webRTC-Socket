# webRTC-Socket [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

  [travis-image]: https://travis-ci.org/CraigglesO/webRTC-Socket.svg?branch=master
  [travis-url]: https://travis-ci.org/CraigglesO/webRTC-Socket
  [npm-image]: https://img.shields.io/npm/v/webrtc-socket.svg
  [npm-url]: https://npmjs.org/package/webrtc-socket
  [downloads-image]: https://img.shields.io/npm/dm/webrtc-socket.svg
  [downloads-url]: https://npmjs.org/package/webrtc-socket

  ### Uses Websockets to send WebRTC data to and from users

  The general purpose of this project was to simplify the use of the WebRTC protocol. If you've worked with node, you have probably really enjoyed the workings of TCP and UDP. Very easy setup and go.

  I decided to replicate the simplicity with WebRTC. This is mean for sending data (buffers and strings) mind you. Other libraries would be more beneficial for media streams.

  ## Install

  ``` typescript
  npm install webRTC-Socket
  ```

  ## Usage

  **Setup**
  ``` typescript
import { wrtcCreateServer, wrtcConnect, wrtcSocket } from "webRTC-Socket"

```

  **Server**
``` typescript

let SocketServer = wrtcCreateServer((socket) => {

  console.log('we are connected');
  socket.send('Hello client\n');
  let buf = Buffer.from('THIS IS A BUFFER');
  socket.send(buf);

  socket.on('data', (payload) => {
    console.log('recieved: ', payload);
  });

}).listen(9001);

  ```

  **Client**
``` typescript

let Socket = wrtcConnect('127.0.0.1', 9001);

Socket.on('connect', () => {
  console.log('we are connected');
  Socket.send('Hello Bridge');
});

Socket.pipe(process.stdout);
// OR:
socket.on('data', (payload) => {
  console.log(payload);
});

  ```

  ## ISC License (Open Source Initiative)

  ISC License (ISC)
  Copyright 2017 <CraigglesO>
  Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC")
  Copyright (c) 1995-2003 by Internet Software Consortium


  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
