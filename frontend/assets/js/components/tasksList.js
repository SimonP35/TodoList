//console.log("Module/composant tasksList chargé !");

let tasksList = {


  initializeTasksFromAPI: function () {
    tasksList.loadTasksFromAPI();
  },

  initializeTasksFromDOM: function () {
    // Récupération des taches via le DOM
    // On prend uniquement les taches qui se trouvent dans la div .tasks
    // pour éviter de sélectionner le formulaire d'ajout (qui a aussi la classe .task)
    let taskElements = document.querySelectorAll(".tasks .task");

    // On vérifie
    //console.log( taskElements );

    // Pour chacune de ces taches, je veux déclarer les
    // différents écouteurs d'événements de ces taches
    // C'est le composants Task qui va s'en occuper
    for (let currentTaskElement of taskElements) {
      // J'appelle la méthode task.initTask
      // en donnant chacune des taches de la liste
      // a chaque itération de la boucle
      task.initTask(currentTaskElement);
    }
  },

  loadTasksFromAPI: function () {
    // On prépare la configuration de la requête HTTP
    let config = {

      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    };

    // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
    let promise = fetch(app.apiRootUrl + "/tasks", config);
    // Ensuite, lorsqu'on reçoit la réponse au format JSON
    promise.then(tasksList.ajaxResponseTasks);

  },

  ajaxResponseTasks: function (response) {
    let jsonPromise = response.json();

    jsonPromise.then(
      function (jsonResponse) {

        //console.log(jsonResponse);

        for (i = 0; i < jsonResponse.length; i++) {

          let taskNewTitle = jsonResponse[i].title;
          let taskNewCategory = jsonResponse[i].category.name;
          let taskNewProgressBar = jsonResponse[i].completion;
          let taskNewId = jsonResponse[i].id;
          let taskNewStatus = jsonResponse[i].status;

          let newTaskElement = task.createNewTask(taskNewTitle, taskNewCategory, taskNewId, taskNewStatus, taskNewProgressBar);

        }

        tasksList.hideArchivedTasks();

      },
    )
  },

  hideArchivedTasks: function () {

    let allArchivedTasksElement = document.querySelectorAll(".task--archive");
    //console.log(allArchivedTasksElement);

    for (i = 0; i < allArchivedTasksElement.length; i++) {

      allArchivedTasksElement[i].style.display = "none";

    }
  }
}