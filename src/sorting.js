import { playNote, getFrequency } from './audio.js';

async function wait(getOptions) {
  const { speed } = getOptions();
  const delay = Math.max(1, 200 - (speed * 1.99));
  await new Promise(resolve => setTimeout(resolve, delay));
}

export async function bubbleSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        playNote(getFrequency(array[j], max), 0.1, volume);
        onUpdate([...array], [j, j + 1]);
        await wait(getOptions);
      }
    }
  }
}

export async function selectionSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
      // Optional: visualize comparison
      // onUpdate([...array], [j, minIdx]);
      // await wait(getOptions);
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      const { volume } = getOptions();
      playNote(getFrequency(array[i], max), 0.1, volume);
      onUpdate([...array], [i, minIdx]);
      await wait(getOptions);
    }
  }
}

export async function insertionSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      array[j + 1] = array[j];
      playNote(getFrequency(array[j], max), 0.1, volume);
      onUpdate([...array], [j, j + 1]);
      await wait(getOptions);
      j = j - 1;
    }
    array[j + 1] = key;
    onUpdate([...array], [j + 1]);
  }
}

export async function quickSort(array, onUpdate, getOptions) {
  const max = Math.max(...array);
  
  async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) throw new Error('Stopped');

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        playNote(getFrequency(arr[i], max), 0.1, volume);
        onUpdate([...arr], [i, j]);
        await wait(getOptions);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const { volume } = getOptions();
    playNote(getFrequency(arr[i + 1], max), 0.1, volume);
    onUpdate([...arr], [i + 1, high]);
    await wait(getOptions);
    return i + 1;
  }

  async function sort(arr, low, high) {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await sort(arr, low, pi - 1);
      await sort(arr, pi + 1, high);
    }
  }

  try {
    await sort(array, 0, array.length - 1);
  } catch (e) {
    if (e.message !== 'Stopped') throw e;
  }
}

export async function mergeSort(array, onUpdate, getOptions) {
  const max = Math.max(...array);
  
  async function merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) throw new Error('Stopped');

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      playNote(getFrequency(arr[k], max), 0.1, volume);
      onUpdate([...arr], [k]);
      await wait(getOptions);
      k++;
    }
    while (i < n1) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) throw new Error('Stopped');

      arr[k] = L[i];
      playNote(getFrequency(arr[k], max), 0.1, volume);
      onUpdate([...arr], [k]);
      await wait(getOptions);
      i++;
      k++;
    }
    while (j < n2) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) throw new Error('Stopped');

      arr[k] = R[j];
      playNote(getFrequency(arr[k], max), 0.1, volume);
      onUpdate([...arr], [k]);
      await wait(getOptions);
      j++;
      k++;
    }
  }

  async function sort(arr, l, r) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    await sort(arr, l, m);
    await sort(arr, m + 1, r);
    await merge(arr, l, m, r);
  }

  try {
    await sort(array, 0, array.length - 1);
  } catch (e) {
    if (e.message !== 'Stopped') throw e;
  }
}

export async function heapSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);

  async function heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) throw new Error('Stopped');

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      playNote(getFrequency(arr[i], max), 0.1, volume);
      onUpdate([...arr], [i, largest]);
      await wait(getOptions);
      await heapify(arr, n, largest);
    }
  }

  try {
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(array, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      [array[0], array[i]] = [array[i], array[0]];
      playNote(getFrequency(array[i], max), 0.1, volume);
      onUpdate([...array], [0, i]);
      await wait(getOptions);
      await heapify(array, i, 0);
    }
  } catch (e) {
    if (e.message !== 'Stopped') throw e;
  }
}

export async function shellSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = array[i];
      let j;
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        const { shouldStop, volume } = getOptions();
        if (shouldStop()) return;

        array[j] = array[j - gap];
        playNote(getFrequency(array[j], max), 0.1, volume);
        onUpdate([...array], [j, j - gap]);
        await wait(getOptions);
      }
      array[j] = temp;
      onUpdate([...array], [j]);
    }
  }
}

export async function cocktailSort(array, onUpdate, getOptions) {
  let swapped = true;
  let start = 0;
  let end = array.length - 1;
  const max = Math.max(...array);

  while (swapped) {
    swapped = false;
    for (let i = start; i < end; ++i) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        playNote(getFrequency(array[i], max), 0.1, volume);
        onUpdate([...array], [i, i + 1]);
        await wait(getOptions);
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    --end;
    for (let i = end - 1; i >= start; --i) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        playNote(getFrequency(array[i], max), 0.1, volume);
        onUpdate([...array], [i, i + 1]);
        await wait(getOptions);
        swapped = true;
      }
    }
    ++start;
  }
}

export async function gnomeSort(array, onUpdate, getOptions) {
  let index = 0;
  const n = array.length;
  const max = Math.max(...array);

  while (index < n) {
    const { shouldStop, volume } = getOptions();
    if (shouldStop()) return;

    if (index === 0) index++;
    if (array[index] >= array[index - 1]) {
      index++;
    } else {
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
      playNote(getFrequency(array[index], max), 0.1, volume);
      onUpdate([...array], [index, index - 1]);
      await wait(getOptions);
      index--;
    }
  }
}

