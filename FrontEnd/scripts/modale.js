let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let lastFocusedElement = null;

document.addEventListener("DOMContentLoaded", () => {
setupModals();
loadCategories();
document.getElementById("formAddWork")?.addEventListener("submit", addWork);

  // Référence au bouton de validation
  const validateButton = document.getElementById("addWorkButton");
  
  // Références aux champs du formulaire
  const fileInput = document.getElementById("file");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("categoryInput");

  // Ajouter un aperçu de l'image dans containerAddPhoto
  fileInput.addEventListener("change", handleFileInputChange);
  titleInput.addEventListener("input", validateForm);
  categoryInput.addEventListener("change", validateForm);

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewImage = document.createElement("img");
        previewImage.src = e.target.result;
        previewImage.alt = "Aperçu de l'image sélectionnée";
        previewImage.classList.add("preview-image");

        const containerAddPhoto = document.querySelector(".containerAddPhoto");
        containerAddPhoto.innerHTML = ""; // Supprime les anciens éléments
        containerAddPhoto.appendChild(previewImage);
        validateForm(); // Vérifie les champs après ajout d'une image
      };
      reader.readAsDataURL(file);
    } else {
      validateForm(); // Vérifie les champs si aucun fichier n'est sélectionné
    }
  }

  function validateForm() {
    // Vérifie si les trois champs sont remplis
    const isFileSelected = fileInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categoryInput.value.trim() !== "";

    if (isFileSelected && isTitleFilled && isCategorySelected) {
      validateButton.disabled = false; // Active le bouton
    } else {
      validateButton.disabled = true; // Désactive le bouton
    }
  }

  // Appel initial pour désactiver le bouton au chargement de la page
  validateForm();

// Ajouter l'aperçu de l'image dans containerAddPhoto
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImage = document.createElement("img");
      previewImage.src = e.target.result;
      previewImage.alt = "Aperçu de l'image sélectionnée";
      previewImage.classList.add("preview-image"); // Ajoute la classe CSS

      // Récupère le conteneur et nettoie-le avant d'ajouter l'image
      const containerAddPhoto = document.querySelector(".containerAddPhoto");
      containerAddPhoto.innerHTML = ""; // Supprime les anciens éléments (texte + icône)
      containerAddPhoto.appendChild(previewImage); // Ajoute l'image
    };
    reader.readAsDataURL(file);
  }
});

});
function setupModals() {
  const editWorksButton = document.getElementById("edit-works");
  editWorksButton?.addEventListener("click", () => {
    openModal();
    showGalleryModalSection();  // Affiche la galerie photo par défaut
  });

  const addPhotoButton = document.getElementById("addPhotoButton");
  addPhotoButton?.addEventListener("click", showAddPhotoModalSection);  // Passe à la modale d'ajout photo

  const backButton = document.querySelector(".js-modal-back");
  backButton?.addEventListener("click", showGalleryModalSection);  // Retour à la galerie photo
}

function openModal(e) {
  e?.preventDefault();
  modal = document.getElementById("modalGallery");
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0]?.focus();
  showModal();
  injectDataIntoHTMLModale(allData); // Charger les données de la galerie
}

function showModal() {
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-modal", "true");
  document.addEventListener("keydown", handleKeyDown);

  // Ajoutez seulement l'écouteur de clic sur la croix pour fermer la modale
  modal.querySelector(".js-modal-close")?.addEventListener("click", closeModal);

  const addPhotoModale = document.getElementById("modaleAddWork");
  addPhotoModale.querySelector(".js-modale-close")?.addEventListener("click", closeModal);
}

function closeModal() {
  modal.style.display = "none"; // Ajouter cette ligne pour masquer la modale
  modal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", handleKeyDown);
  modal = null;
  lastFocusedElement?.focus();
}

