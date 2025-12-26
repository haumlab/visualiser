import './style.css'
import { 
  bubbleSort, selectionSort, insertionSort, quickSort, mergeSort,
  heapSort, shellSort, cocktailSort, gnomeSort, radixSort,
  bogoSort, combSort, stoogeSort, cycleSort, bitonicSort
} from './sorting.js'
import { playNote, getFrequency } from './audio.js'

const sizeInput = document.querySelector('#size');
const sizeValue = document.querySelector('#size-value');
const speedInput = document.querySelector('#speed');
const speedValue = document.querySelector('#speed-value');
const volumeInput = document.querySelector('#volume');
const volumeValue = document.querySelector('#volume-value');
const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');
const modeSingleBtn = document.querySelector('#mode-single');
const modeVsBtn = document.querySelector('#mode-vs');
const visualizersGrid = document.querySelector('#visualizers-grid');
const algo2Group = document.querySelector('#algo-2-group');
const card2 = document.querySelector('#card-2');

const infoModal = document.querySelector('#info-modal');
const openInfoBtn = document.querySelector('#open-info');
const closeBtns = document.querySelectorAll('.close-modal');

let isSorting = false;
let shouldStop = false;
let isVsMode = false;

class VisualizerInstance {
  constructor(id, canvasId, algoSelectId, timeDisplayId, nameDisplayId) {
    this.id = id;
    this.canvas = document.querySelector(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.algoSelect = document.querySelector(algoSelectId);
    this.timeDisplay = document.querySelector(timeDisplayId);
    this.nameDisplay = document.querySelector(nameDisplayId);
    this.array = [];
    this.startTime = 0;
    this.timerInterval = null;
  }

  init(size, sharedArray = null) {
    if (sharedArray) {
      this.array = [...sharedArray];
    } else {
      this.array = Array.from({ length: size }, (_, i) => i + 1);
      for (let i = this.array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
      }
    }
    this.resetTimer();
    this.draw();
    this.updateName();
  }

  updateName() {
    const name = this.algoSelect.options[this.algoSelect.selectedIndex].text;
    this.nameDisplay.textContent = name;
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timeDisplay.textContent = '0.00s';
  }

  startTimer() {
    this.startTime = performance.now();
    this.timerInterval = setInterval(() => {
      const elapsed = (performance.now() - this.startTime) / 1000;
      this.timeDisplay.textContent = elapsed.toFixed(2) + 's';
    }, 10);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    const elapsed = (performance.now() - this.startTime) / 1000;
    this.timeDisplay.textContent = elapsed.toFixed(2) + 's';
  }

  draw(highlights = [], completed = []) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);

    const barWidth = width / this.array.length;
    const maxVal = this.array.length;

    this.ctx.clearRect(0, 0, width, height);

