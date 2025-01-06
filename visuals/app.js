const api = 'https://mvmapi.olk1.com/tracks';

import { downloadPngButtons } from './buttons.js';
import { renderColorBoxes } from './colors.js';

const trackList = document.getElementById('trackList');
let isReversed = false; // State to track toggle for reverse order

const fetchApiData = async (filterRange = null) => {
try {
  const response = await fetch(api);
  if (!response.ok) { throw new Error(`Error: ${response.status}`); } 
  
  let data = await response.json();
  // Reverse order if toggle is active.
  if (isReversed) { 
    data = data.reverse();
  }
  // Apply ID range filter if provided.
  if (filterRange) {
    const { minId, maxId } = filterRange;
      data = data.filter(item => item.id >= minId && item.id <= maxId);
    }
  
  // console.table(data);  
  return data; 
} catch (error) { 
    console.error('Failed to fetch data:', error);
    return [];  
}};



const displayData = async (filterRange = null) => {
  const data = await fetchApiData(filterRange);

  // Clear existing trackList
  trackList.innerHTML = '';

  data.forEach(item => { 
    const listItem = document.createElement('section');

    const formatTrackDuration = (duration) => { 
      const durationInMinutes = parseFloat(duration); 
      const minutes = Math.floor(durationInMinutes); 
      const seconds = Math.round((durationInMinutes - minutes) * 60); 
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };   
    
    const formatAlbumDuration = (duration) => { 
      const durationInMinutes = parseFloat(duration); 
      const minutes = Math.floor(durationInMinutes); 
      const seconds = Math.round((durationInMinutes - minutes) * 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;    
    };

    const formattedTrackDuration = formatTrackDuration(item.trackDuration);  
    const formattedAlbumDuration = formatAlbumDuration(item.albumDuration);    

    // Use listItem directly without wrapping it in another <div> with track-item
    listItem.innerHTML = `
    <div class="track-item w-[1280px] h-[720px]">
      <p class="id"><span>[Catalogue ID]</span><span>&rarr;${item.id}</span></p>
      <p class="trackName worn-text"><span>TrackName</span><span>${item.trackName}</span></p>
      <p class="trackDuration"><span>Track Duration</span><span>${formattedTrackDuration}</span></p>
      <p class="trackNumber"><span>Sequence</span>#<span>${item.trackNumber}</span></p>
      <p class="albumName"><span>Album Title</span><span>${item.albumName}</span></p>
      <p class="albumDuration"><span>Album Duration</span><span>${formattedAlbumDuration}</span></p>
      <p class="releaseYear"><span>First Released:</span><span>${item.releaseYear}</span></p>
      <p class="genre"><span>Genre</span><span>${item.genre}</span></p>

      <div class="color-container"></div>
      <button class="download-btn">Download PNG</button> 
      <button class="bg-and-white-text-btn">PNG White Text</button> 
      <button class="remove-bg-btn">PNG No Background</button> 
      <button class="white-text-btn">No BG / White Text</button> 
    </div>
    `;
    
    trackList.appendChild(listItem); 

    // download png buttons that appear on hover (see style.css)
    downloadPngButtons(listItem, item);
    const colorContainer = document.querySelector('.color-container');
    renderColorBoxes(colorContainer);

    // Position paragraphs inside the listItem
    const paragraphs = listItem.querySelectorAll('p');
    const containerWidth = listItem.clientWidth;
    const containerHeight = listItem.clientHeight;

    const doesCollide = (x, y, width, height, elements) => {
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const elX = rect.left - listItem.getBoundingClientRect().left;
        const elY = rect.top - listItem.getBoundingClientRect().top;
        const elWidth = el.offsetWidth;
        const elHeight = el.offsetHeight;

        if (
          x < elX + elWidth &&
          x + width > elX &&
          y < elY + elHeight &&
          y + height > elY
        ) {
          return true; 
        }
      }
      return false; 
    };

    const placedElements = [];
    paragraphs.forEach(paragraph => {
      const width = paragraph.offsetWidth;
      const height = paragraph.offsetHeight;
      let randomX, randomY;

      let maxAttempts = 100;
      do {
        randomX = Math.floor(Math.random() * (containerWidth - width));
        randomY = Math.floor(Math.random() * (containerHeight - height));
        maxAttempts--;
      } while (doesCollide(randomX, randomY, width, height, placedElements) && maxAttempts > 0);

      paragraph.style.position = 'absolute';
      paragraph.style.left = `${randomX}px`;
      paragraph.style.top = `${randomY}px`;

      placedElements.push(paragraph);
    });
  });
};






// Controls UI setup.
const controlsContainerWrapper = document.getElementById('controls');

// Add UI for toggle and range inputs.
const setupUI = (data) => {
  // Create container for controls.
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'mt-1 controls-container flex justify-center items-center space-y-0 p-0 gap-1';

  // Toggle button for reverse order.
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Reverse Order';
  toggleButton.className = 'mb-1 lg:mb-0 px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition';
  toggleButton.addEventListener('click', () => {
    isReversed = !isReversed;
    displayData(); // Refresh the data display with the toggled state.
  });
  controlsContainer.appendChild(toggleButton);

  // Inputs for ID range filter.
  const inputContainer = document.createElement('div');
  inputContainer.className = 'flex flex-col lg:flex-row gap-1 justify-center space-x-0';

  const minIdInput = document.createElement('input');
  minIdInput.type = 'number';
  minIdInput.placeholder = '1';
  minIdInput.min = '1'; // Minimum value set to 1.
  minIdInput.className = 'w-20 px-2 py-1 border rounded focus:ring focus:outline-none';
  inputContainer.appendChild(minIdInput);

  const maxIdInput = document.createElement('input');
  maxIdInput.type = 'number';
  maxIdInput.placeholder = data.length.toString();
  maxIdInput.min = '1'; // Minimum value set to 1.
  maxIdInput.max = data.length.toString(); // Maximum value dynamically set to data.length.
  maxIdInput.className = 'w-20 mb-1 lg:mb-0 px-2 py-1 border rounded focus:ring focus:outline-none';
  inputContainer.appendChild(maxIdInput);

  controlsContainer.appendChild(inputContainer);

  // Filter button.
  const filterButton = document.createElement('button');
  filterButton.textContent = 'Filter by ID';
  filterButton.className = 'px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition';
  filterButton.addEventListener('click', () => {
    const minId = parseInt(minIdInput.value, 10);
    const maxId = parseInt(maxIdInput.value, 10);

    if (!isNaN(minId) && !isNaN(maxId) && minId >= 1 && maxId <= data.length) {
      displayData({ minId, maxId }); // Fetch and display filtered data.
    } else {
      alert('Please enter valid numeric values within the range.');
    }
  });
  controlsContainer.appendChild(filterButton);

  // Append controlsContainer as the first child of the body.
  controlsContainerWrapper.append(controlsContainer);
};




// Initialize the UI and fetch initial data.
fetchApiData().then((data) => {
  // console.table(data);
  if (data && Array.isArray(data) && data.length > 0) {
    // Pass valid data to setupUI and displayData.
    displayData();
    setupUI(data);
  } else {
    console.error('No data available or data is invalid.');
    alert('Failed to load data. Please try again later.');
  }
}).catch((error) => {
  console.error('Error fetching data:', error);
  alert('An error occurred while loading data. Please check your connection and try again.');
});
