// Download functionality with background
  const downloadBtn = listItem.querySelector('.download-btn');
  downloadBtn.addEventListener('click', async () => {
    // Capture the track-item container without the button.
    const trackItem = listItem.querySelector('.track-item');
    const colorContainer = listItem.querySelector('.color-container');
    // Temporarily remove dashed border + color swatches
    trackItem.style.border = '0px dashed #888';
    colorContainer.style.display = 'none';
    // Temporarily set blur style to 0.2px
    const paragraphs = trackItem.querySelectorAll('p');
    paragraphs.forEach(p => p.style.filter = 'blur(0.2px)');  
    // Use dom-to-image to capture the container  
    domtoimage.toPng(trackItem, { filter: (node) => node !== downloadBtn && node !== removeBgBtn && node !== whiteTextBtn && node !== bgAndWhiteTextBtn, 
    // Exclude buttons from the capture
    width: 1280, height: 720, style: { 
      transform: 'scale(1)', // Ensure no scaling is applied
      transformOrigin: 'center', // Apply transformation from the top-left corner
    }}).then(function (dataUrl) {
      trackItem.style.border = '1px dashed #888'; // Restore color 
      swatches.colorContainer.style.display= 'block'; // Restore the original blur style    
      paragraphs.forEach(p => p.style.filter = ''); // Create a temporary link to trigger the download.
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `api_cat_track_${item.id}.png`; // Customize the filename.
      link.click();
    }).catch(function (error) {
      trackItem.style.border = '1px dashed #888';// Restore color swatches in case of anerror.
      colorContainer.style.display = 'block';// Restore the original blur style in case of an error.
      paragraphs.forEach(p => p.style.filter = '');
      console.error('Error capturing PNG:', error);
    });
  });



// Download functionality with background and white text.
const bgAndWhiteTextBtn = listItem.querySelector('.bg-and-white-text-btn');
bgAndWhiteTextBtn.addEventListener('click', async () => {
  const trackItem = listItem.querySelector('.track-item');
  const albumDurationDigits = listItem.querySelector('.albumDuration span:nth-child(2)');
  const colorContainer = listItem.querySelector('.color-container');

  // Temporarily change styles
  trackItem.style.color = 'white';
  trackItem.style.border = '0px dashed #888';
  albumDurationDigits.style.opacity = 0.4;
  colorContainer.style.display = 'none';
  const paragraphs = trackItem.querySelectorAll('p');
  paragraphs.forEach(p => (p.style.filter = 'blur(0.2px)'));

  // Capture the container
  domtoimage
    .toPng(trackItem, {
      filter: node =>
        node !== bgAndWhiteTextBtn &&
        node !== removeBgBtn &&
        node !== whiteTextBtn &&
        node !== downloadBtn,
      width: 1280,
      height: 720,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'center',
      },
    })
    .then(dataUrl => {
      // Restore styles
      trackItem.style.color = '';
      trackItem.style.border = '1px dashed #888';
      albumDurationDigits.style.opacity = '';
      colorContainer.style.display = 'block';
      paragraphs.forEach(p => (p.style.filter = ''));

      // Trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `api_cat_track_${item.id}.png`;
      link.click();
    })
    .catch(error => {
      // Restore styles on error
      trackItem.style.color = '';
      trackItem.style.border = '1px dashed #888';
      albumDurationDigits.style.opacity = '';
      colorContainer.style.display = 'block';
      paragraphs.forEach(p => (p.style.filter = ''));
      console.error('Error capturing PNG:', error);
    });
});



// Download functionality without background
const removeBgBtn = listItem.querySelector('.remove-bg-btn');
removeBgBtn.addEventListener('click', async () => {
  const trackItem = listItem.querySelector('.track-item');
  const colorContainer = listItem.querySelector('.color-container');
  const originalBackgroundImage = trackItem.style.backgroundImage;

  // Temporarily change styles
  trackItem.style.backgroundImage = 'none';
  trackItem.style.border = '0px dashed #888';
  colorContainer.style.display = 'none';
  const paragraphs = trackItem.querySelectorAll('p');
  paragraphs.forEach(p => (p.style.filter = 'blur(0.2px)'));

  // Capture the container
  domtoimage
    .toPng(trackItem, {
      filter: node =>
        node !== downloadBtn &&
        node !== removeBgBtn &&
        node !== whiteTextBtn &&
        node !== bgAndWhiteTextBtn,
      width: 1280,
      height: 720,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'center',
      },
    })
    .then(dataUrl => {
      // Restore styles
      paragraphs.forEach(p => (p.style.filter = ''));
      trackItem.style.backgroundImage = originalBackgroundImage;
      trackItem.style.border = '1px dashed #888';
      colorContainer.style.display = 'block';

      // Trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `api_cat_track_${item.id}_no_bg.png`;
      link.click();
    })
    .catch(error => {
      // Restore styles on error
      paragraphs.forEach(p => (p.style.filter = ''));
      trackItem.style.backgroundImage = originalBackgroundImage;
      trackItem.style.border = '1px dashed #888';
      colorContainer.style.display = 'block';
      console.error('Error capturing PNG:', error);
    });
});



// Download functionality without background / with white text.
const whiteTextBtn = listItem.querySelector('.white-text-btn');
whiteTextBtn.addEventListener('click', async () => {
  // Capture the track-item container without the button and background.
  const trackItem = listItem.querySelector('.track-item');
  const colorContainer = listItem.querySelector('.color-container');
  const albumDurationDigits = listItem.querySelector('.albumDuration span:nth-child(2)');

  // Temporarily remove the background image.
  const originalBackgroundImage = trackItem.style.backgroundImage;
  trackItem.style.backgroundImage = 'none';
  trackItem.style.color = 'white';
  trackItem.style.border = '0px dashed #888';
  albumDurationDigits.style.opacity = 0.4;
  colorContainer.style.display = 'none';

  // Temporarily set blur style to 0.2px.
  const paragraphs = trackItem.querySelectorAll('p');
  paragraphs.forEach(p => p.style.filter = 'blur(0.2px)');

  // Use dom-to-image to capture the container.
  domtoimage.toPng(trackItem, {
    filter: (node) => node !== downloadBtn && node !== removeBgBtn && node !== whiteTextBtn && node !== bgAndWhiteTextBtn, // Exclude buttons from the capture.
    width: 1280,
    height: 720,
    style: {
      transform: 'scale(1)', // Ensure no scaling is applied.
      transformOrigin: 'center', // Apply transformation from the top-left corner.
    },
  })
    .then(function (dataUrl) {
      // Restore the original blur style and background image.
      paragraphs.forEach(p => p.style.filter = '');
      trackItem.style.backgroundImage = originalBackgroundImage;
      trackItem.style.color = '';
      albumDurationDigits.style.opacity = '';
      trackItem.style.border = '1px dashed #888';
      colorContainer.style.display = 'block';

      // Create a temporary link to trigger the download.
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `api_cat_track_${item.id}_no_bg.png`; // Customize the filename.
      link.click();
    })
    .catch(function (error) {
      // Restore the original blur style and background image in case of an error.
      paragraphs.forEach(p => p.style.filter = '');
      trackItem.style.backgroundImage = originalBackgroundImage;
      trackItem.style.color = '';
      albumDurationDigits.style.opacity = '';
      trackItem.style.border = '1px dashed #888';
      colorContainer.style.display = 'block';
      console.error('Error capturing PNG:', error);
    });
});
