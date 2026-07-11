const lasagne = [
  {name:'Bolognese', image:'assets/bolognese.png', description:'400g Hovädzie ragú, bešamel, parmezán, mozzarella (1,3,7,8)', price:'10,90 €'},
  {name:'Fungi', image:'assets/fungi.png', description:'400g Hubové ragú, smotana, parmezán, mozzarella, pesto (1,3,7,8)', price:'8,90 €'},
  {name:'Picante', image:'assets/picante.png', description:'400g Saláma Napoli picante, jalapeños, bešamel, parmezán (1,3,7,8)', price:'9,90 €'},
  {name:'Gorgonzola s panchettou', image:'assets/gorgonzola-panchetta.png', description:'400g Gorgonzola, panchetta, bešamel, parmezán, mozzarella (1,3,7,8)', price:'10,90 €'},
  {name:'Spinachi', image:'assets/spinachi.png', description:'400g Špenát, sušené paradajky, bešamel, parmezán, mozzarella (1,3,7,8)', price:'8,90 €'},
  {name:'Prosciutto s ricottou', image:'assets/prosciutto-ricotta.png', description:'400g Prosciutto, ricotta, bešamel, parmezán, mozzarella (1,3,7,8)', price:'10,90 €'},
  {name:'Špeciál', image:'assets/special.png', description:'Podľa aktuálnej ponuky', price:'Aktuálna cena'}
];

const dailyMenus = {
  1: {file:'assets/menu-pondelok.png', label:'Pondelkové denné menu'},
  2: {file:'assets/menu-utorok.png', label:'Utorňajšie denné menu'},
  3: {file:'assets/menu-streda.png', label:'Stredajšie denné menu'},
  4: {file:'assets/menu-stvrtok.png', label:'Štvrtkové denné menu'},
  5: {file:'assets/menu-piatok.png', label:'Piatkové denné menu'}
};

const grid = document.querySelector('#lasagne-grid');
lasagne.forEach(item => {
  const card = document.createElement('article');
  card.className = 'food-card';
  card.innerHTML = `<img src="${item.image}" alt="Lasagne ${item.name}" loading="lazy"><div class="food-card-body"><h3>${item.name}</h3><p>${item.description}</p><div class="price">${item.price}</div></div>`;
  grid.appendChild(card);
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const dailyImage = document.querySelector('#daily-menu-image');
const dayButtons = document.querySelectorAll('.day-tabs button');
function showDay(day) {
  const safeDay = dailyMenus[day] ? day : 1;
  dailyImage.src = dailyMenus[safeDay].file;
  dailyImage.alt = dailyMenus[safeDay].label;
  dayButtons.forEach(btn => {
    const active = Number(btn.dataset.day) === safeDay;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
}
dayButtons.forEach(btn => btn.addEventListener('click', () => showDay(Number(btn.dataset.day))));
const today = new Date().getDay();
showDay(today >= 1 && today <= 5 ? today : 1);

const dateField = document.querySelector('input[name="date"]');
const todayIso = new Date();
todayIso.setMinutes(todayIso.getMinutes() - todayIso.getTimezoneOffset());
dateField.min = todayIso.toISOString().split('T')[0];

const form = document.querySelector('#reservation-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const formattedDate = new Intl.DateTimeFormat('sk-SK').format(new Date(`${data.get('date')}T12:00:00`));
  const message = [
    'Dobrý deň, mám záujem o rezerváciu v Bistro Lasagne Maestro.',
    '',
    `Meno: ${data.get('name')}`,
    `Telefón: ${data.get('phone')}`,
    `Dátum: ${formattedDate}`,
    `Čas: ${data.get('time')}`,
    `Počet osôb: ${data.get('guests')}`,
    data.get('note') ? `Poznámka: ${data.get('note')}` : ''
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/421917367347?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.querySelector('#year').textContent = new Date().getFullYear();



const lasagneGrid = document.getElementById("lasagne-grid");
const lasagnePrev = document.getElementById("lasagne-prev");
const lasagneNext = document.getElementById("lasagne-next");

function getLasagneScrollAmount() {
  const firstCard = lasagneGrid?.querySelector(".food-card");

  if (!firstCard) {
    return 0;
  }

  const gridStyles = window.getComputedStyle(lasagneGrid);
  const gap = Number.parseFloat(gridStyles.columnGap || gridStyles.gap) || 0;

  return firstCard.getBoundingClientRect().width + gap;
}

function updateLasagneArrows() {
  if (!lasagneGrid || !lasagnePrev || !lasagneNext) {
    return;
  }

  const maximumScroll =
    lasagneGrid.scrollWidth - lasagneGrid.clientWidth;

  lasagnePrev.disabled = lasagneGrid.scrollLeft <= 2;
  lasagneNext.disabled =
    lasagneGrid.scrollLeft >= maximumScroll - 2;
}

lasagnePrev?.addEventListener("click", () => {
  lasagneGrid.scrollBy({
    left: -getLasagneScrollAmount(),
    behavior: "smooth"
  });
});

lasagneNext?.addEventListener("click", () => {
  lasagneGrid.scrollBy({
    left: getLasagneScrollAmount(),
    behavior: "smooth"
  });
});

lasagneGrid?.addEventListener("scroll", updateLasagneArrows);

window.addEventListener("resize", updateLasagneArrows);

window.addEventListener("load", () => {
  setTimeout(updateLasagneArrows, 100);
});
