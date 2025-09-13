const images = document.querySelectorAll("img[data-src]");
const loadBtn = document.getElementById("load-images-btn");
const resetBtn = document.getElementById("reset-gallery");
const imageCounter = document.getElementById("image-counter");

const slider = document.getElementById("slider");
const sliderImg = document.getElementById("slider-img");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

let loadedCount = 0;
let currentIndex = 0;
let autoSlideInterval;

function updateCounter() {
  imageCounter.textContent = `Завантажено: ${loadedCount} / ${images.length} `;
}

function hideSpinner(img) {
  const wrapper = img.closest(".image-wrapper");
  const spinner = wrapper.querySelector(".spinner");
  if (spinner) spinner.style.display = "none";
}

function showSlider() {
  slider.classList.remove("hidden");
  updateSliderImage();
  startAutoSlider();
}

function updateSliderImage() {
  sliderImg.src = images[currentIndex].src;
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateSliderImage();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateSliderImage();
});

function startAutoSlider() {
  stopAutoSlider();
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateSliderImage();
  }, 4000);
}

function stopAutoSlider() {
  clearInterval(autoSlideInterval);
}

function loadImages() {
  loadedCount = 0;
  images.forEach((img, index) => {
    img.classList.remove("loaded");
    hideSpinner(img);
    img.src = "";
    setTimeout(() => {
      img.src = img.dataset.src;
      img.onload = () => {
        img.classList.add("loaded");
        hideSpinner(img);
        loadedCount++;
        updateCounter();
        if (loadedCount === images.length) {
          showSlider();
          localStorage.setItem("imagesLoaded", "true");
        }
      };
    }, index * 500);
  });
}

if (localStorage.getItem("imagesLoaded") === "true") {
  images.forEach((img) => {
    img.src = img.dataset.src;
    img.onload = () => {
      img.classList.add("loaded");
      hideSpinner(img);
      loadedCount++;
      updateCounter();
      if (loadedCount === images.length) showSlider();
    };
    if (img.complete) img.onload();
  });
}

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("imagesLoaded");
  loadedCount = 0;
  currentIndex = 0;

  images.forEach((img) => {
    img.src = "";
    img.classList.remove("loaded");
    const spinner = img.closest(".image-wrapper").querySelector(".spinner");
    if (spinner) spinner.style.display = "block";
  });

  slider.classList.add("hidden");
  stopAutoSlider();
  updateCounter();
});

loadBtn.addEventListener("click", loadImages);