    this.array.forEach((val, i) => {
      const barHeight = (val / maxVal) * height;
      if (completed.includes(i)) {
        this.ctx.fillStyle = '#10b981';
      } else if (highlights.includes(i)) {
        this.ctx.fillStyle = '#f43f5e';
      } else {
        const hue = 200 + (val / maxVal) * 40;
        this.ctx.fillStyle = `hsla(${hue}, 80%, 60%, 1)`;
      }
      const x = i * barWidth;
      const nextX = (i + 1) * barWidth;
      this.ctx.fillRect(x, height - barHeight, nextX - x, barHeight);
    });
  }

  async sort(getOptions) {
    const algorithm = this.algoSelect.value;
    const onUpdate = (newArray, highlights) => {
      this.array = newArray;
      this.draw(highlights);
    };

    this.startTimer();
    try {
      switch (algorithm) {
        case 'bubble': await bubbleSort(this.array, onUpdate, getOptions); break;
        case 'selection': await selectionSort(this.array, onUpdate, getOptions); break;
        case 'insertion': await insertionSort(this.array, onUpdate, getOptions); break;
        case 'quick': await quickSort(this.array, onUpdate, getOptions); break;
        case 'merge': await mergeSort(this.array, onUpdate, getOptions); break;
        case 'heap': await heapSort(this.array, onUpdate, getOptions); break;
        case 'shell': await shellSort(this.array, onUpdate, getOptions); break;
        case 'cocktail': await cocktailSort(this.array, onUpdate, getOptions); break;
        case 'gnome': await gnomeSort(this.array, onUpdate, getOptions); break;
        case 'radix': await radixSort(this.array, onUpdate, getOptions); break;
        case 'bogo': await bogoSort(this.array, onUpdate, getOptions); break;
        case 'comb': await combSort(this.array, onUpdate, getOptions); break;
        case 'stooge': await stoogeSort(this.array, onUpdate, getOptions); break;
        case 'cycle': await cycleSort(this.array, onUpdate, getOptions); break;
        case 'bitonic': await bitonicSort(this.array, onUpdate, getOptions); break;
      }
      this.stopTimer();
      if (!shouldStop) await this.animateCompletion(getOptions);
    } catch (e) {
      this.stopTimer();
      console.error(`Sort ${this.id} interrupted`, e);
    }
  }

  async animateCompletion(getOptions) {
    const max = this.array.length;
    const volume = getOptions().volume;
    const step = Math.max(1, Math.floor(this.array.length / 50));
    for (let i = 0; i < this.array.length; i += step) {
      if (shouldStop) break;
      const end = Math.min(i + step, this.array.length);
      this.draw([], Array.from({ length: end }, (_, k) => k));
      if (this.id === 1) { // Only play sound for first visualizer to avoid chaos
        playNote(getFrequency(this.array[i], max), 0.05, volume * 0.3);
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    this.draw();
  }
}

const v1 = new VisualizerInstance(1, '#visualizer-1', '#algorithm', '#card-1 .algo-time', '#card-1 .algo-name');
const v2 = new VisualizerInstance(2, '#visualizer-2', '#algorithm-2', '#card-2 .algo-time', '#card-2 .algo-name');

function initAll() {
  const size = parseInt(sizeInput.value);
  v1.init(size);
  if (isVsMode) {
    v2.init(size, v1.array); // Use same shuffled array for fair comparison
  }
}

async function startSorting() {
  if (isSorting) return;
  isSorting = true;
  shouldStop = false;
  
  startBtn.disabled = true;
  sizeInput.disabled = true;
  startBtn.innerHTML = `<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Sorting...`;

  const getOptions = () => ({
    speed: parseInt(speedInput.value),
    volume: parseInt(volumeInput.value) / 100,
    shouldStop: () => shouldStop
  });

  const promises = [v1.sort(getOptions)];
  if (isVsMode) {
    promises.push(v2.sort(getOptions));
  }

  await Promise.all(promises);

  isSorting = false;
  startBtn.disabled = false;
  sizeInput.disabled = false;
  startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Start Sorting`;
}

modeSingleBtn.addEventListener('click', () => {
  if (!isVsMode) return;
  isVsMode = false;
  shouldStop = true;
  modeSingleBtn.classList.add('active');
  modeVsBtn.classList.remove('active');
  visualizersGrid.classList.add('single-mode');
  visualizersGrid.classList.remove('vs-mode');
  algo2Group.style.display = 'none';
  card2.style.display = 'none';
  initAll();
});

modeVsBtn.addEventListener('click', () => {
  if (isVsMode) return;
  isVsMode = true;
  shouldStop = true;
  modeVsBtn.classList.add('active');
  modeSingleBtn.classList.remove('active');
  visualizersGrid.classList.remove('single-mode');
  visualizersGrid.classList.add('vs-mode');
  algo2Group.style.display = 'flex';
  card2.style.display = 'flex';
  initAll();
});

// Input Listeners
[document.querySelector('#algorithm'), document.querySelector('#algorithm-2')].forEach(el => {
  el.addEventListener('change', () => {
    shouldStop = true;
    v1.updateName();
    v2.updateName();
    initAll();
  });
});

sizeInput.addEventListener('input', () => {
  sizeValue.textContent = sizeInput.value;
  shouldStop = true;
  initAll();
});

speedInput.addEventListener('input', () => speedValue.textContent = speedInput.value);
volumeInput.addEventListener('input', () => volumeValue.textContent = volumeInput.value);

startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', () => {
  shouldStop = true;
  initAll();
});

// Initial setup
initAll();
window.addEventListener('resize', () => {
  v1.draw();
  if (isVsMode) v2.draw();
});

openInfoBtn.addEventListener('click', () => infoModal.classList.add('active'));
closeBtns.forEach(btn => btn.addEventListener('click', () => infoModal.classList.remove('active')));
window.addEventListener('click', (e) => { if (e.target === infoModal) infoModal.classList.remove('active'); });
