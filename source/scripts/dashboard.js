

(async () => {
    try {
        //  Define the path to the JSON file
        const jsonPath = 'data/entries.json';
        //  Read the JSON file

        //  Parse the JSON data
        const entries = JSON.parse(data);

        const container = document.getElementById('graph-container');
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const startDate = new Date('2024-05-01');
        const monthIndex = startDate.getMonth();
        //  Loop through the days of May
        for (let i = 0; i < daysInMonth[monthIndex - 1]; i += 1) {
            //  Calculate the date for the current day
            const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));

            //  Check if the day exists in the entries
            const dateString = currentDate.toISOString().split('T')[0];
            const mE = entries.filter((entry) => entry.date === dateString);
            const entryCount = mE.length;

            //  Create a day square
            const square = document.createElement('div');
            square.classList.add('square');
            if (entryCount > 0) {
                if (entryCount >= 3) {
                    square.classList.add('most-active');
                } else if (entryCount >= 2) {
                    square.classList.add('more-active');
                } else {
                    square.classList.add('active');
                }
            } else {
                square.classList.add('inactive');
            }

            //  Append the square to the container
            container.appendChild(square);
        }
    } catch (err) {
        console.error('An error occurred while reading the JSON file:', err);
    }
})();
