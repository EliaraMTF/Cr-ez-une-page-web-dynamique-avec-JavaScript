// Déclaration d'un objet `element` contenant des références aux éléments du formulaire
const element = {
    // Sélectionne l'élément avec l'identifiant "password" et l'assigne à `element.password`
    password: document.querySelector("#password"),
    
    // Sélectionne l'élément avec l'identifiant "email" et l'assigne à `element.email`
    email: document.querySelector("#email"),
    
    // Sélectionne le bouton avec l'identifiant "submitUserInfo" et l'assigne à `element.submit`
    submit: document.querySelector("#submitUserInfo"),
};

let boutonLogin = element.submit.addEventListener("click", (a) => {
    // Empêche le rechargement de la page 
    a.preventDefault();

    // Effectue une requête POST à l'API pour se connecter
    fetch("http://localhost:5678/api/users/login", {
        method: "POST", // Méthode HTTP pour envoyer les données au serveur
        headers: {
            Accept: "application/json", // Indique que la réponse attendue doit être en JSON
            "Content-Type": "application/json", // Indique que les données envoyées sont en JSON
        },
        body: JSON.stringify({
            // Crée le corps de la requête avec les valeurs du formulaire converties en JSON
            email: element.email.value, // Valeur du champ email
            password: element.password.value, // Valeur du champ mot de passe
        }),
    })
    // Convertit la réponse de l'API en JSON
    .then((response) => response.json())
    // Traite les données JSON reçues de l'API
    .then((data) => {
        // Enregistre le token reçu dans le stockage de session du navigateur
        sessionStorage.setItem("Token", data.token);

        // Vérifie s'il y a un message ou une erreur dans les données reçues
        if (data.message || data.error) {
            // Affiche une alerte en cas d'erreur d'identifiant ou de mot de passe
            alert("Erreur dans l\'identifiant ou le mot de passe");
        } else {
            // Si la connexion est réussie, enregistre l'état de connexion dans le stockage de session
            sessionStorage.setItem("isConnected", JSON.stringify(true));
            // Redirige l'utilisateur vers la page d'accueil ou une autre page protégée
            window.location.replace("index.html");
        }
    })
    // Gère les erreurs potentielles lors de la requête
    .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
});