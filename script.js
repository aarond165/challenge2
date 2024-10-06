const form = document.querySelector('#storyForm');
const archiveContainer = document.getElementById('archiveContainer');

// Generate a unique ID for each story (for unique counter tracking)
function generateUniqueId() {
    return 'story-' + Math.random().toString(36).substr(2, 9);
}

// Function to load stories and display them in the archive container
function loadStories() {
    if (!archiveContainer) return;

    archiveContainer.innerHTML = ""; // Clear the container
    const stories = JSON.parse(localStorage.getItem("stories")) || [];

    if (stories.length === 0) {
        archiveContainer.innerHTML = "<p>No stories have been submitted yet.</p>";
        return;
    }

    stories.forEach((story, index) => {
        const storyCard = document.createElement('div');
        storyCard.classList.add('story-card');

        storyCard.innerHTML = `
            <div class="story-header">
                <span class="prompt-label">${story.prompt}</span>
                <button class="delete-btn" data-index="${index}">&times;</button>
            </div>
            <p class="story-text">${story.story}</p>
            <p><strong>${story.name}</strong> - <time>${story.date}</time></p>
            <div class="story-buttons">
                <button class="me-too-btn" data-id="${story.id}">
                    <img src="thumb.png" alt="Thumbs Up" class="thumbs-up-icon"> Me Too
                    <span class="me-too-counter">0</span>
                </button>
                <button class="heart-btn" data-id="${story.id}">
                    <img src="pheart.png" alt="Heart Icon" class="heart-icon"> Heart
                    <span class="heart-counter">0</span>
                </button>
            </div>
        `;

        // Add delete functionality
        const deleteBtn = storyCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteStory(story.id));

        // Get Me Too and Heart button references
        const meTooBtn = storyCard.querySelector('.me-too-btn');
        const heartBtn = storyCard.querySelector('.heart-btn');
        const meTooCounter = storyCard.querySelector('.me-too-counter');
        const heartCounter = storyCard.querySelector('.heart-counter');

        // Load previous counts (if any) from localStorage
        const meTooCount = localStorage.getItem(`meToo-${story.id}`) || 0;
        const heartCount = localStorage.getItem(`heart-${story.id}`) || 0;

        meTooCounter.textContent = meTooCount;
        heartCounter.textContent = heartCount;

        // Check if the user has already clicked Me Too or Heart for this story
        const meTooClicked = localStorage.getItem(`meTooClicked-${story.id}`) === 'true';
        const heartClicked = localStorage.getItem(`heartClicked-${story.id}`) === 'true';

        // Disable buttons if already clicked
        if (meTooClicked) {
            meTooBtn.disabled = true;
            meTooBtn.style.opacity = '0.6';
        }

        if (heartClicked) {
            heartBtn.disabled = true;
            heartBtn.style.opacity = '0.6';
        }

        // Increment "Me Too" count on click
        meTooBtn.addEventListener('click', () => {
            if (!meTooClicked) {
                let count = parseInt(meTooCounter.textContent);
                count++;
                meTooCounter.textContent = count;
                localStorage.setItem(`meToo-${story.id}`, count);
                localStorage.setItem(`meTooClicked-${story.id}`, 'true');
                meTooBtn.disabled = true;
                meTooBtn.style.opacity = '0.6'; // Visually disable
            }
        });

        // Increment "Heart" count on click
        heartBtn.addEventListener('click', () => {
            if (!heartClicked) {
                let count = parseInt(heartCounter.textContent);
                count++;
                heartCounter.textContent = count;
                localStorage.setItem(`heart-${story.id}`, count);
                localStorage.setItem(`heartClicked-${story.id}`, 'true');
                heartBtn.disabled = true;
                heartBtn.style.opacity = '0.6'; // Visually disable
            }
        });

        archiveContainer.appendChild(storyCard);
    });
}

// Submit form and store story in localStorage
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const prompt = document.querySelector('input[name="prompt"]:checked').value;
        const name = document.getElementById("name").value || "Anonymous";
        const storyText = document.getElementById("story").value;

        const newStory = {
            id: generateUniqueId(),
            prompt: prompt,
            name: name,
            story: storyText,
            date: new Date().toLocaleString()
        };

        let stories = JSON.parse(localStorage.getItem("stories")) || [];
        stories.push(newStory);
        localStorage.setItem("stories", JSON.stringify(stories));

        form.reset(); // Clear the form after submission
        loadStories(); // Reload stories to display the new one
    });
}

// Function to delete a story
function deleteStory(storyId) {
    let stories = JSON.parse(localStorage.getItem("stories")) || [];
    stories = stories.filter(story => story.id !== storyId);
    localStorage.setItem("stories", JSON.stringify(stories)); // Update localStorage

    // Remove related Me Too and Heart counters from localStorage
    localStorage.removeItem(`meToo-${storyId}`);
    localStorage.removeItem(`heart-${storyId}`);
    localStorage.removeItem(`meTooClicked-${storyId}`);
    localStorage.removeItem(`heartClicked-${storyId}`);

    loadStories(); // Reload stories to reflect changes
}

// Only load stories when on archive.html
window.onload = function () {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'archive.html') {
        loadStories(); // Load stories only if on archive.html
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const clouds = [
        { id: 'cloud1', duration: 20 },
        { id: 'cloud2', duration: 25 },
        { id: 'cloud3', duration: 30 },
        { id: 'cloud4', duration: 35 } // Add more clouds as needed
    ];

    // Restore cloud positions when the page loads
    clouds.forEach(({ id, duration }) => {
        const cloudElement = document.getElementById(id);
        const savedTime = localStorage.getItem(`cloud-${id}-time`);
        if (savedTime) {
            const timePassed = (Date.now() - savedTime) / 1000;
            const position = (timePassed % duration) / duration;
            cloudElement.style.animationDelay = `-${position * duration}s`;
        }
    });

    // Save cloud positions when the user leaves the page
    window.addEventListener('beforeunload', () => {
        clouds.forEach(({ id }) => {
            localStorage.setItem(`cloud-${id}-time`, Date.now());
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const clouds = [
        { id: 'cloud1', duration: 20 },
        { id: 'cloud2', duration: 25 },
        { id: 'cloud3', duration: 30 },
        { id: 'cloud4', duration: 35 }
    ];

    clouds.forEach(({ id, duration }) => {
        const cloudElement = document.getElementById(id);

        // Retrieve the saved start time
        const savedTime = localStorage.getItem(`cloud-${id}-start-time`);
        let currentTime = Date.now();

        if (savedTime) {
            const elapsed = (currentTime - savedTime) / 1000;
            const animationDelay = -(elapsed % duration);

            // Set the animation to continue from where it left off
            cloudElement.style.animationDelay = `${animationDelay}s`;
        }

        // Save the start time in localStorage when the page loads
        localStorage.setItem(`cloud-${id}-start-time`, currentTime);
    });

    // Save the cloud positions in localStorage when the user leaves the page
    window.addEventListener('beforeunload', () => {
        clouds.forEach(({ id }) => {
            localStorage.setItem(`cloud-${id}-start-time`, Date.now());
        });
    });
});
