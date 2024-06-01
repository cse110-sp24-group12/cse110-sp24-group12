async function init() {
    // check for password
    const button = document.querySelector('button');
    const password = document.getElementById('password');
    const createPassword = document.getElementById('createPassword');
    // get password from json file
    const jsonPasswordFile = await window.api.readPassword('');
    const jsonPassword = JSON.parse(jsonPasswordFile);
    if (jsonPasswordFile !== '{}') {
        createPassword.textContent = '';
    } else {
        createPassword.textContent = 'Create Password';
    }
    // check if password matches
    button.addEventListener('click', () => {
        if (password.value === jsonPassword.password) {
            window.api.loadHtmlFile('calendar.html');
        }
    });

    const modal = document.getElementById('myModal');
    const img = document.getElementById('triggerPopup');
    const span = document.getElementsByClassName('close')[0];
    const container = document.querySelector('.container');
    // when ? button is clicked, dont display the password page underneath
    img.onclick = () => {
        modal.style.display = 'block';
        container.style.display = 'none';
    };

    span.onclick = () => {
        modal.style.display = 'none';
        container.style.display = 'flex';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            container.style.display = 'flex';
        }
    };
}

window.addEventListener('DOMContentLoaded', init);
