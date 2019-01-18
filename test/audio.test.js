const { Builder, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const assert = require("assert");

describe("audio", () => {
  let driver;
  before(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
        .addArguments('use-fake-ui-for-media-stream')
        .addArguments('use-fake-device-for-media-stream')
      )
      .usingServer("http://selenium:4444/wd/hub")
      .build();
    await driver.get("https://app.local:8080/test.html");
    return driver;
  });
  describe("navigator.mediaDevices.getUserMedia", () => {
    it.only("should prompt something", async () => {
      const output = await driver.executeAsyncScript(async (callback) => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
          })
          const audio = new Audio();
          audio.srcObject = stream
          callback(stream.getTracks())
        } catch (err) {
          callback({
            error: true,
            name: err.name,
            message: err.message
          })
        }
      });
      console.log(output)
    });
  });
});
