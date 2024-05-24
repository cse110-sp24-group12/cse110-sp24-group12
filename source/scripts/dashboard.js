(async () => {
    try {
        // Define the path to the JSON file
        const jsonPath = '../data/entries.json';

        // Read the JSON file
        const data = await window.api.readFile(jsonPath);

        // Parse the JSON data
        const entries = JSON.parse(data);

        // Create an object where the keys are the dates and the values are the number of entries for each date
        const contributions = entries.reduce((acc, entry) => {
            const date = entry.date;
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});

        // Loop through each day and create a square with appropriate class
        for (let date in contributions) {
            const square = document.createElement('div');
            square.classList.add('square');
            if (contributions[date] > 0) {
                if (contributions[date] >= 10) {
                    square.classList.add('more-active');
                } else {
                    square.classList.add('active');
                }
            } else {
                square.classList.add('inactive');
            }

            container.appendChild(square);
        }
    } catch (err) {
        console.error('An error occurred while reading the JSON file:', err);
    }
})();