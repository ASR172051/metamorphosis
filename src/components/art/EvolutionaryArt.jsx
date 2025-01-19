import { getVibrantColor } from '../../utils/colors';

let startTime = Date.now();
let organisms = [];
const RESET_INTERVAL = 30; // Reset every 30 seconds

class Organism {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.5 + Math.random();
    this.hue = Math.random() * 360;
    this.children = [];
    this.age = 0;
    this.maxAge = 100 + Math.random() * 200;
    this.splitAge = 40 + Math.random() * 30;
    this.connections = [];
  }

  update(elapsedTime, width, height) {
    this.age++;
    this.hue = (this.hue + 0.5) % 360;
    
    // Move in a fluid motion
    this.x += Math.cos(this.angle + elapsedTime) * this.speed;
    this.y += Math.sin(this.angle + elapsedTime) * this.speed;
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.angle = Math.PI - this.angle;
    if (this.y < 0 || this.y > height) this.angle = -this.angle;
    
    // Split at certain age
    if (this.age > this.splitAge && this.children.length < 2 && organisms.length < 50) {
      const child = new Organism(this.x, this.y, this.size * 0.8);
      this.children.push(child);
      organisms.push(child);
      this.connections.push(child);
    }
    
    // Die of old age
    if (this.age > this.maxAge) {
      const index = organisms.indexOf(this);
      if (index > -1) organisms.splice(index, 1);
    }
  }

  draw(ctx) {
    // Draw main body
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, 0.3)`;
    ctx.fill();
    
    // Draw connections to children
    this.connections.forEach(child => {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(child.x, child.y);
      ctx.strokeStyle = `hsla(${this.hue}, 70%, 50%, 0.2)`;
      ctx.lineWidth = this.size / 4;
      ctx.stroke();
    });
    
    // Draw energy field
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * (1 + Math.sin(this.age * 0.1) * 0.3), 
            0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${this.hue}, 70%, 50%, 0.1)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawEvolutionary(ctx, width, height) {
  const currentTime = Date.now();
  let elapsedTime = (currentTime - startTime) / 1000;
  
  if (elapsedTime >= RESET_INTERVAL) {
    startTime = Date.now();
    elapsedTime = 0;
    organisms = [];
  }

  // Initialize with a single organism if none exist
  if (organisms.length === 0) {
    organisms.push(new Organism(width/2, height/2, 20));
  }

  // Update and draw all organisms
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  
  organisms.forEach(org => {
    org.update(elapsedTime, width, height);
    org.draw(ctx);
  });
}
