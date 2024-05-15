/**
 * A reusable calendar widget
 * @class Calendar
 */
document.addEventListener("DOMContentLoaded", function () {
    const currentDate = new Date();
    const monthSelect = document.getElementById("month");
    const yearInput = document.getElementById("year");
    const calendarContainer = document.getElementById("calendar");
    
  
    // Function to generate calendar
    function generateCalendar(month, year) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
        
      let calendarHTML = " <thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody></tbody><tr>";
  
      // Add empty cells for days before the first day of the month
      let count = 0;
      for (let i = 0; i < firstDay; i++) {
        calendarHTML += "<td id='emptyCell'></td> ";
        count++;
      }
  
      // Add cells for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        if(count % 7 == 0){
            calendarHTML +=" </tr> <tr>";
        }
        calendarHTML += `<td id='standardCell'>${day}</td> `;
        count++;
      }
  
      calendarHTML += "</tr></tbody>";
      calendarContainer.innerHTML = calendarHTML;
    }
  
    // Event listener for month and year change
    function updateCalendar() {
      const selectedMonth = parseInt(monthSelect.value);
      const selectedYear = parseInt(yearInput.value);
      generateCalendar(selectedMonth, selectedYear);
    }
  
    monthSelect.addEventListener("change", updateCalendar);
    yearInput.addEventListener("input", updateCalendar);
  
    // Event listener for hover on day
    calendarContainer.addEventListener("mouseover", function (event) {
      const target = event.target;
      if (target.classList.contains("calendar-cell")) {
        target.classList.add("hovered");
  
        // Add buttons for tasks and markdown entries
        const taskButton = document.createElement("button");
        taskButton.textContent = "Add Task";
        taskButton.classList.add("task-button");
  
        const markdownButton = document.createElement("button");
        markdownButton.textContent = "Add Markdown";
        markdownButton.classList.add("markdown-button");
  
        target.appendChild(taskButton);
        target.appendChild(markdownButton);
      }
    });
  
    calendarContainer.addEventListener("mouseout", function (event) {
      const target = event.target;
      if (target.classList.contains("calendar-cell")) {
        target.classList.remove("hovered");
  
        // Remove buttons for tasks and markdown entries
        const taskButton = target.querySelector(".task-button");
        if (taskButton) {
          target.removeChild(taskButton);
        }
  
        const markdownButton = target.querySelector(".markdown-button");
        if (markdownButton) {
          target.removeChild(markdownButton);
        }
      }
    });
  });
  
