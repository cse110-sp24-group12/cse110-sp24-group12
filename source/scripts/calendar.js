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
        calendarHTML += `<td id='standardCell' class='mouseOut'>${day}</td> `;
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

    
    // Defualt date set to current date
    document.addEventListener("DOMContentLoaded", function () {
      yearInput = document.getElementById("year");

      // Set current year as the initial value
      const currentYear = new Date().getFullYear();
      yearInput.value = currentYear.toString();
    });

    // Generate calendar on page load, with current date set to default
    updateCalendar();
  
    // Event listener for hover on day
    calendarContainer.addEventListener("mouseover", function (event) {
      const target = event.target;

      //target.classList.contains("standardCell")
      if (target.getAttribute('id') == "standardCell") {
        target.classList.remove("mouseOut");
        target.classList.add("mouseIn");
  
        //pull day from the cell clicked
        const dayDate = target.innerHTML;
        console.log(dayDate);

        // when user clicks 
        target.addEventListener('click', function (event) {
          var modal = document.getElementById("myModal");
          var span = document.getElementsByClassName("close")[0];
          var text = document.getElementById("modal-txt");
          modal.style.display = "block";

          //this is to display current date on top left corner
          text.innerHTML = document.getElementById("month").value+'/'+dayDate+'/'+document.getElementById("year").value;
          // When the user clicks on <span> (x), close the modal
          span.onclick = function() {
            modal.style.display = "none";
          }
    
          // When the user clicks anywhere outside of the modal, close it
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          }
        });

        
      }
    });
    
    

  
    calendarContainer.addEventListener("mouseout", function (event) {
      const target = event.target;
      if (target.getAttribute('id') == "standardCell") {
        target.classList.remove("mouseIn");
        target.classList.add("mouseOut");
        //target.style.background = '#af8181';
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
  
