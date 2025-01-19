export function getVibrantColor(opacity = 1) {
  const hue = Math.random() * 360;
  const saturation = 90 + Math.random() * 10;
  const lightness = 45 + Math.random() * 10;
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
}
