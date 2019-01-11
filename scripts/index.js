(async () => {
  const state = {
    initialised: false,
    activeDc: null
  };
  const rtcConfig = {'iceServers': [{'url': "stun:stun.gmx.net"}]}
  const pc1 = new RTCPeerConnection(rtcConfig);
  let dc1;
  pc1.addEventListener("icecandidate", async evt => {
    if (evt.candidate == null) {
      prompt(
        "Please share this token to your partner and click [OK].",
        btoa(JSON.stringify(pc1.localDescription))
      );
      const offer = prompt(
        "Please enter the token your partner shared with you and click [OK]."
      );
      const answerDesc = new RTCSessionDescription(JSON.parse(atob(offer)));
      await pc1.setRemoteDescription(answerDesc);
    }
  });
  pc1.addEventListener("message", console.log);
  const pc2 = new RTCPeerConnection(rtcConfig);
  let dc2;
  pc2.addEventListener("icecandidate", evt => {
    if (evt.candidate == null) {
      prompt(
        "Please share this token to your partner and click [OK].",
        btoa(JSON.stringify(pc2.localDescription))
      );
    }
  });
  pc2.addEventListener("message", console.log);
  pc2.addEventListener("datachannel", evt => {
    dc2 = evt.channel || evt;
    state.activeDc = dc2;
    dc2.addEventListener("open", () => console.log("dc2 open"));
    dc2.addEventListener("message", console.log);
    window.sendMessage = message => {
      dc2.send(JSON.stringify({ message }));
    };
  });
  const requestOrRespond = confirm(
    ["Welcome to P2P Bookmarklet!",
    "First of all you need to exchange tokens with your partner.",
    "Do you want to create a new token?",
    "Or click [Cancel] if someone sent you a token."].join("\n")
  );
  if (requestOrRespond) {
    dc1 = pc1.createDataChannel("test", { reliable: true });
    state.activeDc = dc1;
    dc1.addEventListener("open", () => console.log("dc1 open"));
    dc1.addEventListener("message", console.log);
    window.sendMessage = message => {
      dc1.send(JSON.stringify({ message }));
    };
    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
  } else {
    const offer = prompt("Please enter the token your partner shared with you and click [OK].");
    var offerDesc = new RTCSessionDescription(JSON.parse(atob(offer)));
    await pc2.setRemoteDescription(offerDesc);
    const answerDesc = await pc2.createAnswer();
    pc2.setLocalDescription(answerDesc);
  }
})();
