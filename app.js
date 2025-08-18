const sortBtn = document.getElementById('sortBtn');
const colA = document.getElementById('colA');
const colB = document.getElementById('colB');

let data = [];
let order = 'desc';

const render = (items) => {
  colA.innerHTML = '';
  colB.innerHTML = '';

  items.forEach((item, i) => {
    const link = document.createElement('a');
    link.href = `viewer.html?src=${encodeURIComponent(item.src)}`;
    
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = '';
    img.loading = 'lazy';

    link.appendChild(img);
    (i % 2 === 0 ? colA : colB).appendChild(link);
  });
};

const sortAndRender = () => {
  const sorted = [...data].sort((a, b) => {
    const da = Date.parse(a.dateISO);
    const db = Date.parse(b.dateISO);
    return order === 'desc' ? db - da : da - db;
  });
  render(sorted);
  sortBtn.innerHTML = order === 'desc' ? 'Date created &darr;' : 'Date created &uarr;';
};

async function load() {
  try {
    const res = await fetch('images.json');
    data = await res.json();
    sortAndRender();
  } catch (err) {
    console.error(err);
  }
}

load();

sortBtn.addEventListener('click', () => {
  order = order === 'desc' ? 'asc' : 'desc';
  sortAndRender();
});

// const input = "2025-07-22 3:56 PM";
// const date = new Date(input);
// console.log(date.toISOString());