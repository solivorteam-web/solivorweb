// HIỆN RA ANIMATION
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("active", entry.isIntersecting);
    });
  },
  { threshold: 0.1 }
);

reveals.forEach(el => observer.observe(el));

const audio = document.getElementById("bg-music");
const toggle = document.querySelector(".music-toggle");
const slider = document.querySelector(".volume-slider");

let started = false;
let isPlaying = false;

audio.volume = 0;
slider.value = 0.3;

function fadeTo(target, duration = 1200) {
  const step = (target - audio.volume) / (duration / 50);
  const fade = setInterval(() => {
    audio.volume = Math.min(1, Math.max(0, audio.volume + step));
    if (
      (step > 0 && audio.volume >= target) ||
      (step < 0 && audio.volume <= target)
    ) {
      clearInterval(fade);
    }
  }, 50);
}

function startAudioOnce() {
  if (started) return;
  started = true;

  audio.play().then(() => {
    fadeTo(0.3);
    isPlaying = true;
    toggle.textContent = "⏸";
  }).catch(() => {});

  window.removeEventListener("click", startAudioOnce);
}

window.addEventListener("click", startAudioOnce);

toggle.addEventListener("click", () => {
  if (!isPlaying) {
    audio.play();
    fadeTo(slider.value);
    toggle.textContent = "⏸";
  } else {
    fadeTo(0);
    setTimeout(() => audio.pause(), 300);
    toggle.textContent = "▶";
  }
  isPlaying = !isPlaying;
});

slider.addEventListener("input", e => {
  audio.volume = e.target.value;
});

document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('lang-float');
  const langText = document.getElementById('lang-text');
  
  // Default to EN
  let currentLang = localStorage.getItem('lang') || 'en';

  // Function to switch language
  function setLanguage(lang) {
    // 1. Update the button text (EN or VN)
    // NOTE: using toUpperCase() to ensure it looks good
    langText.textContent = lang.toUpperCase();

    // 2. Find all translatable elements and swap text
    document.querySelectorAll('[data-en]').forEach(el => {
      // Small fade animation
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = el.getAttribute(`data-${lang}`);
        el.style.opacity = '1';
      }, 150);
    });

    // 3. Save to storage
    localStorage.setItem('lang', lang);
    currentLang = lang;
  }

  // Initialize
  setLanguage(currentLang);

  // Click Handler
  langBtn.addEventListener('click', () => {
    // Toggle between en and vi
    const newLang = currentLang === 'en' ? 'vi' : 'en';
    setLanguage(newLang);
  });
});