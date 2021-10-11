let app = {

  apiRootUrl : "http://localhost:8000",

  init: function()
  {

    // Initialisation de la liste des taches
    tasksList.initializeTasksFromAPI();

    tasksList.initializeTasksFromDOM();

    // Initialisation du formulaire d'ajout !
    taskForm.init();

    // Initialisation de la liste des catégoires !
    categoriesList.init();

    // Initialisation des filtres !
    filter.initFilter();

  }

};

document.addEventListener( "DOMContentLoaded", app.init )