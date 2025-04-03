import HalftoneWorldMap from './map.js';

let worldMap;

document.addEventListener('DOMContentLoaded', () => {
  worldMap = new HalftoneWorldMap('halftoneCanvas');
  worldMap.loadGeoData();
});

window.exportScreenshot = () => {
  worldMap.exportScreenshot();
}; 