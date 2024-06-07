const dateConversion = (date) => {
    const parts = date.split('-');
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[0], 10);
    return `${month}-${day}-${year}`;
};

function renderGraph(entries, month) {
    const container = document.getElementById('graph-container');
    container.innerHTML = ''; // Clear previous graph
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const startDate = new Date(`2024-${month.toString().padStart(2, '0')}-01`);
    const monthIndex = startDate.getMonth();

    // Loop through the days of the selected month
    for (let i = 0; i < daysInMonth[monthIndex]; i += 1) {
        // Calculate the date for the current day
        const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));

        const currentDateConverted = dateConversion(currentDate.toISOString().split('T')[0]);

        // Check if the day exists in the entries
        const matchingEntries = entries.filter((entry) => entry.date === currentDateConverted);
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
    } else if (streakLength < 42) {
        imagePath = 'images/5is.png';
    } else if (streakLength < 49) {
        imagePath = 'images/6is.png';
    } else if (streakLength < 60) {
        imagePath = 'images/7is.png';
    } else {
        imagePath = 'images/8is.png';
    }

    console.log('Setting image path to:', imagePath); // Debugging statement
    streakImage.src = imagePath;
}

function updateStreak(entries) {
    const currentStreak = calculateConsecutiveDayStreak(entries);
    console.log('Calculated current streak:', currentStreak); // Debugging statement

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

async function openEntryModal(entry) {
    const modal = document.getElementById('entryModal');
    const contentInput = document.getElementById('markdown-container');

    const markdownContent = await window.api.readMarkdown(entry.fileName);

    contentInput.innerHTML = markdownContent;

    modal.style.display = 'block';

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

let entries;

(async () => {
    try {
        // Define the path to the JSON file
        // Define the path to the JSON file
        const jsonPath = 'data/entries.json';

        // Read the JSON file
        const data = await window.api.readFile(jsonPath);
        console.log('Raw data:', data); // Debugging statement

        // Parse the JSON data
        entries = JSON.parse(data);
        console.log('Parsed entries:', entries); // Debugging statement

        // Initial render for the current month
        const currentMonth = new Date().getMonth() + 1;
        renderGraph(entries, currentMonth);
        updateStreak(entries);

        // Populate the month dropdown
        const monthDropdown = document.getElementById('monthDropdown');
        for (let i = 1; i <= 12; i += 1) {
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
            const bookmarkedEntries = entries.filter((entry) => entry.bookmarked);

            bookmarkedEntries.forEach((entry) => {
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

                entryElement.addEventListener('click', () => {
                    openEntryModal(entry);
                });

                // Add event listener for delete button
                entryElement.querySelector('.delete-button').addEventListener('click', async (event) => {
                    event.stopPropagation();
                    // Remove the entry from the entries array
                    entries = entries.filter((ent) => ent.id !== entry.id);

                    // // Remove the entry element from the DOM
                    bookmarkedContainer.removeChild(entryElement);

                    // Delete the entry from the database
                    await window.api.deleteEntryByTitleAndDate([entry.title, entry.date]);

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
