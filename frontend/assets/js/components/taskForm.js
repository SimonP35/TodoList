// Composant du formulaire d'ajout d'une tâche (initialisé dans app.js au chargement de la page)
let taskForm = {

  // Méthode qui initialise le formulaire d'ajout d'une tâche
  init: function () {
    // Récupération du formulaire d'ajout
    let formElement = document.querySelector(".task--add form");
    // Ajout de l'écouteur d'évènement
    formElement.addEventListener("submit", taskForm.handleFormSubmit)
  },

  // Handler pour la soumission du formulaire
  handleFormSubmit: function (evt) {
    // On bloque le comportement par défaut du navigateur (rechargement de page)
    evt.preventDefault();
    // Récupération du formulaire
    let formElement = evt.currentTarget;
    // Récupération de l'input du formulaire et de sa valeur :
    let taskNewNameElement = formElement.querySelector(".task__name-edit");
    let taskNewName = taskNewNameElement.value;
    // Récupération du select du formulaire et de sa valeur :
    let taskCategorySelectElement = formElement.querySelector(".task__category select");
    let taskCategory = taskCategorySelectElement.value;

    // On stocke les données à envoyer sous la forme d'un objet JS
    let data = {
      title: taskNewName,
      categoryId: taskCategory,
      status: 1,
      completion: 0
    };

    // On prépare les entêtes HTTP de la requête afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On prépare la configuration de la requête HTTP
    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };

    // On déclenche la requête HTTP à l'API (via le moteur sous-jacent AJAX)
    fetch(app.apiRootUrl + "/tasks", fetchOptions) // Promesse de réponse a la requete
      .then( // Lorsqu'on reçoit la réponse
        function (response) 
        {
          // Si l'API nous renvoie le code "201 Created"
          if (response.status === 201) 
          {
            // on renvoi une "promesse de conversion en json"
            return response.json(); 
          } 
          // Sinon, on gère les erreurs
          else 
          {
            // Affichage d'une fenêtre de dialogue d'erreur
            alert("La création a échoué !");
            return;
          }
        }
      )
      .then( // Lorsqu'on reçoit la réponse en JSON
        function (jsonResponse) {
          // On ajoute notre nouvelle tache grace à la méthode "createNewTask" du composant Task
          task.createNewTask(jsonResponse.title, jsonResponse.category.name, jsonResponse.id);
          // On vide le contenu de l'input et on redonne le focus à l'input (ajout de tâche à la suite)
          document.querySelector('.task__name-edit').value = "";
          document.querySelector('.task__name-edit').focus();
          // Affichage d'une fenêtre de dialogue de succès
          alert('La nouvelle tâche a été créée !');
        }
      )
  },
}