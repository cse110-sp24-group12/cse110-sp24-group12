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

    const modal = document.getElementById('myModal');
    const img = document.getElementById('triggerPopup');
    const span = document.getElementsByClassName('close')[0];
    const container = document.querySelector('.container');

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
