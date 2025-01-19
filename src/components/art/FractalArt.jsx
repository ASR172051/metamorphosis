import { getVibrantColor } from '../../utils/colors';

let startTime = Date.now();
const MAX_BRANCH_INCREASES = 3; // Changed from 4 to 3
const INITIAL_BRANCHES = 2;
const TIME_TO_MAX_BRANCHES = MAX_BRANCH_INCREASES * 5; // Time when branches stop increasing
const RESET_INTERVAL = 20; // Reset every 20 seconds

export function drawFractal(ctx, width, height) {
  const currentTime = Date.now();
  let elapsedTime = (currentTime - startTime) / 1000; // Time in seconds
  
  // Reset startTime if elapsed time exceeds RESET_INTERVAL
  if (elapsedTime >= RESET_INTERVAL) {
    startTime = Date.now();
    elapsedTime = 0;
  }
  
  const drawBranch = (x, y, len, angle, depth) => {
    if (depth === 0) return;

    const endX = x + len * Math.cos(angle);
    const endY = y + len * Math.sin(angle);
    
    // Color changes stop when branch increases stop
    const effectiveTime = Math.min(elapsedTime, TIME_TO_MAX_BRANCHES);
    const hue = (effectiveTime * 50 + depth * 25) % 360;
    const saturation = 90;
    const lightness = 50;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
    ctx.lineWidth = depth;
    ctx.stroke();

    // Limit branch increases to 3 times (will result in max 5 branches: 2 initial + 3 increases)
    const branchIncrements = Math.min(MAX_BRANCH_INCREASES, Math.floor(elapsedTime / 5));
    const numBranches = INITIAL_BRANCHES + branchIncrements;
    const angleStep = 1.0 / numBranches;
    
    for (let i = 0; i < numBranches; i++) {
      const newAngle = angle - 0.5 + (i * angleStep);
      drawBranch(
        endX, 
        endY, 
        len * 0.7, 
        newAngle, 
        depth - 1
      );
    }
  };

  ctx.save();
  ctx.translate(width / 2, height);
  
  // Depth increases with time (max 12)
  const depth = Math.min(12, 6 + Math.floor(elapsedTime / 10));
  
  drawBranch(0, 0, height * 0.3, -Math.PI / 2, depth);
  ctx.restore();
}
