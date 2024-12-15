document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector("[data-slider]");
  const slides = slider.querySelectorAll(".slider__slide");
  const prevButton = document.querySelector(".slider-prev");
  const nextButton = document.querySelector(".slider-next");
  const currentCounter = document.querySelector(".slider-current");
  const totalCounter = document.querySelector(".slider-total");

  let currentIndex = 0;

  const updateSlider = () => {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    currentCounter.textContent = currentIndex + 1;
  };

  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // Initialize total counter
  totalCounter.textContent = slides.length;
});
