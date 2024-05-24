/**
 * updateCellLocalStorage
 *
 * @function
 * @param {string} cell - the namespace and name of the event
 * @param {string} eventToDelete - the id of the event
 * @returns {void}
 *                  Deletes a designated button from the HTML.
 */
function updateCellLocalStorage(cell, eventToDelete) {
    // For documentation on these functions, see `../main.js` <- &&& This is for imported functions
    
    // declare 'data'  to take in 
    const data = localStorage.getItem(cell);
    const dataArray = data.split('</button> ');
    if (dataArray.length === 1) {

    // in the case that there was only the one button we just clear everything
        console.log('We have one button, so we clear out the cell');
        localStorage.removeItem(cell);
        return;
    }
    let updatedData = '';
    const { length } = dataArray;
    for (let i = 0; i < length; i += 1) {
        const current = dataArray[i];
        console.log('This is the value of current', current);
        if (current === `<button class='entryButton' id=${eventToDelete}>${eventToDelete.split('.')[0]}`) {
            // we have found the part we want to delete
            // dont do anything
        } else {
            updatedData += `${current}</button>`;
        }
    }
    localStorage.setItem(cell, updatedData);
}

/**
 * formatButtons - reformats buttons so that only 3 display on each cell
 *
 * @function
 * @param {string} htmlString - the current HTML string of buttons in a given cell
 * @param {string} id - the id of the "extra" button (formatted as "extra.<date of cell>")
 * @returns {string} upDatedData - reformatted HTML string with trunkated entry buttons and "extra" button appended
 * @returns {string} htmlString - the current HTML string of buttons in a given cell (if entry button limit has not exceeded)
 *                  Checks for the number of buttons on a given cell; if the total is
 *                  more than 3 buttons, the third button is replaced with an "extra"
 *                  button that will redirect user to a list of all entry buttons for 
 *                  that day, in another modal window. 
 */
function formatButtons(htmlString, extraId){
    const dataArray = htmlString.split('</button>');
    console.log("Should format button display");
    console.log("length<", dataArray.length);
    if(dataArray.length > 3){
        console.log("should reduce number of visible buttons");
        //show only 2 buttons and then a ... if we have more than 3 entries
        let updatedData = dataArray[0]+"</button>" + dataArray[1] + "</button>";//re-attach button tags
        updatedData += "<button id ='"+extraId+"' class = 'extra'>...</button>";
        return updatedData;
    }
    else{
        return htmlString;
    }
}

function changeCellStorage(date, oldName, newName){
    let data = localStorage.getItem(date);
    let newData = data.replace(oldName+".", newName+".").replace(oldName+"<", newName+"<");//should replace exactly 2x
    localStorage.setItem(date, newData);
}

