const fullImg = document.querySelector('#fullImg');
const fullImgContainer = document.querySelector('#fullImgContainer');
const closeBtn = document.querySelector('#closeBtn');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

const params = new URLSearchParams(location.search);
const src = params.get("src");
let data = [];
let currentIndex = -1;

let isZoomed = false;

const mq = window.matchMedia('(max-width: 768px)');
let isSmall = mq.matches;

mq.addEventListener('change', (e) => {
  isSmall = e.matches;
  if (isSmall && isZoomed) {
    resetZoom();
  }
});

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

function resetZoom() {
  isZoomed = false;
  fullImg.classList.remove("zoomed");
  fullImgContainer.classList.remove("zoomed");
  fullImg.style.width = "";
  fullImg.style.height = "";
  fullImgContainer.scrollLeft = 0;
  fullImgContainer.scrollTop = 0;
}

function showImage(i) {
  if (isZoomed) {
    fullImg.style.visibility = "hidden";

    resetZoom();
    
    fullImg.onload = () => {
      fullImg.style.visibility = "visible";
    };
  }

  fullImg.src = data[i].src;
}

function scrollToCenter() {
  const targetLeft = (fullImg.scrollWidth - fullImgContainer.clientWidth) / 2;
  const targetTop  = (fullImg.scrollHeight - fullImgContainer.clientHeight) / 2;
  fullImgContainer.scrollLeft = Math.max(0, targetLeft);
  fullImgContainer.scrollTop  = Math.max(0, targetTop);
}

function handleDesktopImageClick() {
  if (!isZoomed) {
    isZoomed = true;
    fullImg.classList.add("zoomed");
    fullImgContainer.classList.add("zoomed");

    const cw = fullImgContainer.clientWidth;
    const ch = fullImgContainer.clientHeight;

    const rect = fullImg.getBoundingClientRect();
    const dw = rect.width;
    const dh = rect.height;

    const EXTRA_PX = 2;

    const minScaleWidth = (cw + EXTRA_PX) / dw;
    const minScaleHeight = (ch + EXTRA_PX) / dh;
    const scale = Math.max(minScaleWidth, minScaleHeight);

    fullImg.style.width  = `${dw * scale}px`;
    fullImg.style.height = `${dh * scale}px`;

    requestAnimationFrame(scrollToCenter);
  } else {
    resetZoom();
  }
}

function handleSmallImageClick(e) {
  const rect = fullImgContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const mid = rect.width / 2;

  if (clickX < mid) {
    if (currentIndex > 0) {
      currentIndex--;
      showImage(currentIndex);
    }
  } else {
    if (currentIndex < data.length - 1) {
      currentIndex++;
      showImage(currentIndex);
    }
  }
}

fullImg.addEventListener("click", (e) => {
  if (isSmall) {
    handleSmallImageClick(e);
  } else {
    handleDesktopImageClick();
  }
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