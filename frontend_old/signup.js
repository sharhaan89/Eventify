function validateForm() {
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const errorMsg = document.getElementById('error-msg');

    if (password !== confirm) {
    errorMsg.style.display = 'block';
    return false;
    }
    return true;
}

const images = new Array(
    '../images/nitk-1.avif',
    '../images/incident-03.jpeg',
    '../images/nitk-2.jpg',
    '../images/incident-05.jpg',
);

const changeTheBackground = setInterval(function(){
    document.getElementById("bg-img").setAttribute('style',`background-image : url(${images[Math.floor(Math.random()*4)]})`)
}, 2500)


changeTheBackground()