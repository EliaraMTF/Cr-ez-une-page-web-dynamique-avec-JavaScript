//créer la fonction pour récuperer les données de l'api
function fetchData(){
    console.log("fetchData");
    fetch("http://localhost:5678/api/works") //Envoie une requête GET à l'URL spécifiée.
    .then(response => {                  //Traite la réponse obtenue.
        if (!response.ok) {              //Vérifie si la réponse est correcte
            throw new Error(`Erreur HTTP! Statut: ${response.status}`); //Si la réponse est incorrecte = erreur
        }
        return response.json();
    })
    .then(data => {                      //Les données JSON sont disponibles ici.
        console.log(data);               //Affiche les données dans la console (ou les traite selon vos besoins).
        injectDataIntoHTML(data);
    })
    .catch(error => {                    //Gère toute erreur qui se produit lors de la requête.
        console.error('Une erreur est survenue:', error);
    });
}
//Une fois les donner récuperés, appeler la fonction qui me permet d'injecter les données dans l'html 

//créer la fonction pour injecter les données dans l'html
function injectDataIntoHTML(data) {
    const galleryHTML = document.getElementById('gallery'); // Sélectionne la galerie

    data.forEach(work => {
        const figureHTML = document.createElement('figure'); // Crée un élément figure
        const imgHTML  = document.createElement('img');
        const figcaptionHTML = document.createElement('figcaption');

        imgHTML.src = work.imageUrl;
        imgHTML.alt = work.title;
        figcaptionHTML.innerHTML = work.title;
        figureHTML.appendChild(imgHTML);
        figureHTML.appendChild(figcaptionHTML);
        galleryHTML.appendChild(figureHTML);
    });
}

//récuperer les catégories à partir de l'api
/*function fetchCategories() {
    console.log("fetchCategories");
    fetch("http://localhost:5678/api/categories") //Envoie une requête GET à l'URL spécifiée.
        .then(response => { //Traite la réponse obtenue.
            if (!response.ok) { //Vérifie si la réponse est correcte
                throw new Error(`Erreur HTTP! Statut: ${response.status}`); //Si la réponse est incorrecte = erreur
            }
            return response.json();
        })
        .then(categories => {
            console.log(categories); // Affiche les catégories dans la console
        })
        .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des catégories:', error);
        });
}*/
//mettre en place les gestionnaire d'evenement pour le clic sur les bouton des catégories

//appeler la fonction qui récupère les données de l'api 
fetchData();

//fetchCategories();