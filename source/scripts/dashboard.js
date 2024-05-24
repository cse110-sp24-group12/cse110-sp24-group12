console.log('Dashboard script loaded');
(async () => {
    try {
        // Define the path to the JSON file
        const jsonPath = 'data/entries.json';
        console.log('Reading JSON file:', jsonPath);

        // Read the JSON file
        const data = await window.api.readFile(jsonPath);
        console.log(data)

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

        const container = document.getElementById('graph-container');

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

/*
Old script (for reference):

// Sample data representing contributions per day
const contributions = [
    0, 0, 3, 7, 10, 8, 6,
    4, 0, 0, 0, 5, 8, 9,
    12, 7, 4, 0, 0, 0, 2,
    9, 11, 13, 14, 10, 6, 0,
    0, 0, 0, 0, 0, 0, 0
];

const container = document.getElementById('graph-container');

// Loop through each day and create a square with appropriate class
for (let i = 0; i < contributions.length; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    if (contributions[i] > 0) {
        if (contributions[i] >= 10) {
            square.classList.add('more-active');
        } else{
            square.classList.add('active');
        }
    }
    square.classList.add('inactive');

    container.appendChild(square);
}

*/