import { CO2_DATA, CO2_STATISTICS } from '../../utils/refinedData';

// More accurate continent paths (normalized coordinates)
const continents = {
  northAmerica: [
    [0.15, 0.15], [0.12, 0.18], [0.08, 0.22], [0.10, 0.28], 
    [0.15, 0.32], [0.18, 0.35], [0.22, 0.35], [0.25, 0.32],
    [0.28, 0.28], [0.25, 0.22], [0.22, 0.18], [0.15, 0.15]
  ],
  southAmerica: [
    [0.28, 0.35], [0.25, 0.42], [0.24, 0.48], [0.26, 0.55],
    [0.28, 0.62], [0.32, 0.65], [0.34, 0.60], [0.32, 0.52],
    [0.30, 0.45], [0.28, 0.35]
  ],
  europe: [
    [0.45, 0.18], [0.48, 0.15], [0.52, 0.15], [0.55, 0.18],
    [0.58, 0.20], [0.55, 0.25], [0.52, 0.28], [0.48, 0.25],
    [0.45, 0.22], [0.45, 0.18]
  ],
  africa: [
    [0.45, 0.30], [0.48, 0.32], [0.52, 0.35], [0.55, 0.42],
    [0.52, 0.50], [0.48, 0.55], [0.45, 0.52], [0.42, 0.45],
    [0.42, 0.38], [0.45, 0.30]
  ],
  asia: [
    [0.55, 0.18], [0.62, 0.15], [0.68, 0.18], [0.72, 0.22],
    [0.75, 0.28], [0.78, 0.32], [0.75, 0.38], [0.72, 0.42],
    [0.65, 0.40], [0.60, 0.35], [0.58, 0.30], [0.55, 0.25],
    [0.55, 0.18]
  ],
  australia: [
    [0.75, 0.45], [0.78, 0.48], [0.82, 0.52], [0.85, 0.55],
    [0.82, 0.58], [0.78, 0.55], [0.75, 0.52], [0.72, 0.48],
    [0.75, 0.45]
  ]
};

let startTime = Date.now();
const TRANSITION_DURATION = 30; // 30 seconds to show all years

function getColorsForCO2Level(co2Level) {
  const minCO2 = CO2_STATISTICS.levels.min;
  const maxCO2 = CO2_STATISTICS.levels.max;
  const normalizedLevel = (co2Level - minCO2) / (maxCO2 - minCO2);

  return {
    // Ocean color changes from blue to darker blue to murky brown
    ocean: {
      center: normalizedLevel < 0.5 
        ? '#1a4c6e' 
        : `hsl(200, ${50 - normalizedLevel * 40}%, ${30 - normalizedLevel * 20}%)`,
      edge: normalizedLevel < 0.5
        ? '#0d2335'
        : `hsl(200, ${40 - normalizedLevel * 35}%, ${20 - normalizedLevel * 15}%)`
    },
    // Continents change from green to yellow to brown
    continent: {
      light: normalizedLevel < 0.5
        ? '#3a7335'
        : `hsl(${120 - normalizedLevel * 120}, ${70 - normalizedLevel * 40}%, ${45 - normalizedLevel * 20}%)`,
      dark: normalizedLevel < 0.5
        ? '#2d5a1e'
        : `hsl(${120 - normalizedLevel * 120}, ${60 - normalizedLevel * 40}%, ${35 - normalizedLevel * 20}%)`
    },
    // Atmosphere from clear to orange to red
    atmosphere: normalizedLevel < 0.5
      ? `rgba(255, 165, 0, ${0.2 + normalizedLevel * 0.6})`
      : `rgba(255, ${Math.floor(165 * (1 - normalizedLevel))}, 0, ${0.5 + normalizedLevel * 0.3})`
  };
}

export function drawGlobe(ctx, width, height) {
  if (!ctx || !width || !height) {
    console.error('Invalid canvas context or dimensions');
    return;
  }

  try {
    const currentTime = Date.now();
    let elapsedTime = (currentTime - startTime) / 1000;
    
    // Reset animation after completion
    if (elapsedTime >= TRANSITION_DURATION) {
      startTime = Date.now();
      elapsedTime = 0;
    }
  
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
  
    // Calculate current year based on elapsed time
    const yearProgress = elapsedTime / TRANSITION_DURATION;
    const startYear = CO2_DATA[0].year;
    const endYear = CO2_DATA[CO2_DATA.length - 1].year;
    const currentYear = Math.floor(startYear + (endYear - startYear) * yearProgress);
    
    // Get CO2 level for current year
    const currentData = CO2_DATA.find(d => d.year === currentYear) || CO2_DATA[0];
    const co2Level = currentData.co2;
    const colors = getColorsForCO2Level(co2Level);
  
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
  
    // Draw stars (static)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(x, y, 1, 1);
    }
  
    // Draw ocean with CO2-based coloring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    const oceanGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    oceanGradient.addColorStop(0, colors.ocean.center);
    oceanGradient.addColorStop(1, colors.ocean.edge);
    ctx.fillStyle = oceanGradient;
    ctx.fill();
  
    // Draw continents with CO2-based coloring
    ctx.save();
    ctx.translate(centerX, centerY);
    
    Object.values(continents).forEach(continent => {
      ctx.beginPath();
      continent.forEach((point, i) => {
        const x = (point[0] - 0.5) * radius * 2;
        const y = (point[1] - 0.5) * radius * 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, -radius, 0, radius);
      gradient.addColorStop(0, colors.continent.light);
      gradient.addColorStop(1, colors.continent.dark);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    ctx.restore();
  
    // Draw atmosphere
    const atmosphereGradient = ctx.createRadialGradient(
      centerX, centerY, radius,
      centerX, centerY, radius * 1.2
    );
    atmosphereGradient.addColorStop(0, colors.atmosphere);
    atmosphereGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = atmosphereGradient;
    ctx.fill();
  
    // Draw info text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(`Year: ${currentYear}`, 20, 40);
    ctx.fillText(`CO₂: ${co2Level.toFixed(1)} ppm`, 20, 70);
  
    // Warning level
    const warningText = co2Level >= 400 ? "Critical Level" : 
                       co2Level >= 350 ? "Warning Level" : 
                       "Safe Level";
    ctx.fillStyle = co2Level >= 400 ? '#FF0000' : 
                   co2Level >= 350 ? '#FFA500' : 
                   '#4CAF50';
    ctx.fillText(warningText, 20, 100);
  
    // Add timeline progress bar
    const progressWidth = 200;
    ctx.fillStyle = '#444';
    ctx.fillRect(20, height - 40, progressWidth, 10);
    ctx.fillStyle = '#666';
    ctx.fillRect(20, height - 40, progressWidth * yearProgress, 10);
  } catch (error) {
    console.error('Error drawing globe:', error);
  }
}
