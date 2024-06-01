function init() {
    const button = document.querySelector('button');
    const input = document.getElementById('password');
    const alert = document.getElementById('strongPassword');
    const passwordPage = document.getElementById('passwordPage');
    const hint = document.getElementById('hint');
    let password;
    let pin;
    button.addEventListener('click', () => {
        if (input.value.length < 6) {
            if (button.textContent === 'Create') {
                pin = input.value;
                const data = {
                    password,
                    pin,
                };
                window.api.writePassword(JSON.stringify(data));
                passwordPage.click();
            } else {
                alert.style.color = 'red';
            }
        } else {
            alert.style.color = 'transparent';
            button.textContent = 'Create';
            hint.textContent = 'Pin to help you find password';
            password = input.value;
            input.value = '';
        }
    });
}

window.addEventListener('DOMContentLoaded', init);
