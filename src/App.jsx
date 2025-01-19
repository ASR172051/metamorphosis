import React, { useState, useRef, useEffect } from 'react';
import { drawFractal } from './components/art/FractalArt';
import { drawEvolutionary } from './components/art/EvolutionaryArt';
import { drawBlackhole } from './components/art/BlackholeArt';
import { drawGlobe } from './components/art/GlobeArt';

function App() {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true); // Changed to true
  const [currentStyle, setCurrentStyle] = useState('globe'); // Changed from 'fractal' to 'globe'

  // Add new state for canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth > 800 ? 800 : window.innerWidth - 20,
    height: window.innerWidth > 800 ? 600 : (window.innerWidth - 20) * 0.75
  });

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth > 800 ? 800 : window.innerWidth - 20;
      const height = window.innerWidth > 800 ? 600 : (window.innerWidth - 20) * 0.75;
      setCanvasDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add new useEffect for automatic start
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const getTitleForStyle = (style) => {
    const titles = {
      globe: "Our Carbon Footprint: A Visual History",
      blackhole: "The Abyss Expands",
      fractal: "The Beauty of Fractals",
      evolutionary: "Genesis: Evolution in Motion"
    };
    return titles[style] || titles.fractal;
  };

  const generateArt = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawFunctions = {
      fractal: drawFractal,
      evolutionary: drawEvolutionary,
      blackhole: drawBlackhole,
      globe: drawGlobe
    };

    const drawFunction = drawFunctions[currentStyle] || drawFractal;
    drawFunction(ctx, canvas.width, canvas.height);
  }, [currentStyle]);

  useEffect(() => {
    if (isAnimating) {
      generateArt();
      animationFrameId.current = requestAnimationFrame(function animate() {
        generateArt();
        animationFrameId.current = requestAnimationFrame(animate);
      });
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isAnimating, generateArt]);

  return (
    <div className="app">
      <h1>{getTitleForStyle(currentStyle)}</h1>
      <canvas 
        ref={canvasRef} 
        width={canvasDimensions.width} 
        height={canvasDimensions.height} 
        className="art-canvas"
      />
      <div className="controls">
        <button onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? 'Stop' : 'Start'} Animation
        </button>
        <button onClick={() => {
          const image = canvasRef.current.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = 'artwork.png';
          link.href = image;
          link.click();
        }}>Save Picture</button>
        <select 
          value={currentStyle} 
          onChange={(e) => setCurrentStyle(e.target.value)}
        >
          <option value="globe">Earth Globe</option>
          <option value="blackhole">Black Hole</option>
          <option value="fractal">Fractal</option>
          <option value="evolutionary">Evolutionary</option>
        </select>
      </div>
    </div>
  );
}

export default App;