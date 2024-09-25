// Data for the songs
const songs = [
  { title: 'Happier Than Ever', artist: 'Billie Eilish', genre: 'pop', file: 'happier.mp3', duration: '3:47' },
  { title: 'Bad Guy', artist: 'Billie Eilish', genre: 'pop', file: 'badguy.mp3', duration: '3:14' },
  { title: 'Rock Song', artist: 'Rock Band', genre: 'rock', file: 'rocksong.mp3', duration: '4:21' },
  { title: 'Jazz Mood', artist: 'Jazz Artist', genre: 'jazz', file: 'jazzmood.mp3', duration: '5:12' }
  // Add more songs here
];

// State variables
let currentSongIndex = 0;
let isPlaying = false;
let isShuffling = false;
let isRepeating = false;

// DOM Elements
const playButton = document.querySelector('.play-btn');
const prevButton = document.querySelector('.control-btn:nth-child(2)');
const nextButton = document.querySelector('.control-btn:nth-child(4)');
const shuffleButton = document.querySelector('.control-btn:nth-child(5)');
const repeatButton = document.querySelector('.control-btn:nth-child(1)');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const albumCover = document.querySelector('.album-cover');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');
const searchBar = document.querySelector('.search-bar');
const genreFilter = document.getElementById('filter-genre');
const artistFilter = document.getElementById('filter-artist');
const playlistList = document.querySelector('.playlist-list');

// Create audio element
const audio = new Audio(songs[currentSongIndex].file);

// Update the UI for the current song
function updatePlayer() {
  const song = songs[currentSongIndex];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  albumCover.src = song.title.toLowerCase().replace(/\s/g, '') + '.jpg';
  audio.src = song.file;
  totalTimeEl.textContent = song.duration;
  progressBar.value = 0;
  audio.currentTime = 0;
  if (isPlaying) {
    audio.play();
  }
}

// Play/Pause functionality
playButton.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    playButton.textContent = '▶️';
  } else {
    audio.play();
    playButton.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
});

// Next song functionality
nextButton.addEventListener('click', () => {
  if (isShuffling) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  updatePlayer();
});

// Previous song functionality
prevButton.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updatePlayer();
});

// Shuffle functionality
shuffleButton.addEventListener('click', () => {
  isShuffling = !isShuffling;
  shuffleButton.style.color = isShuffling ? 'green' : 'white';
});

// Repeat functionality
repeatButton.addEventListener('click', () => {
  isRepeating = !isRepeating;
  repeatButton.style.color = isRepeating ? 'green' : 'white';
  audio.loop = isRepeating;
});

// Volume control functionality
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

// Progress bar functionality
audio.addEventListener('timeupdate', () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Update the time when user scrubs the progress bar
progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Format the time in MM:SS
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Search functionality
searchBar.addEventListener('input', () => {
  const searchTerm = searchBar.value.toLowerCase();
  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm));
  updatePlaylistUI(filteredSongs);
});

// Filter by genre or artist
genreFilter.addEventListener('change', () => {
  filterSongs();
});

artistFilter.addEventListener('change', () => {
  filterSongs();
});

// Filter songs by genre and artist
function filterSongs() {
  const selectedGenre = genreFilter.value;
  const selectedArtist = artistFilter.value;
  let filteredSongs = songs;

  if (selectedGenre !== 'all') {
    filteredSongs = filteredSongs.filter(song => song.genre === selectedGenre);
  }

  if (selectedArtist !== 'all') {
    filteredSongs = filteredSongs.filter(song => song.artist.toLowerCase().includes(selectedArtist));
  }

  updatePlaylistUI(filteredSongs);
}

// Update the playlist UI based on filtered songs
function updatePlaylistUI(filteredSongs) {
  playlistList.innerHTML = '';
  filteredSongs.forEach(song => {
    const li = document.createElement('li');
    li.classList.add('playlist-item');
    li.innerHTML = `
      <i class="icon music-icon">🎵</i>
      <div class="playlist-details">
        <p class="playlist-name">${song.title}</p>
        <p class="playlist-count">${song.artist}</p>
      </div>
      <button class="more-options-btn">⋮</button>
    `;
    playlistList.appendChild(li);
  });
}

// Initial load
updatePlayer();
updatePlaylistUI(songs);
