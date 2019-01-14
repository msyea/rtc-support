const cursorPng = require("./icons").cursor;

(async () => {
  const state = {
    initialised: false,
    activeDc: null
  };
  let cursor;
  const setupPlugins = () => {
    console.log('To send a message use "chat `hello`" ');
    window.sendMessage = message => {
      console.log(`[You] ${message}`);
      state.activeDc.send(JSON.stringify({ message }));
    };
    window.chat = messageTpl => {
      console.log(`[You] ${messageTpl[0]}`);
      state.activeDc.send(JSON.stringify({ message: messageTpl[0] }));
    };
    cursor = Object.assign(document.createElement("img"), {
      src: cursorPng
    });
    cursor.style.position = "absolute";
    cursor.style.height = "25px";
    cursor.style.width = "25px";
    document.body.appendChild(cursor);
    document.addEventListener("mousemove", evt => {
      state.activeDc.send(
        JSON.stringify({
          type: "mousemove",
          clientX: evt.clientX,
          clientY: evt.clientY
        })
      );
    });
  };
  
  const encode = str => {
    str = btoa(JSON.stringify(str))
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  const decode = str => {
    str = str.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * str.length) % 4);
    return JSON.parse(atob(str))
  }

  const onMessage = evt => {
    const payload = JSON.parse(evt.data);
    if ("mousemove" === payload.type) {
      cursor.style.left = `${payload.clientX}px`;
      cursor.style.top = `${payload.clientY}px`;
    } else if (payload.message) {
      console.log(`[Partner] ${payload.message}`);
    } else {
      console.log(evt);
    }
  };

  const rtcConfig = { iceServers: [{ url: "stun:stun.gmx.net" }] };
  const pc1 = new RTCPeerConnection(rtcConfig);
  let dc1;
  pc1.addEventListener("icecandidate", async evt => {
    if (evt.candidate == null) {
      prompt(
        "Please share this token to your partner and click [OK].",
        encode(pc1.localDescription)
      );
      const offer = prompt(
        "Please enter the token your partner shared with you and click [OK]."
      );
      const answerDesc = new RTCSessionDescription(decode(offer));
      await pc1.setRemoteDescription(answerDesc);
    }
  });
  const pc2 = new RTCPeerConnection(rtcConfig);
  let dc2;
  pc2.addEventListener("icecandidate", evt => {
    if (evt.candidate == null) {
      prompt(
        "Please share this token to your partner and click [OK].",
        encode(pc2.localDescription)
      );
    }
  });
  pc2.addEventListener("datachannel", evt => {
    dc2 = evt.channel || evt;
    state.activeDc = dc2;
    dc2.addEventListener("open", () => {
      console.log("dc2 open");
      setupPlugins();
    });
    dc2.addEventListener("message", onMessage);
  });
  const requestOrRespond = confirm(
    [
      "Welcome to P2P Bookmarklet!",
      "First of all you need to exchange tokens with your partner.",
      "Do you want to create a new token?",
      "Or click [Cancel] if someone sent you a token."
    ].join("\n")
  );
  if (requestOrRespond) {
    dc1 = pc1.createDataChannel("test", { reliable: true });
    state.activeDc = dc1;
    dc1.addEventListener("open", () => {
      console.log("dc1 open");
      setupPlugins();
    });
    dc1.addEventListener("message", onMessage);
    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
  } else {
    const offer = prompt(
      "Please enter the token your partner shared with you and click [OK]."
    );
    var offerDesc = new RTCSessionDescription(decode(offer));
    await pc2.setRemoteDescription(offerDesc);
    const answerDesc = await pc2.createAnswer();
    pc2.setLocalDescription(answerDesc);
  }
})();
