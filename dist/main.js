!(function(A) {
  const g = {}
  function C(e) {
    if (g[e]) return g[e].exports
    const B = (g[e] = { i: e, l: !1, exports: {} })
    return A[e].call(B.exports, B, B.exports, C), (B.l = !0), B.exports
  }
  ;(C.m = A),
    (C.c = g),
    (C.d = function(A, g, e) {
      C.o(A, g) || Object.defineProperty(A, g, { enumerable: !0, get: e })
    }),
    (C.r = function(A) {
      typeof Symbol !== 'undefined' &&
        Symbol.toStringTag &&
        Object.defineProperty(A, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(A, '__esModule', { value: !0 })
    }),
    (C.t = function(A, g) {
      if ((1 & g && (A = C(A)), 8 & g)) return A
      if (4 & g && typeof A === 'object' && A && A.__esModule) return A
      const e = Object.create(null)
      if (
        (C.r(e),
        Object.defineProperty(e, 'default', { enumerable: !0, value: A }),
        2 & g && typeof A !== 'string')
      )
        for (const B in A)
          C.d(
            e,
            B,
            function(g) {
              return A[g]
            }.bind(null, B),
          )
      return e
    }),
    (C.n = function(A) {
      const g =
        A && A.__esModule
          ? function() {
              return A.default
            }
          : function() {
              return A
            }
      return C.d(g, 'a', g), g
    }),
    (C.o = function(A, g) {
      return Object.prototype.hasOwnProperty.call(A, g)
    }),
    (C.p = ''),
    C((C.s = 0))
})([
  function(A, g, C) {
    const e = C(1).cursor

    const B = C(2)
    ;(async () => {
      const A = new B()
      A.addPlugin(A => {
        console.log('To send a message use "chat `hello`" '),
          (window.sendMessage = g => {
            console.log(`[You] ${g}`), A.send({ message: g })
          }),
          (window.chat = g => {
            console.log(`[You] ${g[0]}`), A.send({ message: g[0] })
          })
        const g = Object.assign(document.createElement('img'), { src: e })
        return (
          (g.style.position = 'absolute'),
          (g.style.height = '25px'),
          (g.style.width = '25px'),
          document.body.appendChild(g),
          document.addEventListener('mousemove', g => {
            A.send({
              type: 'mousemove',
              clientX: g.clientX,
              clientY: g.clientY,
            })
          }),
          A => {
            if (A.type === 'mousemove')
              return (
                (g.style.left = `${A.clientX}px`),
                (g.style.top = `${A.clientY}px`),
                !0
              )
          }
        )
      }),
        A.addPlugin(async A => {
          const g = await navigator.mediaDevices.getUserMedia({ audio: !0 })

          const C = new Audio()
          return (
            (C.autoplay = !0),
            A.pc.addEventListener('track', A => {
              console.log('ontrack', A),
                C.srcObject ||
                  (console.log(A.streams[0]), (C.srcObject = A.streams[0]))
            }),
            g.getTracks().forEach(C => A.pc.addTrack(C, g)),
            () => !1
          )
        }),
        A.connect()
    })()
  },
  function(A) {
    A.exports = {
      cursor:
        'data:image/png;base64,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',
    }
  },
  function(A, g, C) {
    const { encodeToken: e, decodeToken: B } = C(3)
    A.exports = class {
      constructor(A) {
        ;(this.pc = new RTCPeerConnection({})),
          this.dc,
          this.addPcEvents(),
          (this.state = { mode: null }),
          (this.plugins = [])
      }

      addPcEvents() {
        this.pc.addEventListener(
          'icecandidate',
          this.onIceCandidate.bind(this),
        ),
          this.pc.addEventListener('datachannel', this.onDataChannel.bind(this))
      }

      async onIceCandidate(A) {
        A.candidate == null &&
          (prompt(
            'Please share this token to your partner and click [OK].',
            e(this.pc.localDescription),
          ),
          this.state.mode === 'MODE_REQUESTOR' && (await this.receiveToken()))
      }

      onDataChannel(A) {
        this.state.mode === 'MODE_RESPONDER' &&
          ((this.dc = A.channel || A),
          console.log('seting dc', this.state.mode, 'dc'),
          this.dc.addEventListener('open', this.onChannelOpen.bind(this)),
          this.dc.addEventListener('message', this.onMessage.bind(this)))
      }

      onMessage(A) {
        const g = JSON.parse(A.data)

        const C = this.plugins.filter(A => A(g))
        g.message
          ? console.log(`[Partner] ${g.message}`)
          : C.length || console.log(A)
      }

      onChannelOpen() {
        console.log('channel open'), this.setupPlugins(), this.setupAudio()
      }

      async connect() {
        confirm(
          [
            'Welcome to P2P Bookmarklet!',
            'First of all you need to exchange tokens with your partner.',
            'Do you want to create a new token?',
            'Or click [Cancel] if someone sent you a token.',
          ].join('\n'),
        )
          ? await this.request()
          : await this.respond()
      }

      async request() {
        ;(this.state.mode = 'MODE_REQUESTOR'),
          (this.dc = this.pc.createDataChannel('test', { reliable: !0 })),
          console.log('seting dc', this.state.mode, 'dc'),
          this.dc.addEventListener('open', this.onChannelOpen.bind(this)),
          this.dc.addEventListener('message', this.onMessage.bind(this))
        const A = await this.pc.createOffer()
        await this.pc.setLocalDescription(A)
      }

      async respond() {
        ;(this.state.mode = 'MODE_RESPONDER'), await this.receiveToken()
        const A = await this.pc.createAnswer()
        this.pc.setLocalDescription(A)
      }

      async receiveToken() {
        const A = prompt(
          'Please enter the token your partner shared with you and click [OK].',
        )

        const g = new RTCSessionDescription(B(A))
        await this.pc.setRemoteDescription(g)
      }

      async setupPlugins() {
        this.plugins = await Promise.all(this.plugins.map(A => A(this)))
      }

      addPlugin(A) {
        this.plugins.push(A)
      }

      send(A) {
        this.dc.send(JSON.stringify(A))
      }

      async setupAudio() {
        console.log(this.state.mode)
        const A = await navigator.mediaDevices.getUserMedia({ audio: !0 })
        A.getTracks().forEach(g => this.pc.addTrack(g, A))
      }
    }
  },
  function(A, g) {
    A.exports = {
      encodeToken: A => {
        return btoa(JSON.stringify(A))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '')
      },
      decodeToken: A => (
        (A =
          A.replace(/\-/g, '+').replace(/_/g, '/') +
          '=='.substring(0, (3 * A.length) % 4)),
        JSON.parse(atob(A))
      ),
    }
  },
])
