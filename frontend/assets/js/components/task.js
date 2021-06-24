//console.log( "Module/composant task chargé !" );

let task = {

  // Fonction qui va ajouter toutes les 
  // listeners necessaires a notre tache
  initTask: function (taskElement) {
    // Cibler le nom de la tache actuelle
    // Pour ça, j'utilise querySelector sur mon élément task
    // afin de trouver uniquement SON titre
    let taskNameElement = taskElement.querySelector('.task__name-display');

    // Je peux maintenant écouter l'event "click" sur cette balise
    taskNameElement.addEventListener("click", task.handleClickOnTaskName);

    // Même histoire pour le clic sur le bouton "éditer"
    let taskEditButtonElement = taskElement.querySelector('.task__button--modify');
    taskEditButtonElement.addEventListener("click", task.handleClickOnEditButton);

    // Je récupère l'input du nom de la tache
    let taskInputNameElement = taskElement.querySelector(".task__name-edit");

    // On ajoute un écouteur d'événement lors de l'appui sur une touche
    taskInputNameElement.addEventListener("keyup", task.handleKeyUpOnTaskName);

    // On écoute l'event "blur" => perte de focus de l'élément
    taskInputNameElement.addEventListener("blur", task.handleBlurOnTaskName)

    // Atelier :
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

  handleClickOnTaskName: function (evt) {
    let taskNameElement = evt.currentTarget;

    // Tout ce qu'on va faire, c'est changer la 
    // classe qui se trouve sur la tache
    // Le CSS se chargera d'afficher/masquer le p/l'input
    // En l'occurrence ici, ajouter la classe "task--edit"
    // Pour ça, je dois d'abord récupérer la tache à partir du nom
    // element.closest permet de cibler le parent le plus proche qui
    // correspond au sélecteur fourni
    let taskElement = taskNameElement.closest(".task");

    // Maintenant que j'ai mon élément task
    // je lui ajoute la classe task--edit
    taskElement.classList.add("task--edit");

    let taskNameInputElement = taskElement.querySelector(".task__name-edit");
    taskNameInputElement.focus();

  },

  handleClickOnEditButton: function (evt) {
    // On garde un handler différent pour pas se perdre
    // mais on va quand même pas coder deux fois la même chose
    // Donc au clic sur le bouton edit, on fait comme au clic sur le titre ;)
    task.handleClickOnTaskName(evt)
  },

  handleBlurOnTaskName: function (evt) {
    // Récupération de l'élément concerné 
    let taskInputNameElement = evt.currentTarget;

    // On récupère ce qui a été tapé dans l'input
    let taskNewName = taskInputNameElement.value;

    // On récupère toute la tache
    let taskElement = taskInputNameElement.closest(".task")

    let taskId = taskElement.dataset.id;

    let data = {
      title: taskNewName
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

            let taskNameElement = taskElement.querySelector(".task__name-display");
            taskNameElement.textContent = taskNewName;

            taskElement.classList.remove("task--edit");

          } else {

            alert('La modification a échoué !');

          }
        }
      )
  },

  handleKeyUpOnTaskName: function (evt) {
    // On vérifie que la touche "relachée" est bien Entrée
    // Pour ça, on utilise evt.key
    if (evt.key === "Enter") {
      task.handleBlurOnTaskName(evt);
    }
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