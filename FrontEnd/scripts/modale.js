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
  injectDataIntoHTMLModale(allData);
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
let isGalleryLoaded = false;  // Variable pour vérifier si la galerie est déjà chargée

function injectDataIntoHTMLModale(data) {
  const galleryHTML = document.getElementById('modal-gallery'); // Sélectionne la galerie dans la modale
  const mainGallery = document.getElementById('gallery'); // Sélectionne la galerie sur la page de base

  // Vérifie si les images sont déjà chargées
  if (isGalleryLoaded) {
    return;  // Si oui, ne fait rien
  }

  // Vide les galeries avant d'ajouter des images (une seule fois)
  galleryHTML.innerHTML = ''; 
  mainGallery.innerHTML = ''; 

  data.forEach((work, index) => {
      // Création des conteneurs et images comme dans le code précédent
      const imageContainerModale = document.createElement('div');
      imageContainerModale.classList.add('image-container');
      imageContainerModale.id = `modale-container-${index}`;

      const imgModale = document.createElement('img');
      imgModale.src = work.imageUrl;
      imgModale.alt = work.title;
      imgModale.classList.add('photo');
      imgModale.id = `modale-photo-${index}`;

      const trashIconModale = document.createElement('i');
      trashIconModale.classList.add('fa-regular', 'fa-trash-can', 'trash-icon');
      trashIconModale.id = `modale-trash-${index}`;

      trashIconModale.style.fontWeight = '400';
      trashIconModale.style.position = 'absolute';
      trashIconModale.style.top = '5px';
      trashIconModale.style.right = '5px';
      trashIconModale.style.color = 'white';
      trashIconModale.style.backgroundColor = 'black';
      trashIconModale.style.padding = '3px';
      trashIconModale.style.borderRadius = '2px';

      imageContainerModale.appendChild(imgModale);
      imageContainerModale.appendChild(trashIconModale);
      galleryHTML.appendChild(imageContainerModale);

      const imgMainGallery = document.createElement('img');
      imgMainGallery.src = work.imageUrl;
      imgMainGallery.alt = work.title;
      imgMainGallery.classList.add('photo');
      imgMainGallery.id = `main-photo-${index}`;
      mainGallery.appendChild(imgMainGallery);

      trashIconModale.addEventListener('click', function() {
        imageContainerModale.remove();
        const correspondingMainImage = document.getElementById(`main-photo-${index}`);
        if (correspondingMainImage) {
          correspondingMainImage.remove();
        }
      });
  });

  // Marque la galerie comme chargée
  isGalleryLoaded = true;
}

function displayWorksInModal() {
  // Sélectionner l'élément modal où les travaux seront affichés
  const modalGallery = document.getElementById('modal-gallery');
  modalGallery.innerHTML = '';  // Vider la galerie de la modale avant de la remplir

  // Créer un formulaire pour ajouter un nouveau travail
  const formAddWork = document.createElement('form');
  formAddWork.id = 'formAddWork';

  // Conteneur pour l'ajout de photo
  const containerAddPhoto = document.createElement('div');
  containerAddPhoto.classList.add('containerAddPhoto');

  // Icône d'ajout de photo
  const iconAddPhoto = document.createElement('i');
  iconAddPhoto.classList.add('fa-regular', 'fa-image');
  containerAddPhoto.appendChild(iconAddPhoto);

  // Label pour ajouter une photo
  const labelFile = document.createElement('label');
  labelFile.classList.add('labelFile');
  labelFile.setAttribute('for', 'file');
  labelFile.innerText = '+ Ajouter photo';
  containerAddPhoto.appendChild(labelFile);

  // Message sur les formats acceptés
  const fileInfo = document.createElement('p');
  fileInfo.innerText = 'jpg, png : 4mo max';
  containerAddPhoto.appendChild(fileInfo);

  // Champ d'input pour choisir une image
  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.name = 'image';
  inputFile.id = 'file';
  inputFile.accept = 'image/jpg, image/png';
  inputFile.required = true;
  inputFile.style.display = 'none';
  containerAddPhoto.appendChild(inputFile);

  // Image pour prévisualisation
  const previewImage = document.createElement('img');
  previewImage.id = 'previewImage';
  previewImage.src = '#';
  previewImage.alt = 'Aperçu de l\'image';
  previewImage.style.display = 'none';
  containerAddPhoto.appendChild(previewImage);

  // Ajouter le conteneur de photo au formulaire
  formAddWork.appendChild(containerAddPhoto);

  // Titre du travail
  const labelTitle = document.createElement('label');
  labelTitle.setAttribute('for', 'title');
  labelTitle.innerText = 'Titre';
  formAddWork.appendChild(labelTitle);

  const inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.name = 'title';
  inputTitle.id = 'title';
  inputTitle.required = true;
  formAddWork.appendChild(inputTitle);

  // Catégorie du travail
  const labelCategory = document.createElement('label');
  labelCategory.setAttribute('for', 'categoryInput');
  labelCategory.innerText = 'Catégorie';
  formAddWork.appendChild(labelCategory);

  const selectCategory = document.createElement('select');
  selectCategory.id = 'categoryInput';
  selectCategory.name = 'category';
  selectCategory.required = true;
  formAddWork.appendChild(selectCategory);

  // Ligne de séparation
  const borderLine = document.createElement('div');
  borderLine.classList.add('border-line');
  formAddWork.appendChild(borderLine);

  // Bouton de validation
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.id = 'addWorkButton';
  submitButton.innerText = 'Valider';
  formAddWork.appendChild(submitButton);

  // Ajouter le formulaire à la modale
  modalGallery.appendChild(formAddWork);

  // Gestion de l'affichage de la prévisualisation d'image
  inputFile.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              previewImage.src = e.target.result;
              previewImage.style.display = 'block';  // Afficher l'aperçu une fois l'image chargée
          };
          reader.readAsDataURL(file);
      }
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
