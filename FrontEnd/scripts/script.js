// Stocker toutes les données des images
let allData = []; // Variable globale pour stocker toutes les données des images

// Fonction pour récupérer les données des images
function fetchData() {
    console.log("fetchData");
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
            console.log(data);     
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
    console.log("fetchCategories");
    fetch("http://localhost:5678/api/categories") 
        .then(response => { 
            if (!response.ok) { 
                throw new Error(`Erreur HTTP! Statut: ${response.status}`); 
            }
            return response.json();
        })
        .then(categories => {
            console.log(categories); 
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
    console.log("Filtrage par catégorie:", categoryName);

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
    const dataToken = sessionStorage.getItem('Token');
    
    if (dataToken && dataToken !== "") {
       const logHTML =  document.getElementById("Log");
        // changer login en Logout
        logHTML.innerHTML = 'Logout';
        displayModif();
    }
}

function displayModif(){
    const modifHTML = document.getElementById("modif");
    // enlever la classe 'notDisplay'
    modifHTML.classList.remove('notDisplay');
}

// Créer gestionnaire d'evenement pour le bouton 'modifier' 

// Si clic appel de la fonction pour afficher la modale 
function displayModale() {
    console.log('Modale')
}


function logout() {
    // Effacer Token dans le storage 
    // Changer logout en login
}

// ajouter le bouton 'modifier' à coter de "Mes projets"



// Appeler les fonctions qui récupèrent les données de l'API 
checkToken();
fetchData();
fetchCategories();
