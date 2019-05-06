const cursorPng = require('./icons').cursor
const Client = require('./client')

;

(async () => {
  const mousePlugin = client => {
    console.log('To send a message use "chat `hello`" ')
    window.sendMessage = message => {
      console.log(`[You] ${message}`)
      client.send({ message })
    }
    window.chat = messageTpl => {
      console.log(`[You] ${messageTpl[0]}`)
      client.send({ message: messageTpl[0] })
    }
    const cursor = Object.assign(document.createElement('img'), {
      src: cursorPng,
    })
    cursor.style.position = 'absolute'
    cursor.style.height = '25px'
    cursor.style.width = '25px'
    document.body.appendChild(cursor)
    document.addEventListener('mousemove', evt => {
      client.send({
        type: 'mousemove',
        clientX: evt.clientX,
        clientY: evt.clientY,
      })
    })

    return payload => {
      if (payload.type === 'mousemove') {
        cursor.style.left = `${payload.clientX}px`
        cursor.style.top = `${payload.clientY}px`
        return true
      }
    }
  }

  const audioPlugin = async client => {
    const audio = new Audio()
    audio.autoplay = true
    client.pc.addEventListener('track', evt => {
      console.log('ontrack', evt)
      if (!audio.srcObject) {
        console.log(evt.streams[0])
        audio.srcObject = evt.streams[0]
      }
    })

    if (client.state.mode === 'MODE_REQUESTOR') {
      console.log('setting up audio')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        // video: true
      })

      stream.getTracks().forEach(track => client.pc.addTrack(track, stream))
      console.log(stream.getTracks())
    }

    return () => false
  }

  const client = new Client()
  client.addPlugin(mousePlugin)
  client.addPlugin(audioPlugin)
  client.connect()
})()
