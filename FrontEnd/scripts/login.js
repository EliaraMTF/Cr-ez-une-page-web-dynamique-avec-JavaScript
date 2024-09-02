// Déclaration d'un objet `element` contenant des références aux éléments du formulaire
const element = {
    password: document.querySelector("#password"), // Sélectionne l'élément avec l'identifiant "password" et l'assigne à `element.password`
    email: document.querySelector("#email"),  // Sélectionne l'élément avec l'identifiant "email" et l'assigne à `element.email`
    submit: document.querySelector("#submitUserInfo"), // Sélectionne le bouton avec l'identifiant "submitUserInfo" et l'assigne à `element.submit`
};

let boutonLogin = element.submit.addEventListener("click", (a) => {
    a.preventDefault();

    fetch("http://localhost:5678/api/users/login", { // Effectue une requête POST à l'API pour se connecter
        method: "POST", // Méthode HTTP pour envoyer les données au serveur
        headers: {
            Accept: "application/json", // Indique que la réponse attendue doit être en JSON
            "Content-Type": "application/json", // Indique que les données envoyées sont en JSON
        },
        body: JSON.stringify({ // Crée le corps de la requête avec les valeurs du formulaire converties en JSON
            email: element.email.value, // Valeur du champ email
            password: element.password.value, // Valeur du champ mot de passe
        }),
    })

    .then((response) => response.json()) // Convertit la réponse de l'API en JSON
    
    .then((data) => { // Traite les données JSON reçues de l'API
        sessionStorage.setItem("Token", data.token); // Enregistre le token reçu dans le stockage de session du navigateur

        if (data.message || data.error) { // Vérifie s'il y a un message ou une erreur dans les données reçues
            alert("Erreur dans l\'identifiant ou le mot de passe");  // Affiche une alerte en cas d'erreur d'identifiant ou de mot de passe
        } else {
            sessionStorage.setItem("isConnected", JSON.stringify(true)); // Si la connexion est réussie, enregistre l'état de connexion dans le stockage de session
            window.location.replace("index.html"); // Redirige l'utilisateur vers la page d'accueil ou une autre page protégée
        }
    })
    .catch((error) => {  // Gère les erreurs potentielles lors de la requête
        console.error("Erreur lors de la connexion:", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
});