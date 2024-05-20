window.addEventListener('DOMContentLoaded', init);

async function init() {
    // check for password
    const button = document.querySelector('button');
    const password = document.getElementById('password');
    const homePage = document.getElementById('back');
    const createPassword = document.getElementById('createPassword');
    // get password from json file
    const jsonPasswordFile = await window.api.readPassword('');
    const jsonPassword = JSON.parse(jsonPasswordFile);
    if (jsonPasswordFile !== '{}') {
        createPassword.textContent = '';
    } else {
        createPassword.textContent = 'Create Password';
    }
    button.addEventListener('click', () => {
        if (password.value === jsonPassword.password) {
            homePage.click();
        }
    });

    var modal = document.getElementById("myModal");
    var img = document.getElementById("triggerPopup");
    var span = document.getElementsByClassName("close")[0]; 
    
    img.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
