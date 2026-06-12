const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startDateInput = document.getElementById('startDate');

let currentSlide = 0;
let slideInterval;
let relationshipStart = new Date(startDateInput.value);

function setActiveSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  Array.from(dotsContainer.children).forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function createDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.addEventListener('click', () => {
      currentSlide = index;
      setActiveSlide(currentSlide);
      resetSlideInterval();
    });
    dotsContainer.appendChild(dot);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  setActiveSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  setActiveSlide(currentSlide);
}

function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 6000);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateTimer() {
  const now = new Date();
  if (now < relationshipStart) {
    yearsEl.textContent = '00';
    monthsEl.textContent = '00';
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  let years = now.getFullYear() - relationshipStart.getFullYear();
  let months = now.getMonth() - relationshipStart.getMonth();
  let days = now.getDate() - relationshipStart.getDate();
  let hours = now.getHours() - relationshipStart.getHours();
  let minutes = now.getMinutes() - relationshipStart.getMinutes();
  let seconds = now.getSeconds() - relationshipStart.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  yearsEl.textContent = pad(years);
  monthsEl.textContent = pad(months);
  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}


createDots();
setActiveSlide(0);
resetSlideInterval();
updateTimer();
setInterval(updateTimer, 1000);

window.addEventListener('load', () => {
  updateTimer();
  const audioPlayer = document.getElementById('audioPlayer');
  const playMusicBtn = document.getElementById('playMusicBtn');
  if (audioPlayer) {
    audioPlayer.play().catch(() => {});
  }
  if (playMusicBtn && audioPlayer) {
    playMusicBtn.addEventListener('click', () => {
      audioPlayer.play().catch(() => {});
      playMusicBtn.style.display = 'none';
    });
  }
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetSlideInterval();
});
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetSlideInterval();
});

