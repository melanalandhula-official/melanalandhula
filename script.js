const images = document.querySelectorAll(".gallery img");

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.getElementById("close");

images.forEach(image => {

    image.addEventListener("click", () => {

        lightbox.style.display = "flex";

        lightboxImg.src = image.src;

    });

});

closeBtn.onclick = () => {

    lightbox.style.display = "none";

};

lightbox.onclick = () => {

    lightbox.style.display = "none";

};const darkBtn = document.getElementById("darkBtn");

darkBtn.onclick = () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        darkBtn.innerHTML = "☀️";

    }else{

        darkBtn.innerHTML = "🌙";

    }

};// Live Date & Time

function updateDateTime(){

const now = new Date();

document.getElementById("datetime").innerHTML =
now.toLocaleDateString() + "<br>" +
now.toLocaleTimeString();

}

setInterval(updateDateTime,1000);

updateDateTime();


// Visitor Counter

let count = localStorage.getItem("visitorCount");

if(count==null){
count=1;
}else{
count++;
}

localStorage.setItem("visitorCount",count);

document.getElementById("visitor-count").innerHTML=count;


// Weather (Temporary)

document.getElementById("weather").innerHTML="☀️ 37°C";
// Scroll To Top Button

const topBtn = document.getElementById("topBtn");

window.onscroll = function () {

    if (document.documentElement.scrollTop > 300) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

};

topBtn.onclick = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};