// Stocker toutes les données des images
let allData = []; // Variable globale pour stocker toutes les données des images

// Fonction pour récupérer les données des images
function fetchData() {
    fetch("http://localhost:5678/api/works") // Envoie une requête GET à l'URL spécifiée.
        .then(response => {                  
            if (!response.ok) {              
                throw new Error(`Erreur HTTP! Statut: ${response.status}`); 
            }
            return response.json();
        })
        .then(data => {                     
            allData = data;  // Stocker les données globalement
            injectDataIntoHTML(data); // Injecter toutes les données initialement   
        })
        .catch(error => {                    
            console.error('Une erreur est survenue:', error);
        });
}

// Fonction pour injecter les données dans l'HTML
function injectDataIntoHTML(data) {
    const galleryHTML = document.getElementById('gallery'); // Sélectionne la galerie
    galleryHTML.innerHTML = ''; // Vide la galerie avant d'ajouter de nouveaux éléments

    data.forEach(work => {
        const figureHTML = document.createElement('figure'); // Crée un élément figure
        const imgHTML = document.createElement('img');
        const figcaptionHTML = document.createElement('figcaption');

        imgHTML.src = work.imageUrl;
        imgHTML.alt = work.title;
        figcaptionHTML.innerHTML = work.title;
        figureHTML.appendChild(imgHTML);
        figureHTML.appendChild(figcaptionHTML);
        galleryHTML.appendChild(figureHTML);
    });
}

// Fonction pour récupérer les catégories à partir de l'API
function fetchCategories() {
    fetch("http://localhost:5678/api/categories") 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`Erreur HTTP! Statut: ${response.status}`); 
            }
            return response.json();
        })
        .then(categories => {
            displayCategories(categories); // Afficher les catégories
        })
        .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des catégories:', error);
        });
}

// Fonction pour afficher les boutons de catégories
function displayCategories(dataCategories) {
    const objectsHTML = document.getElementById('objectCategories');

    // Créer le bouton "Tous"
    const allButtonHTML = document.createElement('button');
    allButtonHTML.value = 'Tous';
    allButtonHTML.classList.add('category-button', 'active'); // "Tous" est actif par défaut
    allButtonHTML.innerHTML = 'Tous';
    allButtonHTML.addEventListener("click", () => filterByCategory('Tous'));
    objectsHTML.appendChild(allButtonHTML);
    
    // Créer un bouton pour chaque catégorie
    dataCategories.forEach(category => {
        const buttonHTML = document.createElement('button');
        buttonHTML.value = category.name;
        buttonHTML.classList.add('category-button'); 
        buttonHTML.innerHTML = category.name;
        buttonHTML.addEventListener("click", () => filterByCategory(category.name)); // Ajouter l'événement pour le filtrage
        objectsHTML.appendChild(buttonHTML);
    });

    // Ajouter l'événement pour rendre les boutons actifs
    addActiveClassToButtons();
}

// Fonction pour filtrer les données par catégorie
function filterByCategory(categoryName) {

    let filteredData;
    if (categoryName === 'Tous') {
        filteredData = allData; // Si "Tous" est sélectionné, on affiche tout
    } else {
        // Filtrer les données par le nom de la catégorie
        filteredData = allData.filter(work => work.category.name === categoryName);
    }

    injectDataIntoHTML(filteredData); // Réinjecter les données filtrées dans l'HTML
}

// Fonction pour ajouter la classe 'active' aux boutons pour gerer les couleurs 
function addActiveClassToButtons() {
    const buttons = document.querySelectorAll('.category-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
        });
    });
}

function checkToken() {
    // Vérifier la présence du Token dans la sessionStorage
    const tokenStorage = sessionStorage.getItem("Token");
    if (tokenStorage) {
        // Afficher le bouton modifier
        document.getElementById('edit-works').classList.remove('hide');

        // Changer le texte du lien "login" en "logout"
        const loginLink = document.getElementById('Log');
        loginLink.textContent = 'logout';
        // Modifier l'attribut href pour pointer vers la fonction de déconnexion
        loginLink.href = '#';
        loginLink.onclick = logout; // Associer l'événement de clic à la déconnexion
    } else {
        document.getElementById('edit-works').classList.add('hide');
    }
}

function logout() {
    // Effacer le Token du localStorage et sessionStorage
    localStorage.removeItem("Token");
    sessionStorage.removeItem("Token");

    // Changer le texte du lien "logout" en "login"
    const loginLink = document.getElementById('Log');
    loginLink.textContent = 'login';
    // Masquer le bouton modifier
    document.getElementById('edit-works').classList.add('hide');
}

document.addEventListener("DOMContentLoaded", () => {
    const addPhotoButton = document.getElementById("addPhotoButton");
    const formAddWork = document.getElementById("formAddWork");
    const modaleAddWork = document.getElementById("modaleAddWork");

    // Afficher la modale au clic sur "Ajouter une photo"
    if (addPhotoButton && modaleAddWork) {
        addPhotoButton.addEventListener("click", () => {
            modaleAddWork.classList.remove("hide");
        });
    } else {
        console.error("Le bouton 'Ajouter une photo' ou la modale 'modaleAddWork' est introuvable.");
    }

    // Ajouter un écouteur de soumission au formulaire pour `addWork`
    if (formAddWork) {
        formAddWork.addEventListener("submit", addWork);
    } else {
        console.error("Le formulaire 'formAddWork' est introuvable.");
    }
});

// Appeler les fonctions qui récupèrent les données de l'API 
fetchData();
fetchCategories();
checkToken()