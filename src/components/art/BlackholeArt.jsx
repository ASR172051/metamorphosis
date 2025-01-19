let startTime = Date.now();
const RESET_INTERVAL = 30;
const PARTICLES_COUNT = 2000;

class RadiationParticle {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.life = 1;
    this.decay = 0.01 + Math.random() * 0.02;
    // More realistic blue-white radiation color
    this.temperature = 6000 + Math.random() * 4000; // Temperature in Kelvin
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life -= this.decay;
    this.speed *= 0.99;
  }

  draw(ctx) {
    // Convert temperature to RGB (simplified blackbody radiation)
    const intensity = this.life * 0.3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(166, 168, 255, ${intensity})`; // Blue-white glow
    ctx.fill();
  }
}

let particles = [];
let eventHorizonRadius = 0;
const MAX_EVENT_HORIZON = 1000; // Increased to allow full canvas engulfment

export function drawBlackhole(ctx, width, height) {
  const currentTime = Date.now();
  let elapsedTime = (currentTime - startTime) / 1000;
  
  if (elapsedTime >= RESET_INTERVAL) {
    startTime = Date.now();
    elapsedTime = 0;
    particles = [];
    eventHorizonRadius = 0;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  eventHorizonRadius = Math.min(maxRadius, elapsedTime * 15);

  // Changed background to grey instead of black
  ctx.fillStyle = 'rgba(50, 50, 50, 0.2)';
  ctx.fillRect(0, 0, width, height);

  // Draw accretion disk with enhanced brightness
  const diskRadius = eventHorizonRadius * 1.2;
  for (let i = 0; i < 360; i += 2) {
    const angle = (i * Math.PI) / 180;
    const radius = diskRadius + Math.sin(angle * 8 + elapsedTime * 2) * 10;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    // Increased intensity and added white-hot core
    const intensity = 0.6 + Math.sin(angle + elapsedTime) * 0.2; // Increased base intensity
    const innerGlow = Math.random() > 0.7 ? 1 : intensity;
    ctx.fillStyle = `rgba(255, ${147 + Math.random() * 108}, 41, ${innerGlow})`; // Brighter orange-white accretion disk
    ctx.fill();
    
    // Add extra glow effect
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 200, ${intensity * 0.3})`;
    ctx.fill();
  }

  // Emit radiation particles less frequently
  if (Math.random() < 0.2) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    particles.push(new RadiationParticle(
      centerX + Math.cos(angle) * eventHorizonRadius,
      centerY + Math.sin(angle) * eventHorizonRadius,
      angle,
      speed
    ));
  }

  // Update and draw particles
  particles = particles.filter(p => p.life > 0);
  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);
  });

  // Draw event horizon with more dramatic gradient
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, eventHorizonRadius
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');

  ctx.beginPath();
  ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw gravitational lensing with subtle blue shift
  ctx.beginPath();
  ctx.arc(centerX, centerY, eventHorizonRadius * 1.1, 0, Math.PI * 2);
  const lensIntensity = 0.05 + Math.sin(elapsedTime) * 0.02;
  ctx.strokeStyle = `rgba(147, 176, 255, ${lensIntensity})`; // Subtle blue lensing
  ctx.lineWidth = 2;
  ctx.stroke();
}
