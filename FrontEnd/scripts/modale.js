let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let lastFocusedElement = null;

document.addEventListener("DOMContentLoaded", () => {
  setupModals();
  loadCategories();
  document.getElementById("formAddWork")?.addEventListener("submit", addWork);
});

function setupModals() {
  const editWorksButton = document.getElementById("edit-works");
  editWorksButton?.addEventListener("click", openModal);

  const addPhotoButton = document.getElementById("addPhotoButton");
  const backButton = document.querySelector(".js-modal-back");

  addPhotoButton?.addEventListener("click", addWork);
  // backButton?.addEventListener("click", backToGalleryModal); faire la fonction backToGalleryModal
}

function openModal(e) {
  e.preventDefault();
  console.log('data', allData);
  modal = document.getElementById("modalGallery");
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0]?.focus();
  showModal();
  // injectDataIntoHTMLModale(allData); A décommenter dès HTML fini
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", handleKeyDown);
  modal = null;
  lastFocusedElement?.focus();
}

function showModal() {
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-modal", "true");
  document.addEventListener("keydown", handleKeyDown);
  modal.querySelector(".js-modal-close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", closeModal);
  modal.querySelector(".modal-wrapper")?.addEventListener("click", (e) => e.stopPropagation());
}

function handleKeyDown(e) {
  if (e.key === "Escape") closeModal();
  if (e.key === "Tab") {
    let index = focusables.indexOf(document.activeElement) + (e.shiftKey ? -1 : 1);
    focusables[(index + focusables.length) % focusables.length]?.focus();
    e.preventDefault();
  }
}
function injectDataIntoHTMLModale(data) {
  const galleryHTML = document.getElementById('modal-gallery'); // Sélectionne la galerie
  galleryHTML.innerHTML = ''; // Vide la galerie avant d'ajouter de nouveaux éléments

  data.forEach(work => {
      const imgHTML = document.createElement('img');

      imgHTML.src = work.imageUrl;
      imgHTML.alt = work.title;
      galleryHTML.appendChild(imgHTML);
  });
}
async function addWork(event) {
  event.preventDefault();
  const form = new FormData(document.getElementById("formAddWork"));
  try {
    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: form,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    await displayWorksInModal();
    closeModal();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

async function loadCategories() {
  const categorySelect = document.getElementById("categoryInput");
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  categorySelect.innerHTML = `<option value="">Choisissez une catégorie</option>`;
  categories.forEach(({ id, name }) => {
    categorySelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}
