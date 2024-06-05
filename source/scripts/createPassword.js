function init() {
    const button = document.querySelector('button');
    const input = document.getElementById('password');
    const alert = document.getElementById('strongPassword');
    const passwordPage = document.getElementById('passwordPage');

    let oldPass;
    let pin;
    let rememberMe;
    const handleButtonClick = async () => {
        if (input.value.length >= 6) {      // input validation for password length
            alert.style.color = 'transparent';
            oldPass = input.value;
            input.value = '';
            rememberMe = false;
            const password = await window.api.encryptData(oldPass); // encrypts password 
            const data = {
                password,
                pin,
                rememberMe,
            };
            window.api.writePassword(JSON.stringify(data)); // writes password to json file
            passwordPage.click();
        } else {
            alert.style.color = 'red';
            alert.textContent = 'Password must be at least 6 characters long.';
        }
    };

    button.addEventListener('click', handleButtonClick);

    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleButtonClick();
        }
    });
}

window.addEventListener('DOMContentLoaded', init);
