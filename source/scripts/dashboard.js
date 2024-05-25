console.log('Dashboard script loaded');

(async () => {
    try {
        //  Define the path to the JSON file
        const jsonPath = 'data/entries.json';
        console.log('Reading JSON file:', jsonPath);

        //  Read the JSON file
        const data = await window.api.readFile(jsonPath);
        console.log(data);

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
            console.log('Current Date:', currentDate);
            console.log('Entries for Current Date:', mE);
            const entryCount = mE.length;
            console.log('Entry Count:', entryCount);

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

//  bottom had some lint errors
//  console.log('Dashboard script loaded');

//  (async () => {
//      try {
//          //  Define the path to the JSON file
//          const jsonPath = 'data/entries.json';
//          console.log('Reading JSON file:', jsonPath);

//          //  Read the JSON file
//          const data = await window.api.readFile(jsonPath);
//          console.log(data);

//          //  Parse the JSON data
//          const entries = JSON.parse(data);

//          const container = document.getElementById('graph-container');
//          const daysInMonth = [31,29,31,30,31,30,31,31,30,31,30,31];
//          const startDate = new Date('2024-05-01');
//          const monthIndex = startDate.getMonth();
//          //  Loop through the days of May
//          for (let i = 0; i < daysInMonth[monthIndex-1]; i++) {
//              //  Calculate the date for the current day
//              const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));

//              //  Check if the day exists in the entries
//              console.log('Current Date:', currentDate);
//              console.log('Entries for Current Date:', mE);
//              const entryCount = mE.length;
//              console.log('Entry Count:', entryCount);

//              //  Create a day square
//              const square = document.createElement('div');
//              square.classList.add('square');
//              if (entryCount > 0) {
//                  if (entryCount >= 3) {
//                      square.classList.add('most-active');
//                  }else if(entryCount==2){
//                      square.classList.add('more-active');
//                  }
//                  else {
//                      square.classList.add('active');
//                  }
//              } else {
//                  square.classList.add('inactive');
//              }

//              //  Append the square to the container
//              container.appendChild(square);
//          }
//      } catch (err) {
//          console.error('An error occurred while reading the JSON file:', err);
//      }
//  })();

//  /*
//  Old script (for reference):

//  //  Sample data representing contributions per day
//  const contributions = [
//      0, 0, 3, 7, 10, 8, 6,
//      4, 0, 0, 0, 5, 8, 9,
//      12, 7, 4, 0, 0, 0, 2,
//      9, 11, 13, 14, 10, 6, 0,
//      0, 0, 0, 0, 0, 0, 0
//  ];

//  const container = document.getElementById('graph-container');

//  //  Loop through each day and create a square with appropriate class
//  for (let i = 0; i < contributions.length; i++) {
//      const square = document.createElement('div');
//      square.classList.add('square');
//      if (contributions[i] > 0) {
//          if (contributions[i] >= 10) {
//              square.classList.add('more-active');
//          } else{
//              square.classList.add('active');
//          }
//      }
//      square.classList.add('inactive');

//      container.appendChild(square);
//  }

//  */
