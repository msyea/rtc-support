const { encodeToken, decodeToken } = require("./utils");

module.exports = class Client {
  constructor(config) {
    const rtcConfig = {}; // { iceServers: [{ url: "stun:stun.gmx.net" }] };
    this.pc1 = new RTCPeerConnection(rtcConfig);
    this.dc1;
    this.pc2 = new RTCPeerConnection(rtcConfig);
    this.dc2;
    this.addPcEvents();
    this.state = {
      activeDc: null
    };
    this.plugins = [];
  }
  addPcEvents() {
    this.pc1.addEventListener(
      "icecandidate",
      this.onPc1IceCandidate.bind(this)
    );
    this.pc2.addEventListener(
      "icecandidate",
      this.onPc2IceCandidate.bind(this)
    );
    this.pc2.addEventListener("datachannel", this.onPc2DataChannel.bind(this));
  }
  async onPc1IceCandidate(evt) {
    if (evt.candidate == null) {
      prompt(
        "Please share this token to your partner and click [OK].",
        encodeToken(this.pc1.localDescription)
      );
      const answer = prompt(
        "Please enter the token your partner shared with you and click [OK]."
      );
      const answerDesc = new RTCSessionDescription(decodeToken(answer));
      await this.pc1.setRemoteDescription(answerDesc);
    }
  }
  async onPc2IceCandidate(evt) {
    if (evt.candidate == null) {
      prompt(
        "Please share this token to your partner and click [OK].",
        encodeToken(this.pc2.localDescription)
      );
    }
  }
  onPc2DataChannel(evt) {
    this.dc2 = evt.channel || evt;
    this.state.activeDc = this.dc2;
    this.dc2.addEventListener("open", this.onChannelOpen.bind(this));
    this.dc2.addEventListener("message", this.onMessage.bind(this));
  }
  onMessage(evt) {
    const payload = JSON.parse(evt.data);
    // call each plugin with incoming message
    const plugins = this.plugins.filter(plugin => plugin(payload));
    if (payload.message) {
      console.log(`[Partner] ${payload.message}`);
    } else if (!plugins.length) {
      // only 🤮 evt if it's not picked up by plugin
      console.log(evt);
    }
  }
  onChannelOpen() {
    console.log("channel open");
    this.setupPlugins();
  }
  async connect() {
    const requestOrRespond = confirm(
      [
        "Welcome to P2P Bookmarklet!",
        "First of all you need to exchange tokens with your partner.",
        "Do you want to create a new token?",
        "Or click [Cancel] if someone sent you a token."
      ].join("\n")
    );
    if (requestOrRespond) {
      await this.request();
    } else {
      await this.respond();
    }
  }
  async request() {
    this.dc1 = this.pc1.createDataChannel("test", { reliable: true });
    this.state.activeDc = this.dc1;
    this.dc1.addEventListener("open", this.onChannelOpen.bind(this));
    this.dc1.addEventListener("message", this.onMessage.bind(this));
    const offer = await this.pc1.createOffer();
    await this.pc1.setLocalDescription(offer);
  }
  async respond() {
    const offer = prompt(
      "Please enter the token your partner shared with you and click [OK]."
    );
    var offerDesc = new RTCSessionDescription(decodeToken(offer));
    await this.pc2.setRemoteDescription(offerDesc);
    const answerDesc = await this.pc2.createAnswer();
    this.pc2.setLocalDescription(answerDesc);
  }
  setupPlugins() {
    // initialise each plugin with client
    this.plugins = this.plugins.map(plugin => plugin(this));
  }
  addPlugin(plugin) {
    this.plugins.push(plugin);
  }
  send(data) {
    this.state.activeDc.send(JSON.stringify(data));
  }
};
