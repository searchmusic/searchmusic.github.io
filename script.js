    // Function to fetch data from data.json
    async function fetchData() {
      try {
        const response = await fetch("https://mvmapi.olk1.com/tracks")
        const data = await response.json()
        // console.log(data)
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }


    // Function to display tracks in the list
    function displayTracks(tracks, searchTerm) {
      const trackList = document.getElementById('trackList');
      trackList.innerHTML = '';

      tracks.forEach(track => {
        const listItem = document.createElement('li');

        if (track.trackName === track.albumName) {
          listItem.classList.add('matching-track');
        }

        listItem.textContent = `${track.trackName}`;

      // Include albumName only if there is a search query
      if (searchTerm && track.albumName) {
        const albumElement = document.createElement('strong');
        albumElement.textContent = ` : ${track.albumName}`;
        listItem.appendChild(albumElement);

        // Create an image element with class "artwork" and src set to artworkUrl
        if (track.artworkUrl) {
          const artworkElement = document.createElement('img');
          artworkElement.classList.add('artwork');
          artworkElement.src = track.artworkUrl;
          listItem.appendChild(artworkElement);
        }
      }

        trackList.appendChild(listItem);
      });
    }


    // Function to filter tracks based on search input
    function searchTracks() {
      const searchInput = document.getElementById('searchInput');
      const searchTerm = searchInput.value.toLowerCase();

      fetchData().then(data => {
        const matchingTracks = data.filter(track => track.trackName.toLowerCase().includes(searchTerm));
        displayTracks(matchingTracks, searchTerm);
      });
    }

    // Initial display of all tracks
    fetchData().then(data => displayTracks(data, ''));