// Fonction pour afficher la section de la galerie
function showGalleryModalSection() {
  document.getElementById("ModaleBase").classList.add("show");
  document.getElementById("ModaleBase").classList.remove("hide");
  document.getElementById("modaleAddWork").classList.add("hide");
  document.getElementById("modaleAddWork").classList.remove("show");
}

// Fonction pour afficher la section d'ajout de photo
function showAddPhotoModalSection() {
  document.getElementById("ModaleBase").classList.add("hide");
  document.getElementById("ModaleBase").classList.remove("show");
  document.getElementById("modaleAddWork").classList.add("show");
  document.getElementById("modaleAddWork").classList.remove("hide");
  // Ajoute cet écouteur pour fermer la modale d'ajout de photo
  document.querySelector(".js-modale-close")?.addEventListener("click", closeModal);

  
}

// Fonction pour gérer les touches du clavier
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
  const galleryHTML = document.getElementById('modal-gallery');
  const mainGallery = document.getElementById('gallery');

  if (isGalleryLoaded) {
    return;
  }

  galleryHTML.innerHTML = ''; 
  mainGallery.innerHTML = ''; 

  data.forEach((work, index) => {
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

      // Ajouter un écouteur de clic pour supprimer le travail
      trashIconModale.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        deleteWorkInModale(work, imageContainerModale, index);
      });

      imageContainerModale.appendChild(imgModale);
      imageContainerModale.appendChild(trashIconModale);
      galleryHTML.appendChild(imageContainerModale);

      const imgMainGallery = document.createElement('img');
      imgMainGallery.src = work.imageUrl;
      imgMainGallery.alt = work.title;
      imgMainGallery.classList.add('photo');
      imgMainGallery.id = `main-photo-${index}`;
      mainGallery.appendChild(imgMainGallery);
  });

  isGalleryLoaded = true;
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000); // Masquer le message après 3 secondes
}

