// Lasagne Maestro — čistý nový script pre web
// Sem vlož reálne WhatsApp číslo podniku bez pluska a medzier.
// Príklad: 421901234567
const WHATSAPP_PHONE = "421900000000";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reservationForm = document.querySelector("[data-reservation-form]");
const yearEl = document.querySelector("[data-year]");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
});

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

function formatDateSk(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

if (reservationForm) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reservationForm);
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const date = formatDateSk(formData.get("date"));
    const time = formData.get("time") || "";
    const people = formData.get("people") || "";
    const place = formData.get("place") || "";
    const note = formData.get("note") || "Bez poznámky";

    const message = [
      "Dobrý deň, rád/rada by som si rezervoval(a) stôl v Lasagne Maestro.",
      "",
      `Meno: ${name}`,
      `Telefón: ${phone}`,
      `Dátum: ${date}`,
      `Čas: ${time}`,
      `Počet osôb: ${people}`,
      `Preferované miesto: ${place}`,
      `Poznámka: ${note}`,
      "",
      "Prosím o potvrdenie rezervácie. Ďakujem.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
