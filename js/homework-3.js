const images = document.querySelectorAll("img[data-src]");
const resetBtn = document.getElementById("reset-gallery");
const imageCounter = document.getElementById("image-counter");

const slider = document.getElementById("slider");
const sliderImg = document.getElementById("slider-img");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

let loadedCount = 0;
let currentIndex = 0;
let autoSlideInterval = null;

function updateCounter() {
  imageCounter.textContent = `Завантажено: ${loadedCount} / ${images.length}`;
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

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      const dataSrc = img.dataset.src;

      if (dataSrc) {
        img.src = dataSrc;

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
      }

      observer.unobserve(img);
    });
  },
  {
    threshold: 0.1,
  }
);

images.forEach((img) => {
  observer.observe(img);
});

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

    observer.observe(img);
  });

  slider.classList.add("hidden");
  stopAutoSlider();
  updateCounter();
});

