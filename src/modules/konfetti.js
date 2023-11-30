class KonfettiItem {
  constructor (canvas) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height - canvas.height
    this.speed = Math.random() * 3 + 1
    this.rotation = Math.random() * 360
    const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'white']
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.size = Math.random() * 10 + 5
  }
}

export class Konfetti {
  static pat () {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const konfettiCount = 100
    const konfetti = []

    for (let i = 0; i < konfettiCount; i++) {
      konfetti.push(new KonfettiItem(canvas))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      konfetti.forEach(k => {
        ctx.beginPath()
        ctx.arc(k.x, k.y, k.size, 0, 2 * Math.PI)
        ctx.fillStyle = k.color
        ctx.fill()
        ctx.closePath()

        k.y += k.speed
        k.x += Math.sin(k.rotation * Math.PI / 180) * 2

        // Konfetti am unteren Rand wieder nach oben setzen
        if (k.y > canvas.height) {
          k.y = -10
          k.x = Math.random() * canvas.width
        }
      })
      requestAnimationFrame(draw)
    }
    draw()
  };
}