async function deleteWorkInModale(work, imageContainerModale, index) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("Token")}` },
    });

    if (response.status === 204) {
      imageContainerModale.remove();
      const correspondingMainImage = document.getElementById(`main-photo-${index}`);
      if (correspondingMainImage) {
        correspondingMainImage.remove();
      }
    } else {
      alert("Erreur lors de la suppression de l'image");
    }
  } catch (error) {
    console.error('Erreur réseau ou d\'authentification:', error);
    alert('Erreur réseau ou d\'authentification');
  }
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.classes && Array.isArray(options.classes)) {
    element.classList.add(...options.classes);
  }
  if (options.attributes && typeof options.attributes === 'object') {
    Object.entries(options.attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
  }
  if (options.style && typeof options.style === 'object') {
    Object.assign(element.style, options.style);
  }
  if (options.innerText) {
    element.innerText = options.innerText;
  }
  return element;
}

function displayWorksInModal() {
  const modalGallery = document.getElementById('modal-gallery');
  modalGallery.innerHTML = ''; 

  const formAddWork = createElement('form', { id: 'formAddWork' });

  const containerAddPhoto = createElement('div', { classes: ['containerAddPhoto'] });
  console.log("addPhoto", containerAddPhoto);
  containerAddPhoto.append(
    createElement('i', { classes: ['fa-regular', 'fa-image'] }),
    createElement('label', { 
      classes: ['labelFile'], 
      attributes: { for: 'file' }, 
      innerText: '+ Ajouter photo' 
    }),
    createElement('p', { innerText: 'jpg, png : 4mo max' }),
    createElement('input', { 
      type: 'file', 
      name: 'image', 
      id: 'file', 
      style: { display: 'none' }, 
      required: true, 
      accept: 'image/jpg, image/png' 
    }),
    createElement('img', { 
      id: 'previewImage', 
      src: '#', 
      alt: "Aperçu de l'image", 
      style: { display: 'none' } 
    })
  );

  const inputTitle = createElement('input', { 
    type: 'text', 
    name: 'title', 
    id: 'title', 
    required: true 
  });

  const selectCategory = createElement('select', { 
    id: 'categoryInput', 
    name: 'category', 
    required: true 
  });

  formAddWork.append(
    containerAddPhoto,
    createElement('label', { attributes: { for: 'title' }, innerText: 'Titre' }),
    inputTitle,
    createElement('label', { attributes: { for: 'categoryInput' }, innerText: 'Catégorie' }),
    selectCategory,
    createElement('div', { classes: ['border-line'] }),
    createElement('button', { 
      type: 'submit', 
      id: 'addWorkButton', 
      innerText: 'Valider' 
    })
  );

  modalGallery.appendChild(formAddWork);

  // Image preview
  document.addEventListener('DOMContentLoaded', () => {
    const modalAddWork = document.getElementById('modaleAddWork'); // Modale d'ajout
    const addPhotoButton = document.getElementById('addPhotoButton'); // Bouton pour ouvrir la modale
  
    if (addPhotoButton && modalAddWork) {
      addPhotoButton.addEventListener('click', () => {
        resetModalState(); // Réinitialise la modale
        modalAddWork.classList.remove('hide'); // Affiche la modale
        initFileInput(); // Initialise l'écouteur pour l'input file
      });
    }
  
    // Réinitialise l'état de la modale
    function resetModalState() {
      const formAddWork = document.getElementById('formAddWork');
      if (formAddWork) {
        formAddWork.reset(); // Réinitialise tous les champs du formulaire
      }
  
      const previewImage = document.getElementById('previewImage');
      if (previewImage) {
        previewImage.src = ''; // Supprime l'aperçu de l'image
        previewImage.style.display = 'none'; // Cache l'aperçu
      }
    }
  
    // Initialise l'écouteur d'événement pour le champ d'importation de fichier
    function initFileInput() {
      const formAddWork = document.getElementById('formAddWork');
      if (!formAddWork) {
        console.error("L'élément formAddWork est introuvable.");
        return;
      }
  
      const fileInput = formAddWork.querySelector('#file');
      if (!fileInput) {
        console.error("L'élément #file est introuvable.");
        return;
      }
  
      // Supprime les anciens écouteurs pour éviter les doublons
      fileInput.removeEventListener('change', handleFileChange);
      fileInput.addEventListener('change', handleFileChange);
    }
  
    // Gestion de l'aperçu de l'image sélectionnée
    function handleFileChange(event) {
      const file = event.target.files[0];
  
      if (!file) {
        console.warn("Aucun fichier sélectionné.");
        return;
      }
  
      if (!file.type.startsWith('image/')) {
        console.error("Le fichier sélectionné n'est pas une image valide.");
        return;
      }
  
      const reader = new FileReader();
      reader.onerror = () => {
        console.error("Une erreur s'est produite lors de la lecture du fichier.");
      };
  
      reader.onload = (e) => {
        const previewImage = document.getElementById('previewImage');
        if (!previewImage) {
          console.error("L'élément #previewImage est introuvable.");
          return;
        }
        previewImage.src = e.target.result; // Définit la source de l'image à l'aperçu
        previewImage.style.display = 'block'; // Affiche l'aperçu
      };
  
      reader.readAsDataURL(file);
    }
  });

  
}
const fileInput = document.getElementById("file");
let image; 
fileInput.addEventListener("change", function(){
  if (fileInput.files.length > 0) {
    image = fileInput.files[0];
  }
}) 

async function addWork(event) {
  event.preventDefault();
  
  const titleValue = document.getElementById('title').value;
  const categoryValue = document.getElementById('categoryInput').value;

  const formData = new FormData();
  formData.append('image', image);
  formData.append('title', titleValue);
  formData.append('category', categoryValue);

  try {
      const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          body: formData,
          headers: { 
              Accept: 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`
          },
      });

      if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Rechargement des travaux et fermeture de la modale après le succès
      await displayWorksInModal();
      loadCategories();
      closeModal();
  } catch (error) {
      console.error("Erreur lors de l'envoi de l'image:", error);
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