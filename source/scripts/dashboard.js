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

