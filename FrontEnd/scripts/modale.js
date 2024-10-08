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

  addPhotoButton?.addEventListener("click", openAddWorkModal);
  backButton?.addEventListener("click", backToGalleryModal);
}

function openModal(e) {
  e.preventDefault();
  modal = document.getElementById("modalGallery");
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0]?.focus();
  showModal();
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
