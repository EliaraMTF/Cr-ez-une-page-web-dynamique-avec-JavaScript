//appeler la fonction qui récupère les données de l'api 
fetch("http://localhost:5678/api-docs/") //Envoie une requête GET à l'URL spécifiée.
    .then(response => {                  //Traite la réponse obtenue.
        if (!response.ok) {              //Vérifie si la réponse est correcte
            throw new Error(`Erreur HTTP! Statut: ${response.status}`); //Si la réponse est incorrecte = erreur
        }
        return response.json();
    })
    .then(data => {                      //Les données JSON sont disponibles ici.
        console.log(data);               //Affiche les données dans la console (ou les traite selon vos besoins).
    })
    .catch(error => {                    //Gère toute erreur qui se produit lors de la requête.
        console.error('Une erreur est survenue:', error);
    });
//créer la fonction pour récuperer les données de l'api
    
//Une fois les donner récuperés, appeler la fonction qui me permet d'injecter les données dans l'html 

    //créer la fonction pour injecter les données dans l'html

//récuperer les catégories à partir de l'api

//mettre en place les gestionnaire d'evenement pour le clic sur les bouton des catégories
