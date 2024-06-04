(async () => {
    try {
        // Define the path to the JSON file
        const jsonPath = 'data/entries.json';

        // Read the JSON file
        const data = await window.api.readFile(jsonPath);
        console.log('Raw data:', data);  // Debugging statement

        // Parse the JSON data
        const entries = JSON.parse(data);
        console.log('Parsed entries:', entries);  // Debugging statement

        const container = document.getElementById('graph-container');
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const startDate = new Date('2024-05-01');
        const monthIndex = startDate.getMonth();

        // Loop through the days of May
        for (let i = 0; i < daysInMonth[monthIndex - 1]; i++) {
            // Calculate the date for the current day
            const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));

            // Check if the day exists in the entries
            const matchingEntries = entries.filter(entry => entry.date === currentDate.toISOString().split('T')[0]);
            const entryCount = matchingEntries.length;

            // Create a day square
            const square = document.createElement('div');
            square.classList.add('square');
            if (entryCount > 0) {
                if (entryCount >= 3) {
                    square.classList.add('most-active');
                } else if (entryCount === 2) {
                    square.classList.add('more-active');
                } else {
                    square.classList.add('active');
                }
            } else {
                square.classList.add('inactive');
            }

            // Append the square to the container
            container.appendChild(square);
        }

        const currentStreak = calculateConsecutiveDayStreak(entries);
        console.log('Calculated current streak:', currentStreak);  // Debugging statement

        // Update the streak number in the navbar
        const streakElement = document.getElementById('streakNumber');
        if (streakElement) {
            streakElement.textContent = currentStreak;
        } else {
            console.error('Element with id "streakNumber" not found.');
        }

        // Update streak image based on the current streak length
        updateStreakImage(currentStreak);

        // Display bookmarked entries
        const bookmarkedContainer = document.getElementById('bookmarked-entries-container');
        if (bookmarkedContainer) {
            const bookmarkedEntries = entries.filter(entry => entry.bookmarked);

            bookmarkedEntries.forEach(entry => {
                
                const entryElement = document.createElement('div');
                entryElement.classList.add('entry');
                entryElement.innerHTML = `
                    <img src="images/filledBookmark.png" alt="Bookmark" class="bookmark-icon">
                    <div class="entry-details">
                        <p class="entry-title">${entry.title}</p>
                        <p class="entry-date">${new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                `;
                bookmarkedContainer.appendChild(entryElement);
                
            });
        } else {
            console.error('Element with id "bookmarked-entries" not found.');
        }
    } catch (err) {
        console.error('An error occurred while reading the JSON file:', err);
    }
})();

// Function to calculate consecutive day streak from today
function calculateConsecutiveDayStreak(entries) {
    if (entries.length === 0) return 0;

    // Normalize entry dates to the start of the day, increase by one day, and convert to Set for O(1) lookups
    const entryDates = new Set(entries.map(entry => {
        const date = new Date(entry.date);
        date.setDate(date.getDate() + 1); // Increase the date by one day
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split('T')[0];
    }));

    let currentStreak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    console.log('Entry dates:', [...entryDates]); // Debugging statement

    // Loop backwards from today
    while (true) {
        const todayStr = today.toISOString().split('T')[0];
        console.log(`Checking date: ${todayStr}`); // Debugging statement
        if (entryDates.has(todayStr)) {
            currentStreak++;
            console.log(`Streak incremented to: ${currentStreak}`); // Debugging statement
        } else {
            console.log('No entry found. Breaking the loop.'); // Debugging statement
            break; // Break the loop if there is a day without an entry
        }
        // Move to the previous day
        today.setDate(today.getDate() - 1);
    }

    return currentStreak;
}

function updateStreakImage(streakLength) {
    const streakImage = document.getElementById('streakImage');
    let imagePath = '';
    if (streakLength < 7) {
        streakImage.style.display = 'none';
    } else if (streakLength < 14) {
        imagePath = 'images/1is.png';
    } else if (streakLength < 21) {
        imagePath = 'images/2is.png';
    } else if (streakLength < 28) {
        imagePath = 'images/3is.png';
    } else if (streakLength < 35) {
        imagePath = 'images/4is.png';
    }  else if (streakLength < 60) {
        imagePath = 'images/6is.png';
    } else {
        imagePath = 'images/7is.png';
    }

    console.log('Setting image path to:', imagePath);  // Debugging statement
    streakImage.src = imagePath;
}
const modal = document.getElementById('myModal');
const img = document.getElementById('triggerPopup');
const span = document.getElementsByClassName('close')[0];
const container = document.querySelector('.container');

// Listens for when the dashboard button is clicked, to link to dashboard page
const dashboardButton = document.getElementById('dashboardLink');
dashboardButton.addEventListener('click', () => {
    // Link to dashboard here
    window.api.loadHtmlFile('calendar.html');
});
img.onclick = () => {
    modal.style.display = 'block';
    container.style.display = 'none';
};
span.onclick = () => {
    modal.style.display = 'none';
    container.style.display = 'flex';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        container.style.display = 'flex';
    }
};