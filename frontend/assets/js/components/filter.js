let filter = {

    showArchivedTasks: false,

    initFilter: function () {
        //? Bouton trier "Toutes"
        let filterButtonAll = document.querySelector('#button__All');
        filterButtonAll.addEventListener("click", filter.handleClickOnFilterButtonAll);

        //? Bouton trier "Completes"
        let filterButtonComplete = document.querySelector('#button__Complete');
        filterButtonComplete.addEventListener("click", filter.handleClickOnFilterButtonComplete);

        //? Bouton trier "Incompletes"
        let filterButtonIncomplete = document.querySelector('#button__Incomplete');
        filterButtonIncomplete.addEventListener("click", filter.handleClickOnFilterButtonIncomplete);

        //? Bouton "Voir les Archives"
        let divElementfilterButtonArchives = document.querySelector('.filters__task--archived');
        let filterButtonArchives = divElementfilterButtonArchives.querySelector('.filters__choice');
        filterButtonArchives.addEventListener("click", filter.handleClickOnFilterButtonArchives);
    },

    handleClickOnFilterButtonArchives: function (evt) {

        let currentButtonElement = evt.currentTarget;

        let allTasks = document.querySelectorAll('.task');

        if (filter.showArchivedTasks === false) {

            for (let currentTask of allTasks) {

                if (currentTask.className === "task task--archive") {

                    currentTask.style.display = "block";
                } else {
                    currentTask.style.display = "none";
                }
            }

            filter.showArchivedTasks = true;
            currentButtonElement.textContent = "Voir les tâches actives";

        } 
        else 
        {
            for (let currentTask of allTasks) {

                if (currentTask.className != "task task--archive") {

                    currentTask.style.display = "block";
                } else {
                    currentTask.style.display = "none";
                }
            }

            filter.showArchivedTasks = false;
            currentButtonElement.textContent = "Voir les archives";
        }
    },

    handleClickOnFilterButtonAll: function (evt) {

        let currentButtonElement = evt.currentTarget;

        filter.showArchivedTasks = false;
        let divElementfilterButtonArchives = document.querySelector('.filters__task--archived');
        let filterButtonArchives = divElementfilterButtonArchives.querySelector('.filters__choice');
        filterButtonArchives.textContent = "Voir les archives";

        let allButtons = document.querySelectorAll('.filters__choice');

        for (let currentButton of allButtons) {

            currentButton.classList.remove("is-info");
            currentButton.classList.remove("is-selected");

            currentButtonElement.classList.add("is-info");
            currentButtonElement.classList.add("is-selected");
        }

        let allTasks = document.querySelectorAll('.task');

        for (let currentTask of allTasks) {

            if (currentTask.className != "task task--archive") {

                currentTask.style.display = "block";
            } else {
                currentTask.style.display = "none";
            }
        }
    },

    handleClickOnFilterButtonComplete: function (evt) {

        let currentButtonElement = evt.currentTarget;

        filter.showArchivedTasks = false;
        let divElementfilterButtonArchives = document.querySelector('.filters__task--archived');
        let filterButtonArchives = divElementfilterButtonArchives.querySelector('.filters__choice');
        filterButtonArchives.textContent = "Voir les archives";

        let allButtons = document.querySelectorAll('.filters__choice');

        for (let currentButton of allButtons) {

            currentButton.classList.remove("is-info");
            currentButton.classList.remove("is-selected");

            currentButtonElement.classList.add("is-info");
            currentButtonElement.classList.add("is-selected");
        }

        let allTasks = document.querySelectorAll('.task');

        for (let currentTask of allTasks) {

            if (currentTask.className === 'task task--complete') {
                currentTask.style.display = "block";
            } else {
                currentTask.style.display = "none";
            }
        }
    },

    handleClickOnFilterButtonIncomplete: function (evt) {

        let currentButtonElement = evt.currentTarget;

        filter.showArchivedTasks = false;
        let divElementfilterButtonArchives = document.querySelector('.filters__task--archived');
        let filterButtonArchives = divElementfilterButtonArchives.querySelector('.filters__choice');
        filterButtonArchives.textContent = "Voir les archives";
        
        let allButtons = document.querySelectorAll('.filters__choice');

        for (let currentButton of allButtons) {

            currentButton.classList.remove("is-info");
            currentButton.classList.remove("is-selected");

            currentButtonElement.classList.add("is-info");
            currentButtonElement.classList.add("is-selected");
        }

        let allTasks = document.querySelectorAll('.task');

        for (let currentTask of allTasks) {

            if (currentTask.className === 'task task--todo') {
                currentTask.style.display = "block";
            } else {
                currentTask.style.display = "none";
            }
        }
    },

}