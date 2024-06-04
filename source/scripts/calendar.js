// get the version number when user create entries with duplicate titles
// this will help titles  have the form: title(#) where # is the ver number
async function findVersionNumber(title, date) {
    let string = '(';
    const regex = new RegExp(`^${title}\\((\\d+)\\)$`);
    const entries = await window.api.getEntriesOnDate(date);

    // Find all version numbers
    const versionNumbers = entries.map((entry) => {
        const match = entry.title.match(regex);
        return match ? parseInt(match[1], 10) : 0;
    });

    // Find the maximum version number
    const maxVersion = Math.max(...versionNumbers);

    // Increment the highest version number by 1
    string += (maxVersion + 1);

    console.log('This is what we are going to append', string);
    return `${string})`;
}

function replaceEntitiesWithQuotes(inputString) {
    // Replace all &quot; with double quotes (")
    const stringWithDoubleQuotes = inputString.replace(/&quot;/g, '"');

    // Replace all &apos; with single quotes (')
    const stringWithSingleQuotes = stringWithDoubleQuotes.replace(/&apos;/g, '\'');

    return stringWithSingleQuotes;
}

// this is to fix the bug of ID's being generated with quotes
function replaceQuotesWithEntities(inputString) {
    // Replace all double quotes (") with &quot;
    const stringWithQuotEntity = inputString.replace(/"/g, '&quot;');

    // Replace all single quotes (') with &apos;
    const stringWithAposEntity = stringWithQuotEntity.replace(/'/g, '&apos;');

    return stringWithAposEntity;
}

// convert from xx-xx-xxxx to Month day, year format.
function formatDate(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Create a Date object from the input dateString
    const date = new Date(dateString);

    // Extract the month, day, and year from the Date object
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Format the date as "Month Day, Year"
    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
}

/**
 * formatButtons - reformats buttons so that only 3 display on each cell
 *
 * @function
 * @param {string} htmlString - the current HTML string of buttons in a given cell
 * @param {string} id - the id of the "extra" button (formatted as "extra.<date of cell>")
 * @returns {string} upDatedData - reformatted HTML string with trunkated entry buttons
 *                                  and "extra" button appended
 * @returns {string} htmlString - the current HTML string of buttons in a given cell
 *                   (if entry button limit has not exceeded)
 *                  Checks for the number of buttons on a given cell; if the total is
 *                  more than 3 buttons, the third button is replaced with an "extra"
 *                  button that will redirect user to a list of all entry buttons for
 *                  that day, in another modal window.
 */
function formatButtons(inputArray, id) {
    console.log('length,', inputArray.length);
    console.log(inputArray[0].title);
    if (inputArray.length > 3) {
        console.log('should reduce number of visible buttons');
        // show only 2 buttons and then a ... if we have more than 3 entries
        let updatedData = `<button id='${inputArray[0].title}.${inputArray[0].date}' class='entryButton'>${inputArray[0].title}</button>`;
        updatedData += `<button id='${inputArray[1].title}.${inputArray[1].date}' class='entryButton'>${inputArray[1].title}</button>`;
        updatedData += `<button id ='${id}' class = 'extra'>...</button>`;
        return updatedData;
    }

    let entryStringButtons = '';
    for (let i = 0; i < inputArray.length; i += 1) {
        entryStringButtons += `<button id='${inputArray[i].title}.${inputArray[i].date}' class='entryButton'>${inputArray[i].title}</button>`;
    }
    return entryStringButtons;
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
    const dashboardButton = document.getElementById('dashboardLink');
    const taskListButton = document.getElementById('taskListBtn');
    // const helpButton = document.getElementById('helpButton');

    const yearInput = document.getElementById('year');
    const calendarContainer = document.getElementById('calendar');
    const clearDataButton = document.getElementById('clearBtn');
    const entryButtons = document.getElementsByClassName('entryButton');
    const monthSelect = document.getElementById('month');
    monthSelect.focus();

    // Set current month and year as initial values
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Month is zero-based
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    // Set initial values for month and year inputs
    monthSelect.value = currentMonth.toString();
    yearInput.value = currentYear.toString();

    /**
     * generateCalendar - generate the Calendar by inserting HTML into main.
     * @function
     * @returns {void}
     *                  It modifies the HTML to create the calendar layout.
     */
    async function generateCalendar() {
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
        const promises = [];
        for (let day = 1; day <= daysInMonth; day += 1) {
            promises.push(window.api.getEntriesOnDate(`${month + 1}-${day}-${year}`));
        }

        const results = await Promise.all(promises);

        for (let day = 1; day <= daysInMonth; day += 1) {
            if (count % 7 === 0) {
                calendarHTML += '</tr><tr>'; // creates a new row
            }
            let fill;
            const memory = results[day - 1];
            // check what was stored for that day
            if (memory.length === 0) {
                fill = day;
            } else {
                fill = day + formatButtons(memory, `extra.${month + 1}-${day}-${year}`);
            }
            if (currentDay === day && (currentMonth) === month && currentYear === year) {
                console.log('Todays date is:', currentMonth + 1, currentDay, currentYear);
                calendarHTML += `<td id='${month + 1}-${day}-${year}' class='mouseOut standardCell today'>${fill}</td>`;
            } else {
                calendarHTML += `<td id='${month + 1}-${day}-${year}' class='mouseOut standardCell'>${fill}</td>`;
            }
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

    // Function to simulate a mouse click on an element
    function simulateMouseClick(element) {
        // Focus the element before simulating the click event
        element.focus();

        console.log('We just attempted to click something!!!');
        console.log('This is the element that we are clicking:', element);
        // Create a new mouse click event
        const mouseClickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // Dispatch the mouse click event on the element
        element.dispatchEvent(mouseClickEvent);
    }

    /**
     * openModal - will open up a modal window with text box and title box
     * @function
     * @param {event} event - the event object, allowing access to it's target id.
     * @returns {void}
     *                  Opens modal window and allows user to make entries.
     */
    async function openModal(event) {
        console.log('you opened the modal');// test to see if we're clicking through our buttons
        console.log('This is what you clicked on:', event);
        console.log('This is the target of what you clicked on:', event.target);
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
            // bug fix for when users add in ' or " to a title
            name = replaceQuotesWithEntities(name);
        } else {
            [date] = infoArray;
        }

        console.log(date);

        /* *** BRAINSTORM FOR DELETE FUNCTIONALITY ***
         * event.target.id is either... name.4-2-2003 <-this is on clicking on saved event
         * or it may be 4-2-2003 <-this is clicking on empty cell
         * therefore possibleName can either be name4 or 4 depending on if we clicked
         * we need to identify if user clicked on a old event, or is creating a new one
         * if they clicked on an old event, we should include new option, delete button
         * we should also make the name of the event unchangable, or at least ask for a confirmation
        */

        // pull elements from HTML for the modal window
        const modal = document.getElementById('myModal');
        const span = document.getElementById('closeModal');
        const text = document.getElementById('modalTxt');
        const saveMarkDown = document.getElementById('saveMarkdown');
        const markdownInput = document.getElementById('markdown');
        const title = document.getElementById('entryTitle');
        const bookmarkButton = document.getElementById('bookmarkButton');
        let bookmarked = false;
        if (name === null) {
            // clear out all old data
            markdownInput.value = null;
            title.value = null;
            if (!bookmarked) {
                bookmarkButton.className = 'bookmark';
            }
        } else {
            // reenter old data
            // we need to make a button
            markdownInput.value = await window.api.getMarkDownEntryById(`${name}.${date}`);
            // title.value = event.target.innerHTML;
            title.value = replaceEntitiesWithQuotes(name);
            // correctly assign bookmark value
            const current = await window.api.getEntryByTitleAndDate([name, date]);
            bookmarked = current.bookmarked;
            if (bookmarked) {
                bookmarkButton.classList.add('filled');
            } else {
                bookmarkButton.className = 'bookmark';
            }
        }

        modal.style.display = 'block';
        // show date on the modals inner html (top left)
        // month/day/year is the desired format
        text.innerHTML = '';
        document.getElementById('displayDate').innerHTML = formatDate(date);
        if (name != null) {
            text.innerHTML += "<button id='deleteEntryButton' class='modalButton' >Delete Entry</button>";// add class here for styling?
            const deleteEntryButton = document.getElementById('deleteEntryButton');
            deleteEntryButton.addEventListener('click', async () => {
            // should add a confirm choice to make sure it wasnt misclick
                // localStorage.removeItem(event.target.id);// this clears the entry
                await window.api.deleteEntryByTitleAndDate([name, date]);
                // then update using setItem, and put our new string
                // do we make a helper function?
                // updateCellLocalStorage(date, event.target.id);
                modal.style.display = 'none';
                generateCalendar();
            });
        }
        document.addEventListener('keydown', (pressedKey) => {
            if (pressedKey.key === 'Escape' || pressedKey.key === 'Esc') {
                // Call a function or execute an action when the Esc key is pressed
                modal.style.display = 'none';
            }
        });

        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = 'none';
        };

        let canToggle = true;
        bookmarkButton.addEventListener('click', () => {
            if (!canToggle) {
                return; // Ignore the click if it's within the debounce period
            }

            // Disable further clicks for 100ms
            canToggle = false;
            setTimeout(() => {
                canToggle = true;
            }, 100);

            // Toggle the filled class
            bookmarkButton.classList.toggle('filled');
            bookmarked = bookmarkButton.classList.contains('filled');

            console.log('The bookmark was just pressed~ Value of bookmarked:', bookmarked);
        });

        /**
        * Listens for click of the saveMarkDown button.
        *
        * @type {HTMLElement} - the target of the event, being the save button
        * @listens onclick
        *                  When a user clicks the "Save Entry" button,
        *                  the popup closees, adds the new entry to storage, and
        *                  calls generateCalendar() to update it.
        */
        saveMarkDown.onclick = async () => {
            console.log('Save button was just pressed to save entry:', title.value);
            title.value.replace(/ /g, '_');
            title.value = replaceQuotesWithEntities(title.value);
            if (title.value === '') {
                alert('You must add a title!'); // eslint-disable-line no-alert
            } else if (title.value.includes('.')) {
                alert('Cannot use "." within title, please update your title.'); // eslint-disable-line no-alert
            } else {
                // We enter this else if we are ready to close and save
                // close popup
                modal.style.display = 'none';
                if (editing) {
                    // the user has updated the title, act accordingly
                    await window.api.deleteEntryByTitleAndDate([name, date]);
                    try {
                        // add new entry with unique ID
                        console.log('We are about to add an entry');
                        await window.api.addMarkdownEntry({
                            date,
                            title: title.value,
                            bookmarked,
                            markdownContent: markdownInput.value,
                        });
                    } catch (error) {
                        console.error('An error occurred:', error);
                    }
                } else {
                    // we are not editing, quick check for duplicate entry name
                    console.log('Attempting to make a brand new entry!');
                    const titleDate = [title.value, date];
                    const entryExists = await window.api.getEntryByTitleAndDate(titleDate);
                    console.log(entryExists);
                    if (entryExists !== null) {
                        title.value += await findVersionNumber(title.value, date);
                    }
                    try {
                        // add new entry with unique ID
                        console.log('We are about to add an entry');
                        await window.api.addMarkdownEntry({
                            date,
                            title: title.value,
                            bookmarked,
                            markdownContent: markdownInput.value,
                        });
                    } catch (error) {
                        console.error('An error occurred:', error);
                    }
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

        /**
         * Render the markdown text into the markdown-container
         * element every 100ms.
         */
        setInterval(async () => {
            const markdownText = markdownInput.value;
            const rendered = await window.api.renderMarkdown(markdownText);
            document.getElementById('markdown-container').innerHTML = rendered;
        }, 100);
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
    async function openExtraModal(event) {
        const modal = document.getElementById('extraModal');
        const span = document.getElementById('closeExtra');
        const extraButtons = document.getElementById('extraButtons');
        const [, date] = event.target.id.split('.');

        // Clear previous buttons to prevent duplication
        extraButtons.innerHTML = formatDate(date);

        // Fetch entries based on date
        const entries = await window.api.getEntriesOnDate(date);

        // Create and append buttons
        entries.forEach((entry) => {
            const button = document.createElement('button');
            button.id = `${entry.title}.${entry.date}`;
            button.className = 'entryButton';
            button.textContent = entry.title;
            extraButtons.appendChild(button);
        });

        modal.style.display = 'block';
        console.log('This is the content that we want to show on our modal:', entries);

        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (modalOutsideClick) => {
            if (modalOutsideClick.target === modal) {
                modal.style.display = 'none';
            }
        };

        // Event listeners for the entry buttons
        Array.from(entryButtons).forEach((button) => {
            button.addEventListener('click', (entryButtonClick) => {
                console.log(`This is the entry button you just clicked: ${button.id}`);
                // This prevents the cell underneath from being clicked after we click a button
                entryButtonClick.stopPropagation();
                modal.style.display = 'none';
                openModal(entryButtonClick);
            });
        });
    }
    calendarContainer.addEventListener('click', (event) => {
        console.log('This is what was just clicked:', event);
        if (event.target.classList.contains('standardCell') || event.target.classList.contains('entryButton')) {
            openModal(event);
        }
    });

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
            // target.addEventListener('click', (dayCell) => openModal(dayCell));
        } else if (target.classList.contains('extra')) {
            const extraButtons = document.getElementsByClassName('extra');
            // Event listeners for the "extra" buttons on each cell ("...")
            for (let i = 0; i < extraButtons.length; i += 1) {
                extraButtons[i].addEventListener('click', (extraButtonClick) => {
                    console.log(`This is the extra button you just clicked:${extraButtons[i].id}this is the index:${i}`);
                    openExtraModal(extraButtonClick);
                    extraButtonClick.stopPropagation();
                });
            }
        }
    });

    // Event listener to capture keyboard events
    document.addEventListener('keydown', (event) => {
        console.log('A key was pressed down!');
        // Check if the key pressed is 'Ctrl + N'
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            // Prevent the default behavior of the hotkey (e.g., browser history navigation)
            event.preventDefault();
            // Call the function to execute the action
            simulateMouseClick(document.getElementsByClassName('today')[0]);
        }
        // Check if arrow key was pressed, will change month based on this
        if (event.key === 'ArrowRight' && document.getElementById('myModal').style.display === 'none') {
            // change month to the next month
            console.log('We should increase month');
            if (monthSelect.value < 11) {
                monthSelect.value = parseInt(monthSelect.value, 10) + 1;
                generateCalendar();
                console.log(monthSelect.value);
            } else {
                monthSelect.value = 0;
                yearInput.value = parseInt(yearInput.value, 10) + 1;
            }
        }
        // Check if arrow key was pressed, will change month based on this
        if (event.key === 'ArrowLeft' && document.getElementById('myModal').style.display === 'none') {
            // change month to the next month
            console.log('We should decrease month');
            if (monthSelect.value > 0) {
                monthSelect.value -= 1;
                generateCalendar();
                console.log(monthSelect.value);
            } else {
                monthSelect.value = 11;
                yearInput.value = parseInt(yearInput.value, 10) - 1;
            }
        }
        // ctrl d or cmd d
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            // simulate pressing the dashboardLink button
            simulateMouseClick(document.getElementById('dashboardLink'));
        }
    });

    // Event listener for the click of clear data button,
    clearDataButton.addEventListener('click', async () => {
        // localStorage.clear();
        await window.api.clearEntries();

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
        }
    });

    // Listens for when the dashboard button is clicked, to link to dashboard page
    dashboardButton.addEventListener('click', () => {
        // Link to dashboard here
        window.api.loadHtmlFile('dashboard.html');
    });

    taskListButton.addEventListener('click', () => {
        // Link to task list here
        window.api.loadHtmlFile('task-list.html');
    });
});