export async function radixSort(array, onUpdate, getOptions) {
  const maxVal = Math.max(...array);
  const n = array.length;

  async function countingSort(arr, exp) {
    let output = new Array(n);
    let count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) throw new Error('Stopped');

      let digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      
      // Visualization for Radix is tricky since it's not in-place in the same way
      // We'll update the array partially to show progress
      array[i] = output[count[digit]]; // This is a bit of a hack for visualization
      playNote(getFrequency(array[i], maxVal), 0.1, volume);
      onUpdate([...array], [i]);
      await wait(getOptions);
    }

    for (let i = 0; i < n; i++) {
      array[i] = output[i];
      onUpdate([...array], [i]);
    }
  }

  try {
    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
      await countingSort(array, exp);
    }
  } catch (e) {
    if (e.message !== 'Stopped') throw e;
  }
}

export async function bogoSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);
  
  const isSorted = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  while (!isSorted(array)) {
    const { shouldStop, volume } = getOptions();
    if (shouldStop()) return;

    // Shuffle
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    
    playNote(getFrequency(array[Math.floor(Math.random() * n)], max), 0.05, volume);
    onUpdate([...array], []);
    await wait(getOptions);
  }
}

export async function combSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);
  let gap = n;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < n; i++) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;

      if (array[i] > array[i + gap]) {
        [array[i], array[i + gap]] = [array[i + gap], array[i]];
        playNote(getFrequency(array[i], max), 0.1, volume);
        onUpdate([...array], [i, i + gap]);
        await wait(getOptions);
        sorted = false;
      }
    }
  }
}

export async function stoogeSort(array, onUpdate, getOptions) {
  const max = Math.max(...array);

  async function sort(arr, l, h) {
    const { shouldStop, volume } = getOptions();
    if (shouldStop()) throw new Error('Stopped');

    if (l >= h) return;

    if (arr[l] > arr[h]) {
      [arr[l], arr[h]] = [arr[h], arr[l]];
      playNote(getFrequency(arr[l], max), 0.1, volume);
      onUpdate([...arr], [l, h]);
      await wait(getOptions);
    }

    if (h - l + 1 > 2) {
      let t = Math.floor((h - l + 1) / 3);
      await sort(arr, l, h - t);
      await sort(arr, l + t, h);
      await sort(arr, l, h - t);
    }
  }

  try {
    await sort(array, 0, array.length - 1);
  } catch (e) {
    if (e.message !== 'Stopped') throw e;
  }
}

export async function cycleSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);

  for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
    let item = array[cycleStart];
    let pos = cycleStart;

    for (let i = cycleStart + 1; i < n; i++) {
      if (array[i] < item) pos++;
    }

    if (pos === cycleStart) continue;

    while (item === array[pos]) pos++;

    if (pos !== cycleStart) {
      const { shouldStop, volume } = getOptions();
      if (shouldStop()) return;
      [item, array[pos]] = [array[pos], item];
      playNote(getFrequency(array[pos], max), 0.1, volume);
      onUpdate([...array], [pos, cycleStart]);
      await wait(getOptions);
    }

    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (array[i] < item) pos++;
      }
      while (item === array[pos]) pos++;
      if (item !== array[pos]) {
        const { shouldStop, volume } = getOptions();
        if (shouldStop()) return;
        [item, array[pos]] = [array[pos], item];
        playNote(getFrequency(array[pos], max), 0.1, volume);
        onUpdate([...array], [pos, cycleStart]);
        await wait(getOptions);
      }
    }
  }
}

export async function bitonicSort(array, onUpdate, getOptions) {
  const n = array.length;
  const max = Math.max(...array);

  async function compAndSwap(arr, i, j, dir) {
    const { shouldStop, volume } = getOptions();
    if (shouldStop()) throw new Error('Stopped');

    if ((dir === 1 && arr[i] > arr[j]) || (dir === 0 && arr[i] < arr[j])) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      playNote(getFrequency(arr[i], max), 0.1, volume);
      onUpdate([...arr], [i, j]);
      await wait(getOptions);
    }
  }

  async function bitonicMerge(arr, low, cnt, dir) {
    if (cnt > 1) {
      let k = cnt / 2;
      for (let i = low; i < low + k; i++) {
        await compAndSwap(arr, i, i + k, dir);
      }
      await bitonicMerge(arr, low, k, dir);
      await bitonicMerge(arr, low + k, k, dir);
    }
  }

  async function sort(arr, low, cnt, dir) {
    if (cnt > 1) {
      let k = cnt / 2;
      await sort(arr, low, k, 1);
      await sort(arr, low + k, k, 0);
      await bitonicMerge(arr, low, cnt, dir);
    }
  }

  try {
    let powerOf2 = 1;
    while (powerOf2 * 2 <= n) powerOf2 *= 2;
    await sort(array, 0, powerOf2, 1);
    await insertionSort(array, onUpdate, getOptions);
  } catch (e) {
    if (e.message !== 'Stopped') throw e;
  }
}
