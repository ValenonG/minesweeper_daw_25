"use strict";

function launchConfetti() {
  var duration = 20000; // duración en ms
  var end = Date.now() + duration;
  var colors = ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffcc00'];

  var canvas = document.getElementById('confetti-canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var particles = [];

  for (var i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 150 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncrement: Math.random() * 0.1 + 0.05,
      tiltAngle: 0
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    }
    update();
  }

  function update() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d);
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
    }
  }

  function animateConfetti() {
    draw();
    if (Date.now() < end) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animateConfetti();
}