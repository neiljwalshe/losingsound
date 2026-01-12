document.addEventListener('DOMContentLoaded', function() {
    const soundGrid = document.querySelector('.sound-grid');
    const audioPlayers = {};
    const sfxPlayers = {};
    const voteCounts = {};
    const totalVotes = {};
    const userVotes = {}; // Store user votes
    const firebaseConfig = {
        //  Add your firebase config here
        //  apiKey: "YOUR_API_KEY",
        //  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        //  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
        //  projectId: "YOUR_PROJECT_ID",
        //  storageBucket: "YOUR_PROJECT_ID.appspot.com",
        //  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        //  appId: "YOUR_APP_ID",
        //  measurementId: "YOUR_MEASUREMENT_ID"
    };

    // Initialize Firebase
    if (firebaseConfig.apiKey) {
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        //fetchInitialVotes(); // Fetch initial votes from Firebase
    }

    // Generate the sound grid
    for (let i = 1; i <= 15; i++) {
        const soundItem = document.createElement('div');
        soundItem.classList.add('sound-item');

        const icon = document.createElement('img');
        icon.src = 'media/sound-icon.png';
        icon.alt = `Sound ${i}`;
        icon.classList.add('sound-icon');
        icon.dataset.soundId = i;

        const voteButton = document.createElement('button');
        voteButton.classList.add('vote-button');
        voteButton.textContent = 'Vote Now';
        voteButton.dataset.soundId = i;

        const voteCountDisplay = document.createElement('p');
        voteCountDisplay.classList.add('vote-count');
        voteCountDisplay.textContent = '0 votes';
        voteCountDisplay.dataset.soundId = i;

        const votePercentageBar = document.createElement('div');
        votePercentageBar.classList.add('vote-percentage');
        votePercentageBar.dataset.soundId = i;

        soundItem.appendChild(icon);
        soundItem.appendChild(voteButton);
        soundItem.appendChild(voteCountDisplay);
        soundItem.appendChild(votePercentageBar);
        soundGrid.appendChild(soundItem);

        // Initialize audio players
        audioPlayers[`sound${i}`] = new Audio(`media/sound${i}.wav`);
        sfxPlayers[`sfx${i}`] = new Audio(`media/sfx${i}.wav`);
        voteCounts[`sound${i}`] = 0;
        totalVotes[`sound${i}`] = 0;
    }

    // Play SFX on rollover
    soundGrid.addEventListener('mouseover', function(event) {
        const icon = event.target.closest('.sound-icon');
        if (icon) {
            const soundId = icon.dataset.soundId;
            const sfx = sfxPlayers[`sfx${soundId}`];
            sfx.currentTime = 0;
            sfx.play();
        }
    });

    soundGrid.addEventListener('mouseout', function(event) {
        const icon = event.target.closest('.sound-icon');
        if (icon) {
            const soundId = icon.dataset.soundId;
            const sfx = sfxPlayers[`sfx${soundId}`];
            sfx.pause();
            sfx.currentTime = 0;
        }
    });

    // Play sound on icon click
    soundGrid.addEventListener('click', function(event) {
        const icon = event.target.closest('.sound-icon');
        if (icon) {
            const soundId = icon.dataset.soundId;
            const audio = audioPlayers[`sound${soundId}`];
            audio.currentTime = 0;
            audio.play();
        }
    });

    // Handle vote button click
    soundGrid.addEventListener('click', function(event) {
        const button = event.target.closest('.vote-button');
        if (button) {
            const soundId = button.dataset.soundId;
            vote(soundId);
        }
    });

    function vote(soundId) {
        const userId = getUserId(); // Implement this
        if (userVotes[userId] && userVotes[userId][soundId]) {
            alert("You have already voted for this sound.");
            return;
        }

        voteCounts[`sound${soundId}`]++;
        totalVotes[`sound${soundId}`]++;
        userVotes[userId] = userVotes[userId] || {};
        userVotes[userId][soundId] = true;

        // Update vote count display
        const voteCountDisplay = document.querySelector(`[data-sound-id="${soundId}"].vote-count`);
        voteCountDisplay.textContent = `${voteCounts[`sound${soundId}`]} votes`;

        // Update and show vote percentage
        updateVotePercentage(soundId);

        if (firebaseConfig.apiKey) {
            saveVoteToFirebase(soundId, voteCounts[`sound${soundId}`]);
        }
    }

    function updateVotePercentage(soundId) {
        const votePercentageBar = document.querySelector(`[data-sound-id="${soundId}"].vote-percentage`);
        if (totalVotes[`sound${soundId}`] > 0) {
            const percentage = (voteCounts[`sound${soundId}`] / totalVotes[`sound${soundId}`]) * 100;
            votePercentageBar.style.width = `${percentage}%`;
            votePercentageBar.textContent = `${percentage.toFixed(1)}%`;
        } else {
            votePercentageBar.style.width = '0%';
            votePercentageBar.textContent = '';
        }
    }

    // Placeholder for Firebase functions
    function saveVoteToFirebase(soundId, count) {
        if (!firebaseConfig.apiKey) return;
        const soundRef = firebase.database().ref(`votes/${soundId}`);
        soundRef.set(count);
    }

    function fetchInitialVotes() {
        if (!firebaseConfig.apiKey) return;
        const votesRef = firebase.database().ref('votes');
        votesRef.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach(soundId => {
                    voteCounts[`sound${soundId}`] = data[soundId];
                    totalVotes[`sound${soundId}`] = Object.values(data).reduce((sum, count) => sum + count, 0);
                    updateVotePercentage(soundId);
                    const voteCountDisplay = document.querySelector(`[data-sound-id="${soundId}"].vote-count`);
                    voteCountDisplay.textContent = `${voteCounts[`sound${soundId}`]} votes`;
                });
            }
        });
    }

    // Implement a simple userId generator (replace with a more robust solution)
    function getUserId() {
        let id = localStorage.getItem('userId');
        if (!id) {
            id = 'user_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('userId', id);
        }
        return id;
    }

    //Stills Lightbox
    const stillsGrid = document.querySelector('.stills-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeLightbox = document.getElementById('close-lightbox');
    const imageSources = [
        "media/stills-large1-1.png", "media/stills-large1-2.png", "media/stills-large1-3.png",
        "media/stills-large1-4.png", "media/stills-large1-5.png",
        "media/stills1-6.png", "media/stills1-7.png", "media/stills1-8.png", "media/stills1-9.png", "media/stills1-10.png",
        "media/stills1-11.png", "media/stills1-12.png", "media/stills1-13.png", "media/stills1-14.png", "media/stills1-15.png"
    ];

    for (let i = 1; i <= 15; i++) {
        const still = document.createElement('img');
        still.src = `media/stills1-${i}.png`;
        still.alt = `Still ${i}`;
        still.dataset.index = i - 1;
        stillsGrid.appendChild(still);
    }

    stillsGrid.addEventListener('click', (event) => {
        const target = event.target.closest('img');
        if (target) {
            const index = parseInt(target.dataset.index);
            if (index >= 0 && index < imageSources.length) {
                lightboxImage.src = imageSources[index];
                lightbox.style.display = 'flex';
            }
        }
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxImage.src = '';
    });
});