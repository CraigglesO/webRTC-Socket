"use strict";
const wrtc = require("wrtc");
const WebSocket = require("ws");
const buffer_1 = require("buffer");
const stream_1 = require("stream");
const MAX_REQUEST_LENGHT = 1024;
function wrtcConnect(host, port) {
    return new wrtcSocket(host, port);
}
exports.wrtcConnect = wrtcConnect;
function wrtcCreateServer(func) {
    return new wrtcServer(func);
}
exports.wrtcCreateServer = wrtcCreateServer;
class wrtcServer {
    constructor(func) {
        const self = this;
        self.wss = null;
        self.func = func;
    }
    initiate(port) {
        const self = this;
        self.wss = new WebSocket.Server({ port });
        self.wss.on('connection', (ws) => {
            ws = new wrtcIncomingSocket(ws);
            ws.on('connect', () => {
                self.func(ws);
            });
        });
    }
    broadcast(payload) {
        this.wss.clients.forEach((client) => {
            if (client.ready === true) {
                client.send(payload);
            }
        });
    }
    listen(port, cb) {
        this.initiate(port);
        if (cb)
            cb();
    }
}
class wrtcIncomingSocket extends stream_1.Duplex {
    constructor(ws) {
        super();
        const self = this;
        self.ready = false;
        self.ws = ws;
        self.host = '127.0.0.1';
        self.pc = new wrtc.RTCPeerConnection({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] }, { 'optional': [{ DtlsSrtpKeyAgreement: false }] });
        self.offer = null;
        self.answer = null;
        self.remoteReceived = false;
        self.dataChannelSettings = { 'reliable': { ordered: true, maxRetransmits: 0 } };
        self.pendingDataChannels = {};
        self.dataChannels = {};
        self.pendingCandidates = [];
        ws.on('message', (payload) => {
            let data = JSON.parse(payload);
            if ('offer' == data.type) {
                self.offer = new wrtc.RTCSessionDescription(data);
                self.pc.onsignalingstatechange = (event) => {
                    if (event.target)
                        self.emit("stateChange", event.target.signalingState);
                };
                self.pc.oniceconnectionstatechange = (event) => {
                    if (event.target)
                        self.emit("iceConnectionStateChange", event.target.iceConnectionState);
                };
                self.pc.onicegatheringstatechange = (event) => {
                    if (event.target)
                        self.emit("iceGatheringStateChange", event.target.iceGatheringState);
                };
                self.pc.onicecandidate = (candidate) => {
                    ws.send(JSON.stringify({ 'type': 'ice',
                        'sdp': { 'candidate': candidate.candidate, 'sdpMid': candidate.sdpMid, 'sdpMLineIndex': candidate.sdpMLineIndex }
                    }));
                };
                self.handleDataChannels();
            }
            else if ('ice' == data.type) {
                if (self.remoteReceived && data.sdp.candidate)
                    self.pc.addIceCandidate(new wrtc.RTCIceCandidate(data.sdp.candidate));
                else
                    self.pendingCandidates.push(data);
            }
        });
    }
    send(payload) {
        if (buffer_1.Buffer.isBuffer(payload))
            payload = new Uint8Array(payload);
        this.dataChannels['reliable'].send(payload);
    }
    _read() {
    }
    _write(payload, encoding, next) {
        next(null);
    }
    complete() {
        this.ready = true;
        this.emit('connect');
    }
    handleError(err) {
        throw err;
    }
    createAnswer() {
        const self = this;
        self.remoteReceived = true;
        self.pendingCandidates.forEach((candidate) => {
            if (candidate.sdp) {
                self.pc.addIceCandidate(new wrtc.RTCIceCandidate(candidate.sdp));
            }
        });
        self.pc.createAnswer(self.setLocalDesc.bind(self), self.handleError.bind(self));
    }
    ;
    setLocalDesc(desc) {
        const self = this;
        self.answer = desc;
        self.pc.setLocalDescription(desc, self.sendAnswer.bind(self), self.handleError.bind(self));
    }
    ;
    sendAnswer() {
        const self = this;
        self.ws.send(JSON.stringify(self.answer));
    }
    handleDataChannels() {
        const self = this;
        let labels = Object.keys(self.dataChannelSettings);
        self.pc.ondatachannel = (event) => {
            let channel = event.channel;
            let label = channel.label;
            self.pendingDataChannels[label] = channel;
            channel.binaryType = 'arraybuffer';
            channel.onopen = () => {
                self.dataChannels[label] = channel;
                delete self.pendingDataChannels[label];
                if (Object.keys(self.dataChannels).length === labels.length) {
                    self.complete();
                }
            };
            channel.onmessage = (event) => {
                let data;
                if (event.data instanceof ArrayBuffer)
                    data = new buffer_1.Buffer(event.data);
                else
                    data = event.data;
                self.emit('data', data);
            };
            channel.onclose = (event) => {
                this.emit('close', event);
            };
            channel.onerror = self.handleError;
        };
        self.setRemoteDesc();
    }
    setRemoteDesc() {
        const self = this;
        self.pc.setRemoteDescription(self.offer, self.createAnswer.bind(self), self.handleError.bind(self));
    }
}
class wrtcSocket extends stream_1.Duplex {
    constructor(host, port, ws) {
        super();
        const self = this;
        self.host = host;
        self.port = port;
        self.bridge = "ws://" + host + ":" + port.toString();
        self.RTCPeerConnection = wrtc.RTCPeerConnection;
        self.RTCSessionDescription = wrtc.RTCSessionDescription;
        self.RTCIceCandidate = wrtc.RTCIceCandidate;
        self.dataChannelSettings = { "reliable": { ordered: true, maxRetransmits: 10 } };
        self.pendingDataChannels = {};
        self.dataChannels = {};
        self.pendingCandidates = [];
        self.ws = (ws) ? ws : new WebSocket(self.bridge);
        self.pc = new self.RTCPeerConnection({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] }, { 'optional': [] });
        self.pc.onsignalingstatechange = (event) => {
            if (event.target)
                self.emit("stateChange", event.target.signalingState);
        };
        self.pc.oniceconnectionstatechange = (event) => {
            if (event.target)
                self.emit("iceConnectionStateChange", event.target.iceConnectionState);
        };
        self.pc.onicegatheringstatechange = (event) => {
            if (event.target)
                self.emit("iceGatheringStateChange", event.target.iceGatheringState);
        };
        self.pc.onicecandidate = (event) => {
            let candidate = event.candidate;
            if (!candidate)
                return;
            if (WebSocket.OPEN == self.ws.readyState) {
                self.ws.send(JSON.stringify({
                    'type': 'ice',
                    'sdp': { 'candidate': candidate.candidate, 'sdpMid': candidate.sdpMid, 'sdpMLineIndex': candidate.sdpMLineIndex }
                }));
            }
            else {
                self.pendingCandidates.push(candidate);
            }
        };
        self.createDataChannels();
    }
    send(payload) {
        if (buffer_1.Buffer.isBuffer(payload))
            payload = new Uint8Array(payload);
        this.dataChannels['reliable'].send(payload);
    }
    _read() {
    }
    _write(payload, encoding, next) {
        next(null);
    }
    handleError(err) {
        throw err;
    }
    ready() {
        this.emit('connect');
    }
    awaitingDataChannels() {
        this.emit('awaitingDataChannels');
    }
    createDataChannels() {
        const self = this;
        let labels = Object.keys(self.dataChannelSettings);
        labels.forEach((label) => {
            let channelOptions = self.dataChannelSettings[label];
            let channel = self.pendingDataChannels[label] = self.pc.createDataChannel(label, channelOptions);
            channel.binaryType = 'arraybuffer';
            channel.onopen = () => {
                self.dataChannels[label] = channel;
                delete self.pendingDataChannels[label];
                if (Object.keys(self.dataChannels).length === labels.length)
                    self.ready();
            };
            channel.onmessage = (event) => {
                let data;
                if (event.data instanceof ArrayBuffer)
                    data = new buffer_1.Buffer(event.data);
                else
                    data = event.data;
                self.emit('data', data);
            };
            channel.onclose = (event) => {
                this.emit('close', event);
            };
            channel.onerror = self.handleError;
        });
        self.pc.createOffer(self.setLocalDesc.bind(self), self.handleError.bind(self));
    }
    setLocalDesc(desc) {
        const self = this;
        self.pc.setLocalDescription(new self.RTCSessionDescription(desc), self.sendOffer.bind(self, desc), self.handleError);
    }
    sendOffer(offer) {
        const self = this;
        self.ws.onopen = () => {
            self.pendingCandidates.forEach((candidate) => {
                self.ws.send(JSON.stringify({
                    'type': 'ice',
                    'sdp': { 'candidate': candidate.candidate, 'sdpMid': candidate.sdpMid, 'sdpMLineIndex': candidate.sdpMLineIndex }
                }));
            });
            self.ws.send(JSON.stringify({ 'type': offer.type, 'sdp': offer.sdp }));
        };
        self.ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if ('answer' == data.type) {
                self.setRemoteDesc(data);
            }
            else if ('ice' == data.type) {
                if (data.sdp.candidate) {
                    let candidate = new self.RTCIceCandidate(data.sdp.candidate);
                    self.pc.addIceCandidate(candidate, self.handleAddIceCandidateSuccess.bind(self), self.handleAddIceCandidateError.bind(self));
                }
            }
        };
    }
    setRemoteDesc(desc) {
        this.pc.setRemoteDescription(new this.RTCSessionDescription(desc), this.awaitingDataChannels.bind(this), this.handleError.bind(this));
    }
    handleAddIceCandidateSuccess() { }
    handleAddIceCandidateError() { }
}
exports.wrtcSocket = wrtcSocket;
