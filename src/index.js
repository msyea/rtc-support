const cursorPng = require("./icons").cursor;
const Client = require("./client");

(async () => {
  const plugin1 = client => {
    console.log('To send a message use "chat `hello`" ');
    window.sendMessage = message => {
      console.log(`[You] ${message}`);
      client.send({ message });
    };
    window.chat = messageTpl => {
      console.log(`[You] ${messageTpl[0]}`);
      client.send({ message: messageTpl[0] });
    };
    const cursor = Object.assign(document.createElement("img"), {
      src: cursorPng
    });
    cursor.style.position = "absolute";
    cursor.style.height = "25px";
    cursor.style.width = "25px";
    document.body.appendChild(cursor);
    document.addEventListener("mousemove", evt => {
      client.send({
        type: "mousemove",
        clientX: evt.clientX,
        clientY: evt.clientY
      });
    });

    return payload => {
      if ("mousemove" === payload.type) {
        cursor.style.left = `${payload.clientX}px`;
        cursor.style.top = `${payload.clientY}px`;
        return true;
      }
    };
  };

  const client = new Client();
  client.addPlugin(plugin1);
  client.connect();
})();
