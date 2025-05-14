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