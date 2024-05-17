
window.addEventListener('DOMContentLoaded', init);
function init() {
    var button = document.querySelector('button');
    var input = document.getElementById('password');
    var alert = document.getElementById('strongPassword');
    var passwordPage = document.getElementById('passwordPage');
    var hint = document.getElementById('hint');
    var password;
    var pin;
    button.addEventListener('click',function(){
        if(input.value.length < 6){
            if(button.textContent === 'Create'){
                pin = input.value;
                passwordPage.click();
            }else{
                alert.style.color = "red";
            }
        }else{
            alert.style.color = "transparent";
            button.textContent = 'Create';
            hint.textContent = 'Pin to help you find password';
            password = input.value;
            input.value = '';
        }
    });
}