# Halftone World Map Generator

![Halftone World Map Preview](./.github/preview.png)

A beautiful world map generator that creates a stylish halftone effect using dots. The map features a modern, minimalist design with a teal dot pattern on a dark gradient background.

## Features

- 🌍 Interactive world map visualization
- 🎨 Stylish halftone dot pattern effect
- 🖼️ High-resolution export capability (5040x2160)
- 📱 Responsive design that adapts to any screen size
- 🎯 Smooth rendering with device pixel ratio support
- 🌑 Beautiful dark gradient background with subtle noise

## Live Demo

You can try out the generator by opening `index.html` in your browser.

## Getting Started

1. Clone this repository:
```bash
git clone git@github.com:djquinten/world-background.git
cd world-background
```

2. Open `index.html` in your web browser, or serve it using a local development server

## Usage

- The map will automatically render when the page loads
- Click the "Save Screenshot" button in the top-right corner to download a high-resolution PNG version

## Technical Details

The map is rendered using HTML5 Canvas and pure JavaScript. It:
- Fetches GeoJSON data for country boundaries
- Implements an efficient point-in-polygon algorithm for dot placement
- Uses device pixel ratio for crisp rendering on high-DPI displays
- Creates a smooth gradient background with subtle noise for depth

## Files

- `index.html` - Main HTML file
- `map.js` - Core map rendering logic
- `styles.css` - Styling and layout
- `main.js` - Application entry point

## License

MIT License

## Credits

- World GeoJSON data from [johan/world.geo.json](https://github.com/johan/world.geo.json)
- Inspired by halftone printing techniques 