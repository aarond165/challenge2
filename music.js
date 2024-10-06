// Check if audio is already playing
let audio = null;
let isPlaying = localStorage.getItem('musicPlaying') === 'true';

// On page load
window.addEventListener('load', function () {
    // If audio already exists in localStorage, resume it
    if (!audio) {
        audio = new Audio('river.mp3');
        audio.loop = true;
        audio.volume = 0.1;

        const savedTime = localStorage.getItem('audioTime');
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);  // Resume from the saved position
        }

        if (isPlaying) {
            audio.play();
        }
    }
});

// Save the current state of the music before leaving the page
window.addEventListener('beforeunload', function () {
    localStorage.setItem('audioTime', audio.currentTime);  // Save current time
    localStorage.setItem('musicPlaying', !audio.paused);   // Save play/pause state
});
