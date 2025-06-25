// Songs data
const songs = [
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://th.bing.com/th/id/OIP.ixGAHrJZ4Yl_2vPYNSI2ogHaHa?w=194&h=194&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        duration: "3:20",
        audio: "https://archive.org/details/the-weeknd-blinding-lights-official-audio_202103"
    },
    {
        title: "Save Your Tears",
        artist: "The Weeknd",
        cover: "https://th.bing.com/th/id/OIP.UAz5_qYWsRvoVif8gFo3RgHaHa?rs=1&pid=ImgDetMain",
        duration: "3:35",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Levitating",
        artist: "Dua Lipa",
        cover: "https://th.bing.com/th/id/OIP.69emigpmj81jmPmS9OFOTQHaHa?rs=1&pid=ImgDetMain",
        duration: "3:23",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        cover: "https://th.bing.com/th/id/OIP.4I6ZOQpe6xya9fV6GcllTAHaHa?rs=1&pid=ImgDetMain",
        duration: "2:21",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Montero",
        artist: "Lil Nas X",
        cover: "https://linkstorage.linkfire.com/medialinks/images/1b48487a-e731-48f4-870f-8321deb5774e/artwork-440x440.jpg",
        duration: "2:17",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

// DOM Elements
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');
const autoplayToggle = document.getElementById('autoplay');
const shuffleToggle = document.getElementById('shuffle');

// Audio
const audio = new Audio();
let currentSongIndex = 0;
let isShuffled = false;
let shuffledPlaylist = [];

// Initialize player
function initPlayer() {
    loadSong(songs[currentSongIndex]);
    renderPlaylist();
    
    // Set initial volume
    audio.volume = volumeSlider.value;
    
    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    autoplayToggle.addEventListener('change', toggleAutoplay);
    shuffleToggle.addEventListener('change', toggleShuffle);
    
    // Audio event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onSongEnd);
    audio.addEventListener('loadedmetadata', updateSongInfo);
    audio.addEventListener('play', () => {
        playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    });
    audio.addEventListener('pause', () => {
        playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    });
}

// Load song
function loadSong(song) {
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.audio;
    
    // Reset progress bar
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    
    // Update active playlist item
    updateActivePlaylistItem();
    
    // Play the song if it was playing before
    if (!audio.paused) {
        audio.play().catch(e => console.log('Auto-play prevented:', e));
    }
}

// Update progress bar
function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Format current time
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Set progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Toggle play/pause
function togglePlay() {
    if (audio.paused) {
        audio.play().catch(e => console.log('Play failed:', e));
    } else {
        audio.pause();
    }
}

// Previous song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = isShuffled ? shuffledPlaylist.length - 1 : songs.length - 1;
    }
    const song = isShuffled ? shuffledPlaylist[currentSongIndex] : songs[currentSongIndex];
    loadSong(song);
    audio.play().catch(e => console.log('Play failed:', e));
}

// Next song
function nextSong() {
    currentSongIndex++;
    const playlist = isShuffled ? shuffledPlaylist : songs;
    if (currentSongIndex > playlist.length - 1) {
        currentSongIndex = 0;
    }
    const song = playlist[currentSongIndex];
    loadSong(song);
    audio.play().catch(e => console.log('Play failed:', e));
}

// On song end
function onSongEnd() {
    if (autoplayToggle.checked) {
        nextSong();
    }
}

// Set volume
function setVolume() {
    audio.volume = this.value;
}

// Update song info when loaded
function updateSongInfo() {
    const durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration % 60);
    if (durationSeconds < 10) {
        durationSeconds = `0${durationSeconds}`;
    }
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
}

// Toggle autoplay
function toggleAutoplay() {
    // Logic handled in onSongEnd
}

// Toggle shuffle
function toggleShuffle() {
    isShuffled = this.checked;
    if (isShuffled) {
        // Create shuffled playlist while keeping current song first
        shuffledPlaylist = [...songs];
        const currentSong = shuffledPlaylist.splice(currentSongIndex, 1)[0];
        shuffledPlaylist.sort(() => Math.random() - 0.5);
        shuffledPlaylist.unshift(currentSong);
        currentSongIndex = 0;
    }
    renderPlaylist();
}

// Render playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    const playlist = isShuffled ? shuffledPlaylist : songs;
    
    playlist.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        if (index === currentSongIndex && (!isShuffled || (isShuffled && song.title === songs[currentSongIndex].title))) {
            playlistItem.classList.add('active');
        }
        playlistItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="playlist-info">
                <p class="playlist-title">${song.title}</p>
                <p class="playlist-artist">${song.artist}</p>
            </div>
            <span class="playlist-duration">${song.duration}</span>
        `;
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(song);
            audio.play().catch(e => console.log('Play failed:', e));
        });
        playlistEl.appendChild(playlistItem);
    });
}

// Update active playlist item
function updateActivePlaylistItem() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentSongIndex) {
            item.classList.add('active');
        }
    });
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayer);
