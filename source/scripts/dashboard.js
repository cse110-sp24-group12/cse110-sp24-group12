const dateConversion = (date) => {
    const parts = date.split('-');
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[0], 10);
    return `${month}-${day}-${year}`;
};

// Function to calculate consecutive day streak
function calculateConsecutiveDayStreak(entries) {
    if (entries.length === 0) return 0;

    // Sort entries by date
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < entries.length; i += 1) {
        const prevDate = new Date(entries[i - 1].date);
        const currDate = new Date(entries[i].date);
        const diffInDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffInDays === 1) {
            currentStreak += 1;
        } else {
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            currentStreak = 1;
        }
    }

    // Check last streak
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
    }

    return maxStreak;
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
    } else {
        imagePath = 'images/5is.png';
    }

    console.log('Setting image path to:', imagePath); // Debugging statement
    streakImage.src = imagePath;
}

(async () => {
    try {
        // Define the path to the JSON file
        // Define the path to the JSON file
        const jsonPath = 'data/entries.json';

        // Read the JSON file
        let data = await window.api.readFile(jsonPath);
        console.log('Raw data:', data);  // Debugging statement

        // Parse the JSON data
        let entries = JSON.parse(data);
        console.log('Parsed entries:', entries);  // Debugging statement

        // Initial render for the current month
        const currentMonth = new Date().getMonth() + 1;
        renderGraph(entries, currentMonth);
        updateStreak(entries);

        // Populate the month dropdown
        const monthDropdown = document.getElementById('monthDropdown');
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = new Date(2024, i - 1).toLocaleString('default', { month: 'long' });
            monthDropdown.appendChild(option);
        }
        monthDropdown.value = currentMonth;

        // Event listener for month change
        monthDropdown.addEventListener('change', (event) => {
            const selectedMonth = parseInt(event.target.value, 10);
            renderGraph(entries, selectedMonth);
        });

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
                    </div>
                    <div class="entry-date-delete">
                        <p class="entry-date">${new Date(entry.date).toLocaleDateString()}</p>
                        <button class="delete-button" data-id="${entry.id}"><img src="images/cross.png" alt="Delete" class="cross-icon"></button>
                    </div>
                `;
                bookmarkedContainer.appendChild(entryElement);

                // Add event listener for delete button
                entryElement.querySelector('.delete-button').addEventListener('click', async (event) => {
                    const entryId = event.target.closest('.delete-button').getAttribute('data-id');
                    console.log('Delete entry with ID:', entryId);
                    // Remove the entry from the entries array
                    entries = entries.filter(entry => entry.id !== entryId);
                    // Update the JSON file
                    await window.api.writeFile(jsonPath, JSON.stringify(entries, null, 2));
                    // Remove the entry element from the DOM
                    bookmarkedContainer.removeChild(entryElement);
                    // Recalculate streak and update UI
                    const selectedMonth = parseInt(document.getElementById('monthDropdown').value, 10);
                    renderGraph(entries, selectedMonth);
                    updateStreak(entries);
                    
                });
            });
        } else {
            console.error('Element with id "bookmarked-entries" not found.');
        }
    } catch (err) {
        console.error('An error occurred while reading the JSON file:', err);
    }
})();

function renderGraph(entries, month) {
    const container = document.getElementById('graph-container');
    container.innerHTML = ''; // Clear previous graph
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const startDate = new Date(`2024-${month.toString().padStart(2, '0')}-01`);
    const monthIndex = startDate.getMonth();

    // Loop through the days of the selected month
    for (let i = 0; i < daysInMonth[monthIndex]; i++) {
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
}

function updateStreak(entries) {
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
}

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
    } else if (streakLength < 60) {
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
const container = document.querySelector('.container-wrapper');

// Listens for when the dashboard button is clicked, to link to dashboard page
const dashboardButton = document.getElementById('dashboardLink');
dashboardButton.addEventListener('click', () => {
    // Link to dashboard here
    window.api.loadHtmlFile('calendar.html');
});
img.onclick = () => {
    modal.style.display = 'block';
   // container.style.visibility = 'hidden';
};
span.onclick = () => {
    modal.style.display = 'none';
    container.style.visibility = 'visible';
    // Re-render graph and streaks after closing help modal
    const selectedMonth = parseInt(document.getElementById('monthDropdown').value, 10);
    renderGraph(entries, selectedMonth);
    updateStreak(entries);
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        container.style.visibility = 'visible';
        // Re-render graph and streaks after closing help modal
        const selectedMonth = parseInt(document.getElementById('monthDropdown').value, 10);
        renderGraph(entries, selectedMonth);
        updateStreak(entries);
    }
};
