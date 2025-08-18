const img = document.getElementById('fullImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const params = new URLSearchParams(location.search);
const src = params.get("src");
let data = [];
let currentIndex = -1;

async function load() {
  const res = await fetch("images.json");
  data = await res.json();

  data.sort((a, b) => Date.parse(b.dateISO) - Date.parse(a.dateISO));

  currentIndex = data.findIndex(item => item.src === src);
  if (currentIndex === -1) {
    window.location.href = "index.html";
    return;
  }

  showImage(currentIndex);
}

function showImage(i) {
  img.src = data[i].src;
  img.classList.remove("zoomed");
}

img.addEventListener("click", () => {
  img.classList.toggle("zoomed");
});

closeBtn.addEventListener("click", () => {
  if (window.history.length > 1) {
    history.back();
  } else {
    location.href = "index.html";
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showImage(currentIndex);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < data.length - 1) {
    currentIndex++;
    showImage(currentIndex);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
});

load();