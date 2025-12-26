# Audio Sorting Algorithm Visualizer

A sophisticated web-based tool that brings sorting algorithms to life through high-performance visual animations and synchronized audio feedback.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

## Features

- **15+ Sorting Algorithms**: From classic Bubble Sort to complex Bitonic and Stooge sorts.
- **VS Mode**: Compare two algorithms side-by-side with independent performance timers and shared initial states for fair benchmarking.
- **Auditory Experience**: Array values are mapped to frequencies (200Hz - 1000Hz) using the Web Audio API, allowing you to "hear" the order emerge.
- **Real-time Controls**:
  - **Array Size**: Visualize from 10 to 500 elements.
  - **Speed**: Dynamic adjustment of sorting velocity.
  - **Volume**: Precise control over the audio feedback.
- **Modern UI**: A sleek, dark-themed interface featuring glassmorphism, responsive design, and smooth CSS transitions.
- **High-DPI Rendering**: Crisp canvas visualizations using `devicePixelRatio` scaling.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Visualization**: HTML5 Canvas API.
- **Audio**: Web Audio API (`OscillatorNode`, `GainNode`).
- **Build Tool**: [Vite](https://vitejs.dev/).

## Algorithms Included

- **Comparison Sorts**: Bubble, Selection, Insertion, Quick, Merge, Heap, Shell, Cocktail, Gnome, Comb, Stooge, Cycle, Bitonic.
- **Non-Comparison Sorts**: Radix (LSD).
- **Esoteric Sorts**: Bogo Sort.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sound-algorithims.git
   cd sound-algorithims
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## How It Works

1. **Mapping**: Each bar in the visualizer represents an array element. Its height corresponds to its value, and its value is mapped to a specific frequency.
2. **Synchronization**: The sorting logic is `async`, allowing the UI to remain responsive while `awaiting` visualization steps and audio playback.
3. **VS Mode Logic**: When entering VS Mode, both visualizers are initialized with the exact same shuffled array. This ensures that any difference in completion time is purely due to the algorithm's efficiency.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the beauty of algorithmic patterns.
- Built with passion for computer science education.
