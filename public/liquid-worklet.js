registerPaint('liquid-background', class {
  static get inputProperties() {
    return ['--fluid-time'];
  }

  paint(ctx, geom, props) {
    const { width: w, height: h } = geom;
    const time = parseFloat(props.get('--fluid-time')) || 0;
    const centerX = w / 2;
    const centerY = h / 2;

    // Rumus Noise Anda
    const fluidNoise = (x, y, z) => {
      const n1 = Math.sin(x * 0.005 + z);
      const n2 = Math.sin(y * 0.005 + z);
      const n3 = Math.sin((x + y) * 0.01 + z * 2);
      const n4 = Math.cos(Math.sqrt(x * x + y * y) * 0.008 + z);
      return (n1 + n2 + n3 + n4) / 3;
    };

    ctx.lineCap = "round";

    // Loop 35 garis sesuai kode asli
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      
      // Style sesuai kode asli
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + (i % 3) * 0.05})`;
      ctx.lineWidth = i % 5 === 0 ? 2 : 1.2;

      const baseRadius = 30 + i * 35;

      // Loop sudut (0 sampai 2*PI)
      for (let angle = 0; angle <= Math.PI * 2.1; angle += 0.02) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rawX = centerX + cosA * baseRadius;
        const rawY = centerY + sinA * baseRadius;

        const noiseValue = fluidNoise(rawX, rawY, time + i * 0.05);
        const displacement = noiseValue * 250; // Liukan tetap 250

        const x = rawX + cosA * displacement;
        const y = rawY + sinA * displacement;

        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
});