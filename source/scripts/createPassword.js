function init() {
    const button = document.querySelector('button');
    const input = document.getElementById('password');
    const alert = document.getElementById('strongPassword');
    const passwordPage = document.getElementById('passwordPage');
    const hint = document.getElementById('hint');
    const rememberCheckbox = document.getElementById('rememberMe');
    let password;
    let pin;
    const handleButtonClick = () => {
        if (button.textContent === 'Next') {
            if (input.value.length >= 6) {
                alert.style.color = 'transparent';
                button.textContent = 'Create';
                hint.textContent = 'Pin to help you find password';
                password = input.value;
                input.value = '';
            } else {
                alert.style.color = 'red';
                alert.textContent = 'Password must be at least 6 characters long.';
            }
        } else if (button.textContent === 'Create') {
            if (input.value.length < 6) {
                alert.style.color = 'transparent';
                alert.textContent = '';
                pin = input.value;
                rememberMe = false;
                const data = {
                    password,
                    pin,
                    rememberMe
                };
                window.api.writePassword(JSON.stringify(data));
                passwordPage.click();
            } else {
                alert.style.color = 'red';
                alert.textContent = 'Pin must be 6 characters or less.';
            }
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
