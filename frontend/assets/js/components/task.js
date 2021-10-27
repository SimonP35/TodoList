// Composant pour la gestion des actions sur les tâches (initialisé dans tasksList.js au chargement de la page)
let task = {

  // Méthode qui initialise les écouteurs d'évènement de notre tâche
  initTask: function (taskElement) {
    // Récupération du nom de la tâche actuelle
    let taskNameElement = taskElement.querySelector('.task__name-display');
    // Ajout de l'écouteur d'évènement "click"
    taskNameElement.addEventListener("click", task.handleClickOnTaskName);

    // Récupération du bouton "éditer"
    let taskEditButtonElement = taskElement.querySelector('.task__button--modify');
    // Ajout de l'écouteur d'évènement "click"
    taskEditButtonElement.addEventListener("click", task.handleClickOnEditButton);

    // Récupération de l'input du nom de la tache
    let taskInputNameElement = taskElement.querySelector(".task__name-edit");
    // Ajout de l'écouteur d'évènement "keyup"
    taskInputNameElement.addEventListener("keyup", task.handleKeyUpOnTaskName);
    // Ajout de l'écouteur d'évènement "blur" (perte de focus)
    taskInputNameElement.addEventListener("blur", task.handleBlurOnTaskName)

    // Récupération de tout les boutons verts pour marquer une tache comme terminée
    let taskValidateButtonElement = taskElement.querySelector(".task__button--validate");
    taskValidateButtonElement.addEventListener("click", task.handleClickOnValidateButton);

    //? Décomplétion d'une tâche     
    let taskIncompleteButtonElement = taskElement.querySelector('.task__button--incomplete');
    taskIncompleteButtonElement.addEventListener("click", task.handleClickOnIncompleteButton);

    //? Archivage d'une tâche     
    let taskArchiveButtonElement = taskElement.querySelector('.task__button--archive');
    taskArchiveButtonElement.addEventListener("click", task.handleClickOnArchiveButton);

    //? Désarchivage d'une tâche     
    let taskDesarchiveButtonElement = taskElement.querySelector('.task__button--desarchive');
    taskDesarchiveButtonElement.addEventListener("click", task.handleClickOnDesarchiveButton);

    //? Suppression d'une tâche 
    let taskDeleteButtonElement = taskElement.querySelector('.task__button--delete');
    taskDeleteButtonElement.addEventListener("click", task.handleClickOnDeleteButton);
  },

  createNewTask: function (taskNewTitle, taskNewCategory, taskNewId, taskStatus, taskNewProgressBar) {
    // Première étape, on récupère le template
    let template = document.querySelector("#task-template");

    // Cloner le contenu du template en un nouvel élément
    let newTaskFromTemplate = template.content.cloneNode(true);

    // Je change les différentes valeurs de mon nouvel élément
    newTaskFromTemplate.querySelector(".task").dataset.category = taskNewCategory;
    newTaskFromTemplate.querySelector(".task__category p").textContent = taskNewCategory;

    // Je change mon id
    newTaskFromTemplate.querySelector(".task").dataset.id = taskNewId;

    // Je change ma complétion
    newTaskFromTemplate.querySelector(".task").dataset.completion = taskNewProgressBar;

    // Pareil pour le nom de la tache
    newTaskFromTemplate.querySelector(".task__name-display").textContent = taskNewTitle;
    newTaskFromTemplate.querySelector(".task__name-edit").value = taskNewTitle;
    // Petite astuce pour avoir la value qui s'affiche également dans l'inspecteur
    // Mais ça fonctionne aussi sans, tant qu'on a fait la ligne précédente ;)
    newTaskFromTemplate.querySelector(".task__name-edit").setAttribute("value", taskNewTitle);

    newTaskFromTemplate.querySelector(".progress-bar__level").style.width = taskNewProgressBar + '%';

    task.changeCompletion(newTaskFromTemplate.querySelector(".task"), taskNewProgressBar);
    task.changeStatus(newTaskFromTemplate.querySelector(".task"), taskStatus, taskNewProgressBar)

    // On oublie pas d'initialiser notre nouvelle tache
    // pour enregistrer les écouteurs d'événement etc
    task.initTask(newTaskFromTemplate);

    // On peut ajouter notre nouvelle tache a notre page
    let taskList = document.querySelector(".tasks");
    taskList.prepend(newTaskFromTemplate);

    // BOonus organisation : On aurait pu return notre élément ici
    // puis passer l'ajout de cette nouvelle tache dans la list au composant taskList
    // C'est plus cohérent, mais plus long.

    // Bonus, vider le form
  },

  changeCompletion(taskElement, completion) {

    if (completion == 100) {

      taskElement.classList.remove("task--todo");
      taskElement.classList.add("task--complete");
      taskElement.dataset.completion = 100;

    } else {

      taskElement.classList.remove("task--complete");
      taskElement.classList.add("task--todo");
      taskElement.dataset.completion = 0;

    }

    let currentProgressBarElement = taskElement.querySelector(".progress-bar__level");
    currentProgressBarElement.style.width = completion + "%";
  },

  changeStatus(taskElement, status, completion) {

    if (status == 2) {
      taskElement.classList.remove("task--complete");
      taskElement.classList.remove("task--todo");
      taskElement.classList.add("task--archive");
    } else {
      if (completion == 100) {

        taskElement.classList.remove("task--archive");
        taskElement.classList.add("task--complete");

      } else {

        taskElement.classList.remove("task--archive");
        taskElement.classList.add("task--todo");
      }

    }
  },

  // ===========================================
  //  Events callbacks / handlers
  // ===========================================

  handleClickOnDeleteButton: function (evt) {
    let deleteButtonElement = evt.currentTarget;

    // Récupération de la tache concernée
    let taskElement = deleteButtonElement.closest(".task");

    let taskId = taskElement.dataset.id;

    let fetchOptions = {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
    };

    fetch(app.apiRootUrl + '/tasks/' + taskId, fetchOptions)

      .then(
        function (response) {
          if (response.status == 200) {

            let result = window.confirm('Etes-vous sur de vouloir supprimer cette tâche ?');

            if (result === true) {

              alert('Vous avez supprimé cette tâche !');
              taskElement.innerHTML = "";

            }
          } else {

            alert('La suppression a échoué !');
          }
        }
      )
  },

  // Handler pour le "click" sur le nom d'une tâche
  handleClickOnTaskName: function (evt) {
    // Récupération du nom de la tâche courante
    let taskNameElement = evt.currentTarget;
    // Récupération de la tâche courante à partir de son nom
    let taskElement = taskNameElement.closest(".task");
    // On ajoute la classe "task--edit" à la tâche (modification du CSS)
    taskElement.classList.add("task--edit");
    // Récupération de l'input de la tâche courante
    let taskNameInputElement = taskElement.querySelector(".task__name-edit");
    // On donne le focus à l'input
    taskNameInputElement.focus();
  },

  // Handler pour le "click" sur le bouton d'édition
  handleClickOnEditButton: function (evt) {
    // On appelle la méthode "handleClickOnTaskName" qui réalise l'action que l'on recherche
    task.handleClickOnTaskName(evt)
  },

  // Handler pour le "keyup" sur "Enter" 
  handleKeyUpOnTaskName: function (evt) {
    // On vérifie que la touche "relachée" est bien "Entrer" avec evt.key
    if (evt.key === "Enter") {
      // Si la touche relâchée est bien "Enter" on appelle la méthode "handleBlurOnTaskName"
      task.handleBlurOnTaskName(evt);
    }
  },
  
  // Handler pour le "blur" sur l'input de la tâche
  handleBlurOnTaskName: function (evt) {
    // Récupération de l'input courant 
    let taskInputNameElement = evt.currentTarget;
    // On récupère la valeur de l'input
    let taskNewName = taskInputNameElement.value;
    // On récupère la tâche relative à l'input
    let taskElement = taskInputNameElement.closest(".task")
    // On récupère l'id de la tâche à l'aide de l'attribut dataset
    let taskId = taskElement.dataset.id;

    // On stocke les données à envoyer sous la forme d'un objet JS
    let data = {
      title: taskNewName
    };

    // On prépare les entêtes HTTP de la requête afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On prépare la configuration de la requête HTTP
    let fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };

    // On déclenche la requête HTTP à l'API (via le moteur sous-jacent AJAX)
    fetch(app.apiRootUrl + '/tasks/' + taskId, fetchOptions) // Promesse de réponse a la requete
      .then( // Lorsqu'on reçoit la réponse
        function (response) 
        {
          // Si l'API nous renvoie le code "204 No Content"
          if (response.status === 204) {
            // Je récupère le nom de la tâche à partir de l'élément parent (balise <p>)
            let taskNameElement = taskElement.querySelector(".task__name-display");
            // Je modifie son contenu avec le nom de la nouvelle tâche
            taskNameElement.textContent = taskNewName;
            // Je retire la classe CSS "task--edit" afin d'afficher la balise <p>
            taskElement.classList.remove("task--edit");
          } 
          // Sinon, on gère les erreurs
          else 
          {
            // Affichage d'une fenêtre de dialogue d'erreur
            alert('La modification a échoué !');
            return;
          }
        }
      )
  },

  handleClickOnValidateButton: function (evt) {
    // Récupération de l'élément concerné 
    let validateButtonElement = evt.currentTarget;

    // Récupération de la tache concernée
    let taskElement = validateButtonElement.closest(".task");

    let taskId = taskElement.dataset.id;

    let data = {
      completion: 100
    };

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    let fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };

    fetch(app.apiRootUrl + '/tasks/' + taskId, fetchOptions)

      .then(
        function (response) {
          if (response.status == 200) {

            alert('Vous avez complété cette tâche !');
            task.changeCompletion(taskElement, 100);

          } else {

            alert('La modification a échoué !');
          }
        }
      )
  },

  handleClickOnIncompleteButton: function (evt) {
    //console.log( "Here we are !" )

    let buttonElement = evt.currentTarget;

    let taskElement = buttonElement.closest(".task");

    let taskId = taskElement.dataset.id;

    let data = {
      completion: 0
    };

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    let fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };

    fetch(app.apiRootUrl + '/tasks/' + taskId, fetchOptions)

      .then(
        function (response) {
          if (response.status === 200) {

            alert('Cette tâche est à nouveau en cours !');
            task.changeCompletion(taskElement, 0);

          } else {

            alert('La modification a échoué !');
          }
        }
      )
  },

  handleClickOnArchiveButton: function (evt) {

    let buttonElement = evt.currentTarget;

    let taskElement = buttonElement.closest(".task");

    let taskId = taskElement.dataset.id;
    let taskCompletion = taskElement.dataset.completion;

    let data = {
      status: 2
    };

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    let fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };

    fetch(app.apiRootUrl + '/tasks/' + taskId, fetchOptions)

      .then(
        function (response) {
          if (response.status === 200) {

            let result = window.confirm('Etes-vous sur de vouloir archiver cette tâche ?');

            if (result === true) {

              task.changeStatus(taskElement, 2, taskCompletion);
              tasksList.hideArchivedTasks();

            }
          } else {

            alert('L\'archivage a échoué !');
          }
        },
      )
  },

  handleClickOnDesarchiveButton: function (evt) {

    let buttonElement = evt.currentTarget;

    let taskElement = buttonElement.closest(".task");

    let taskId = taskElement.dataset.id;
    let taskCompletion = taskElement.dataset.completion;

    let data = {
      status: 1
    };

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    let fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };

    fetch(app.apiRootUrl + '/tasks/' + taskId, fetchOptions)

      .then(
        function (response) {
          if (response.status === 200) {

            let result = window.confirm('Etes-vous sur de vouloir désarchiver cette tâche ?');

            if (result === true) {

              task.changeStatus(taskElement, 1, taskCompletion);

            }
          } else {

            alert('L\'archivage a échoué !');
          }
        },
      )
  },

}