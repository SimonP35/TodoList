//console.log( "Module/composant taskForm chargé !" );

let taskForm = {

  init: function () {
    // Récupération du formulaire d'ajout
    let formElement = document.querySelector(".task--add form");
    formElement.addEventListener("submit", taskForm.handleFormSubmit)
  },

  // ===========================================
  //  Events callbacks / handlers
  // ===========================================

  handleFormSubmit: function (evt) {
    // On dit au navigateur de ne pas recharger la page 
    // lors de la soumission du form
    evt.preventDefault();

    // Récupération du formulaire
    let formElement = evt.currentTarget;

    // Récupération des valeurs des input form :
    let taskNewNameElement = formElement.querySelector(".task__name-edit");
    let taskNewName = taskNewNameElement.value;

    console.log(taskNewName);

    // Pareil pour le nom de la catégorie
    let taskCategorySelectElement = formElement.querySelector(".task__category select");
    let taskCategory = taskCategorySelectElement.value;

    const data = {
      title: taskNewName,
      categoryId: taskCategory,
      status: 1,
      completion: 0
    };

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: httpHeaders,
      body: JSON.stringify(data)
    };

    fetch(app.apiRootUrl + "/tasks", fetchOptions) // <= Promesse de réponse a la requete

      // A partir d'ici, on a une promesse de réponse
      .then( // <= Lorsqu'on reçoit la réponse
        function (response) {
          // Si l'API nous réponds que c'est ok (code 201 Created)
          if (response.status === 201) {
            return response.json(); // <= on renvoi une "promesse de conversion en json"
          } else // Sinon, on gère les erreurs
          {
            alert("La création a échoué !");
            return;
          }
        }
      )

      .then( // <= Lors qu'on reçoit la réponse convertie en JSON
        function (jsonResponse) {

          task.createNewTask(jsonResponse.title, jsonResponse.category.name, jsonResponse.id);

          document.querySelector('.task__name-edit').value = "";
          document.querySelector('.task__name-edit').focus();

          alert('La nouvelle tâche a été créée !');

        }
      )
  },
}