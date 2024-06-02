
(async () => {
    try {
        // Define the path to the JSON file
        const jsonPath = 'data/entries.json';

        // Read the JSON file
        const data = await window.api.readFile(jsonPath);

        // Parse the JSON data
        const entries = JSON.parse(data);

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

        // Function to check entries for a given week range
        function checkEntriesForWeek(startOfWeek, endOfWeek) {
            let weekHasEntries = false;
            entries.forEach(entry => {
                const entryDate = new Date(entry.date);
                if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
                    weekHasEntries = true;
                }
            });
            return weekHasEntries;
        }

        // Function to calculate current streak for the past 4 weeks
        function calculateCurrentStreak(startDate) {
            let currentStreak = 0;
            for (let i = 0; i < 5; i++) {
                const endOfWeek = new Date(startDate.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
                const startOfWeek = new Date(endOfWeek.getTime() - (6 * 24 * 60 * 60 * 1000));
                if (checkEntriesForWeek(startOfWeek, endOfWeek)) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            return currentStreak;
        }

        const today = new Date();
        const currentStreak = calculateCurrentStreak(today);
        console.log('Calculated current streak:', currentStreak);  // Debugging statement

        // Update streak image based on the current streak length
        updateStreakImage(currentStreak);

    } catch (err) {
        console.error('An error occurred while reading the JSON file:', err);
    }
})();

function updateStreakImage(streakLength) {
    const streakImage = document.getElementById('streakImage');
    let imagePath = '';
    if(streakLength ==1){
        imagePath = 'images/1is.png'
    }
    else if(streakLength ==2){
        imagePath = 'images/2is.png'
    }
    else if(streakLength ==3){
        imagePath = 'images/3is.png'
    }
    else if(streakLength ==4){
        imagePath = 'images/4is.png'
    }
    else {
        imagePath = 'images/5is.png'
    }

  

    console.log('Setting image path to:', imagePath);  // Debugging statement
    streakImage.src = imagePath;
}

