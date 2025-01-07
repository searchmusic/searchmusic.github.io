export const downloadPngButtons = (listItem, item) => {
  const downloadBtn = listItem.querySelector('.download-btn');
  const bgAndWhiteTextBtn = listItem.querySelector('.bg-and-white-text-btn');
  const removeBgBtn = listItem.querySelector('.remove-bg-btn');
  const whiteTextBtn = listItem.querySelector('.white-text-btn');

  const trackItem = listItem.querySelector('.track-item'); // Main container
  const paragraphs = trackItem.querySelectorAll('p'); // Paragraphs or other child elements
  const colorContainer = trackItem.querySelector('.color-container');

  // Reusable function to reset styles
  const resetStyles = () => {
    trackItem.style.border = '1px dashed #888';
    colorContainer.style.display = 'block';
    paragraphs.forEach(p => (p.style.filter = '')); // Reset blur value
  };

  const downloadImage = async (trackItem, excludeButtons, fileName, additionalReset = () => {}) => {
    // Temporarily adjust styles (all button options)
    paragraphs.forEach(p => (p.style.filter = 'blur(0.2px)'));
    colorContainer.style.display = 'none';
    trackItem.style.border = '0px dashed #888';

    try {
      // Capture the container as PNG
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
      additionalReset();
      resetStyles();
    }
  };

  // Download with no background
  if (removeBgBtn) {
    removeBgBtn.addEventListener('click', async () => {
      const originalBackgroundImage = trackItem.style.backgroundImage;
      trackItem.style.backgroundImage = 'none';

      await downloadImage(
        trackItem,
        [downloadBtn, removeBgBtn, whiteTextBtn, bgAndWhiteTextBtn],
        `api_cat_track_${item.id}_no_bg.png`,
        () => {
          trackItem.style.backgroundImage = originalBackgroundImage;
        }
      );
    });
  }

  // Download with no background and white text
  if (whiteTextBtn) {
    whiteTextBtn.addEventListener('click', async () => {
      const originalBackgroundImage = trackItem.style.backgroundImage;
      trackItem.style.backgroundImage = 'none';
      trackItem.style.color = 'white';

      await downloadImage(
        trackItem,
        [downloadBtn, removeBgBtn, whiteTextBtn, bgAndWhiteTextBtn],
        `api_cat_track_${item.id}_white_text_no_bg.png`,
        () => {
          trackItem.style.backgroundImage = originalBackgroundImage;
          trackItem.style.color = '';
        }
      );
    });
  }

  // Download with white text
  if (bgAndWhiteTextBtn) {
    bgAndWhiteTextBtn.addEventListener('click', async () => {
      trackItem.style.color = 'white';

      await downloadImage(
        trackItem,
        [bgAndWhiteTextBtn, removeBgBtn, whiteTextBtn, downloadBtn],
        `api_cat_track_${item.id}_white_text.png`,
        () => {
          trackItem.style.color = '';
        }
      );
    });
  }

  // Download as rendered
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      await downloadImage(
        trackItem,
        [downloadBtn, removeBgBtn, whiteTextBtn, bgAndWhiteTextBtn],
        `api_cat_track_${item.id}.png`
      );
    });
  }
};
