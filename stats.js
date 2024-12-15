async function fetchAndProcessData() {
  // Fetch data
  const res = await fetch("https://mvmapi.olk1.com/tracks");
  const json = await res.json();

  // Extract track names, album names, and durations
  const tracks = json.map(x => x.trackName);
  const albums = json.map(x => x.albumName);
  const albumDuration = json.map(x => x.albumDuration);

  // TRACKS
  const totalTracks = tracks.length;

  // ALBUMS
  const totalAlbumsInDiscography = [...new Set(albums)];

  // TIME
  const totalAlbumMinutes = [...new Set(albumDuration)];

  function calculateTotalTime(timeArray) {
    const totalSeconds = timeArray.reduce((acc, albumsDuration) => {
      const [minutes, seconds] = albumsDuration.toString().split('.').map(Number);
      return acc + minutes * 60 + seconds;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return { 
      hours, 
      minutes: minutes < 10 ? minutes : minutes, 
      seconds: seconds < 10 ? seconds : seconds 
    };
  }

  const totalTime = calculateTotalTime(totalAlbumMinutes);

  const localStorageKey = "animateCounter";

  function incrementCounter(selector, current, target, duration, letter = "") {
    const element = document.getElementById(selector);

    if (current < target && element) {
      current++;
      element.innerText = `${current < 10 ? '0' : ''}${current}${letter}`;

      setTimeout(() => {
        incrementCounter(selector, current, target, duration, letter);
      }, Math.abs(Math.floor(duration / target)));
    }

    localStorage.setItem(localStorageKey, Date.now().toString());
  }

  const totalTracksTarget = totalTracks;
  const totalAlbumsTarget = totalAlbumsInDiscography.length;
  const totalHoursTarget = totalTime.hours;
  const totalMinutesTarget = totalTime.minutes;

  const captions = document.querySelectorAll('.caption');

  captions.forEach(element => {
    if (element instanceof HTMLElement) {
      setTimeout(() => {
        element.classList.remove('delay');
      }, 100);
    }
  });

  const didRun = localStorage.getItem(localStorageKey);
  const lastRunDate = didRun ? new Date(parseInt(didRun, 10)) : null;
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  if (!lastRunDate || lastRunDate.getTime() <= twentyFourHoursAgo) {
    incrementCounter("totalTracks", 0, totalTracksTarget, 1);
    incrementCounter("totalAlbums", 0, totalAlbumsTarget, 2300);
    incrementCounter("totalHours", 0, totalHoursTarget, 1200);
    incrementCounter("totalMinutes", 0, totalMinutesTarget, 2000);
  } else {
    const staticTracks = document.getElementById('totalTracks');
    const staticAlbums = document.getElementById('totalAlbums');
    const staticHours = document.getElementById('totalHours');
    const staticMins = document.getElementById('totalMinutes');

    if (staticTracks) staticTracks.innerText = totalTracksTarget.toFixed();
    if (staticAlbums) staticAlbums.innerText = totalAlbumsTarget.toFixed();
    if (staticHours) staticHours.innerText = totalHoursTarget.toFixed();
    if (staticMins) {
      staticMins.innerText = totalMinutesTarget < 10 
        ? `0${totalMinutesTarget}` 
        : `${totalMinutesTarget}`;
    }
  }
}

// Run the function
fetchAndProcessData();



