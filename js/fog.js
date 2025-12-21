(() => {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'fogCanvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Fog particles
  const fogParticles = [];
  const NUM_PARTICLES = 50;

  for(let i=0;i<NUM_PARTICLES;i++){
    fogParticles.push({
      x: Math.random()*width,
      y: Math.random()*document.body.scrollHeight, // allow vertical space beyond viewport
      size: 200 + Math.random()*400,
      speedX: (Math.random()*1.0) - 0.1,
      speedY: (Math.random()*0.6) - 0.05,
      alpha: 0.05 + Math.random()*0.1
    });
  }

  function drawFog(){
    ctx.clearRect(0,0,width,height);

    const scrollY = window.scrollY; // offset due to scrolling

    fogParticles.forEach(p => {
      const drawY = p.y - scrollY; // shift particles by scroll

      // only draw particles that are visible in viewport
      if(drawY + p.size < 0 || drawY - p.size > height) return;

      const gradient = ctx.createRadialGradient(p.x, drawY, p.size*0.1, p.x, drawY, p.size);
      // Grey
      gradient.addColorStop(0, 'rgba(85, 85, 85,' + p.alpha + ')');
      gradient.addColorStop(1, 'rgba(85, 85, 85,0)');
      
      // Red
      //gradient.addColorStop(0, 'rgba(80, 0, 0,' + p.alpha + ')');
      //gradient.addColorStop(1, 'rgba(80, 0, 0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(p.x - p.size, drawY - p.size, p.size*2, p.size*2);

      // Move particle
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap horizontal edges
      if(p.x - p.size > width) p.x = -p.size;
      if(p.x + p.size < 0) p.x = width + p.size;

      // Vertical wrap (allow infinite vertical scrolling)
      if(p.y - p.size > document.body.scrollHeight) p.y = -p.size;
      if(p.y + p.size < 0) p.y = document.body.scrollHeight + p.size;
    });

    requestAnimationFrame(drawFog);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  drawFog();
})();