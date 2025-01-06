export const downloadPngButtons = (listItem, item) => {
  const downloadBtn = listItem.querySelector('.download-btn');
  const bgAndWhiteTextBtn = listItem.querySelector('.bg-and-white-text-btn');
  const removeBgBtn = listItem.querySelector('.remove-bg-btn');
  const whiteTextBtn = listItem.querySelector('.white-text-btn');

  const downloadImage = async (trackItem, excludeButtons, fileName, stylesToRestore = () => {}) => {
    const colorContainer = listItem.querySelector('.color-container');
    const paragraphs = trackItem.querySelectorAll('p');
    
    // Temporarily adjust styles
    trackItem.style.border = '0px dashed #888';
    colorContainer.style.display = 'none';
    paragraphs.forEach(p => p.style.filter = 'blur(0.2px)');

    // Capture the container as PNG
    try {
      const dataUrl = await domtoimage.toPng(trackItem, {
        filter: node => !excludeButtons.includes(node),
        width: 1280,
        height: 720,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'center',
        },
      });

      // Trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error capturing PNG:', error);
    } finally {
      // Restore the original styles
      stylesToRestore(paragraphs, trackItem, colorContainer);
    }
  };

  // Download with no background
  if(removeBgBtn){
    removeBgBtn?.addEventListener('click', async () => {
    const trackItem = listItem.querySelector('.track-item');
    const originalBackgroundImage = trackItem.style.backgroundImage;
    trackItem.style.backgroundImage = 'none';

    await downloadImage(trackItem, [downloadBtn, removeBgBtn, whiteTextBtn, bgAndWhiteTextBtn], 
      `api_cat_track_${item.id}_no_bg.png`, (paragraphs, trackItem, colorContainer) => {
        trackItem.style.backgroundImage = originalBackgroundImage;
        trackItem.style.border = '1px dashed #888';
        colorContainer.style.display = 'block';
        paragraphs.forEach(p => p.style.filter = '');
      });
  });
}

  // Download with white text and background
  if(bgAndWhiteTextBtn){
    bgAndWhiteTextBtn?.addEventListener('click', async () => {
    const trackItem = listItem.querySelector('.track-item');
    const albumDurationDigits = listItem.querySelector('.albumDuration span:nth-child(2)');
    const colorContainer = listItem.querySelector('.color-container');

    trackItem.style.color = 'white';
    albumDurationDigits.style.opacity = 0.4;

    await downloadImage(trackItem, [bgAndWhiteTextBtn, removeBgBtn, whiteTextBtn, downloadBtn],
      `api_cat_track_${item.id}.png`, (paragraphs, trackItem, colorContainer) => {
        trackItem.style.color = '';
        albumDurationDigits.style.opacity = '';
        colorContainer.style.display = 'block';
        paragraphs.forEach(p => p.style.filter = '');
      });
  });
}

  // Download with white text and without background
  if(whiteTextBtn){
    whiteTextBtn?.addEventListener('click', async () => {
    const trackItem = listItem.querySelector('.track-item');
    const albumDurationDigits = listItem.querySelector('.albumDuration span:nth-child(2)');
    const colorContainer = listItem.querySelector('.color-container');
    const originalBackgroundImage = trackItem.style.backgroundImage;
    trackItem.style.backgroundImage = 'none';
    trackItem.style.color = 'white';
    albumDurationDigits.style.opacity = 0.4;

    await downloadImage(trackItem, [downloadBtn, removeBgBtn, whiteTextBtn, bgAndWhiteTextBtn],
      `api_cat_track_${item.id}_white_text_no_bg.png`, (paragraphs, trackItem, colorContainer) => {
        trackItem.style.backgroundImage = originalBackgroundImage;
        trackItem.style.color = '';
        albumDurationDigits.style.opacity = '';
        colorContainer.style.display = 'block';
        paragraphs.forEach(p => p.style.filter = '');
      });
  });
}

  // Default download functionality (without modifications)
  if(downloadBtn){
      downloadBtn?.addEventListener('click', async () => {
      const trackItem = listItem.querySelector('.track-item');
      await downloadImage(trackItem, [downloadBtn, removeBgBtn, whiteTextBtn, bgAndWhiteTextBtn],
        `api_cat_track_${item.id}.png`, (paragraphs, trackItem, colorContainer) => {
          colorContainer.style.display = 'block';
          paragraphs.forEach(p => p.style.filter = '');
        });
    });
  }

};