/**
 * Listen for DOMContentLoaded
 *
 * @type {document} - the target of the event
 * @listens document#DOMContentLoaded - the namespace and name of the event
 *                  Listens for DOMContentLoaded, and contains all called functions.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set HTMLElements to elements in JS
    const monthSelect = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const calendarContainer = document.getElementById('calendar');
    const clearDataButton = document.getElementById('clearBtn');
    const entryButtons = document.getElementsByClassName('entryButton');
    const extraButtons = document.getElementsByClassName('extra');
    // Set current month and year as initial values
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Month is zero-based
    const currentYear = currentDate.getFullYear();

    // Set initial values for month and year inputs
    monthSelect.value = currentMonth.toString();
    yearInput.value = currentYear.toString();

    /**
     * generateCalendar - generate the Calendar by inserting HTML into main.
     * @function
     * @returns {void}
     *                  It modifies the HTML to create the calendar layout.
     */
    function generateCalendar() {
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearInput.value, 10);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Start with adding top row, days of the week
        let calendarHTML = '<thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody></tbody><tr>';

        // Add empty cells for days before the first day of the month
        let count = 0;
        for (count = 0; count < firstDay; count += 1) {
            calendarHTML += "<td id='emptyCell'></td> ";
        }

        // Add cells for all other days of the month
        for (let day = 1; day <= daysInMonth; day += 1) {
            // (condition) ? expression on true : expression on false
            if (count % 7 === 0) {
                calendarHTML += ' </tr> <tr>';// creates a new row
            }
            let fill;
            const memory = localStorage.getItem(`${month + 1}/${day}/${year}`);
            // check what was stored for that day
            if (memory === null) {
                fill = day;
            } else {
                fill = day + formatButtons(memory, `extra.${month + 1}/${day}/${year}`);
            }
            calendarHTML += `<td id='${month + 1}/${day}/${year}' class='mouseOut standardCell'  >${fill}</td> `;
            count += 1;
        }
        calendarHTML += '</tr></tbody>';
        calendarContainer.innerHTML = calendarHTML;
    }
    
    // update calendar anytime user changes the month or year
    monthSelect.addEventListener('change', generateCalendar);
    yearInput.addEventListener('input', generateCalendar);

    // Generate calendar on page load, with current date set to default
    generateCalendar();

    /**
     * openModal - will open up a modal window with text box and title box
     * @function
     * @param {event} event - the event object, allowing access to it's target id.
     * @returns {void}
     *                  Opens modal window and allows user to make entries. 
     */
    function openModal(event) {
        // testing to see if we're clicking through our buttons
        console.log('you opened the modal');
        console.log('this is the id of what you clicked on', event.target.id);
        console.log('this is the class what you clicked on:', event.target.classList);
        
        // split id ("<name>.<date>")
        const infoArray = event.target.id.split('.');
        let name = null;
        let date;

        // check length of infoArray to see if entry exists, or is new
        let editing = false;
        if (infoArray.length === 2) {
            // this means we are working with existing event
            [name, date] = infoArray;
            editing = true;
        } else {
            [date] = infoArray;
        }

        /* *** BRAINSTORM FOR DELETE FUNCTIONALITY ***
         * event.target.id is either... name4/2/2003 <-this is on clicking on saved event
         * or it may be 4/2/2003 <-this is clicking on empty cell
         * therefore possibleName can either be name4 or 4 depending on if we clicked
         * we need to identify if user clicked on a old event, or is creating a new one
         * if they clicked on an old event, we should include new option, delete button
         * we should also make the name of the event unchangable, or at least ask for a confirmation
        */

        // pull elements from HTML for the modal window
        const modal = document.getElementById('myModal');
        const span = document.getElementById('closeModal');
        const text = document.getElementById('modalTxt');
        const saveMarkDown = document.getElementById('save-markdown');
        const markdownInput = document.getElementById('markdown');
        const title = document.getElementById('entryTitle');

        if (name === null) {
            // clear out all old data
            markdownInput.value = null;
            title.value = null;
        } else {
            // reenter old data
            // we need to make a button
            markdownInput.value = localStorage.getItem(event.target.id);
            title.value = event.target.innerHTML;
        }

        modal.style.display = 'block';
        // show date on the modals inner html (top left)
        text.innerHTML = date;
        if (name != null) {
            text.innerHTML += "<button id='deleteEntryButton'>Delete Entry</button>";// add class here for styling?
            const deleteEntryButton = document.getElementById('deleteEntryButton');
            deleteEntryButton.addEventListener('click', () => {
            // should add a confirm choice to make sure it wasnt misclick
                localStorage.removeItem(event.target.id);// this clears the entry
                // then update using setItem, and put our new string
                // do we make a helper function?
                updateCellLocalStorage(date, event.target.id);
                modal.style.display = 'none';
                generateCalendar();
            });
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = 'none';
        };

        
        /**
        * Listens for click of the saveMarkDown button.
        *
        * @type {HTMLElement} - the target of the event, being the save button
        * @listens onclick
        *                  When a user clicks the "Save as Markdown" button, 
        *                  the popup closees, adds the new entry to storage, and
        *                  calls generateCalendar() to update it.  
        */
        saveMarkDown.onclick = () => {

            // look for user input in the title, alert on following disallowed cases:
            // empty title, includes ".", includes " "
            if (title.value === '') {
                alert('You must add a title!'); // eslint-disable-line no-alert
            } else if (title.value.includes('.') || title.value.includes(' ')) {
                alert('Cannot use "." symbol or " " (spaces) within title, please update your title.'); // eslint-disable-line no-alert
            } else {
                // We enter this else if we are ready to close and save

                // close popup
                modal.style.display = 'none';
                
                // get entry from local storage
                let localStorageFill = localStorage.getItem(date);
                if(!editing){
                // check if there is an existing entry on this day; 
                //  else, append button to HTML string, and update local storage
                    if (localStorageFill === null) {

                    // if no entry exists, set current date/title to first entry
                        localStorageFill = `<button class='entryButton' id=${title.value}.${date}>${title.value}</button>`;

                    }
                    else if (localStorageFill.includes(`id=${title.value}.${date}`)) {
                    /**
                     * &&& title bug -- prevents user from editing an existing entry
                     * potential fix: "alert" with text next to button prompting to click button again to confirm.
                     *                 less annoying than having to click accept or okay like our other alerts.
                     */
                    
                        alert('An entry already exists with this name.'); // eslint-disable-line no-alert

                    } else {
                    // append new entry button to the HTML string
                        localStorageFill += `<button class='entryButton' \
                      id=${title.value}.${date}>${title.value}</button>`;
                    }
                // update local storage with new entry buttons, update calendar using generateCalendar()
                    localStorage.setItem(date, localStorageFill);
                    localStorage.setItem(`${title.value}.${date}`, markdownInput.value);
                }
                else{
                    console.log("We are editing");
                    if(title.value != name){
                        console.log("We should be updating the title here!", name, title.value);
                        //the user has updated the title, act accordingly
                        localStorage.removeItem(`${name}.${date}`);
                        changeCellStorage(date, name, title.value);
                    }
                    localStorage.setItem(`${title.value}.${date}`, markdownInput.value);
                }
                
                generateCalendar();
            }
        };

        /**
        * Listens for click outside of modal window, closes if detected
        *
        * @type {HTMLElement} - the target of the event, being outside the modal
        * @listens onclick - name of the event, also referred to as "modalOutsideClick"
        *                   Changes entry modal display to none, when a user clicks outside
        *                   of the window, hiding it from view. 
        */
        window.onclick = (modalOutsideClick) => {
            if (modalOutsideClick.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // create/update modal to view extended list of entries
    /**
     * openExtraModal - will open up a modal window with extended list of entries
     * @function
     * @param {event} event - the event object, allowing access to it's target id.
     * @returns {void}
     *                  Opens modal window and allows user to view/select full list
     *                  of entries from a given cell. 
     */
    function openExtraModal(event){
        const modal = document.getElementById('extraModal');
        const span = document.getElementById('closeExtra');
        const extraButtons = document.getElementById('extraButtons');
        let [,date] = event.target.id.split(".");
        extraButtons.innerHTML = localStorage.getItem(date);
        modal.style.display='block';
        console.log("This is the content that we want to show on our modal:", localStorage.getItem(date));

        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (modalOutsideClick) => {
            if (modalOutsideClick.target === modal) {
                modal.style.display = 'none';
            }
        };

            //Event listeners for the entry buttons ("Save as Markdown/Task")
    for (let i = 0; i < entryButtons.length; i += 1) {
        entryButtons[i].addEventListener('click', (entryButtonClick) => {
            console.log(`This is the entry button you just clicked:${entryButtons[i].id}this is the index:${i}`); // &&& Keeps logging way too many clicks
            // this is to prevent the cell under from being clicked after we click a button
            entryButtonClick.stopPropagation();
            modal.style.display = 'none';
            openModal(entryButtonClick);
        });
    }


    }
    
    /**
    * Listens for mouseover of elements in the calendar.
    *
    * @type {HTMLElement} - the event target is whatever element is being hovered in the calendar
    * @listens mouseover - the namespace and name of the event
    * @returns {void}
    *                   Adds/removes appropriate classes from a standard cell, listens for when
    *                   a user clicks on a cell and opens the entry modal.
    */
    calendarContainer.addEventListener('mouseover', (event) => {
        // testing to check for mouse hover on calendar
        console.log('Some mouse hover event happened');
        const { target } = event;

        // set conditions for when a standard cell is hovered
        if (target.classList.contains('standardCell')) {
            console.log('Hovered over a standardCell');// show that we hovered over a standardCell
            target.classList.remove('mouseOut');
            target.classList.add('mouseIn');

            // When user clicks on specific day cell to open modal window
            target.addEventListener('click', (dayCell) => openModal(dayCell));
        }
    });

    // Event listener for the click of clear data button, clears all local storage; exclusively for development and testing
    clearDataButton.addEventListener('click', () => {
        localStorage.clear();
        generateCalendar();
    });

    // Event listeners for the entry buttons ("Save as Markdown/Task")
    // closes the entry modal when clicked
    for (let i = 0; i < entryButtons.length; i += 1) {
        entryButtons[i].addEventListener('click', (entryButtonClick) => {
            console.log(`This is the entry button you just clicked:${entryButtons[i].id}this is the index:${i}`); // &&& Keeps logging way too many clicks
            // this is to prevent the cell under from being clicked after we click a button
            entryButtonClick.stopPropagation();
            openModal(entryButtonClick);
        });
    }

    /**
     * Listen for mouseout event on a given element in the calendar.
     *
     * @type {HTMLElement} - the target of the event
     * @listens mouseout - the namespace and name of the event
     * @returns {void}
     *                  Listen for mouseout event on a given element in the calendar,
     *                  adds/removes respective classes for any standard cells, and
     *                  listens for when a cell's "extra" button is clicked and opens
     *                  a its modal. 
     */
    calendarContainer.addEventListener('mouseout', (event) => {
        const { target } = event;

        // looks for standard (dated) cells
        if (target.classList.contains('standardCell')) {

            // add/remove respective classes
            target.classList.remove('mouseIn');
            target.classList.add('mouseOut');

            // &&& what exactly is this doing? Commented out and tested but
            // didn't seem to change anything surface-level
            const taskButton = target.querySelector('.task-button');
            if (taskButton) {
                target.removeChild(taskButton);
            }

            const markdownButton = target.querySelector('.markdown-button');
            if (markdownButton) {
                target.removeChild(markdownButton);
            }
            
            //Event listeners for the "extra" buttons on each cell ("...")
            for(let i = 0; i < extraButtons.length; i+=1){
                extraButtons[i].addEventListener('click', (extraButtonClick) =>{
                   console.log(`This is the extra button you just clicked:${extraButtons[i].id}this is the index:${i}`);
                   extraButtonClick.stopPropagation();
                   openExtraModal(extraButtonClick);
                });
            }
            
            
        }
    });
});
