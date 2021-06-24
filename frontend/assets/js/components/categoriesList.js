//console.log("Chargement du composant categoriesList ok !");

let categoriesList = {

    init : function()
    {
        categoriesList.loadCategoriesFromAPI();
    },

    loadCategoriesFromAPI : function()
    {
        // On prépare la configuration de la requête HTTP
        let config = {

            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
        let promise = fetch( app.apiRootUrl + "/categories", config);
        // Ensuite, lorsqu'on reçoit la réponse au format JSON
        promise.then( categoriesList.ajaxResponse );
    },   

    ajaxResponse : function ( response )
    {
        let jsonPromise = response.json();

        jsonPromise.then(
            function ( jsonResponse )
            {
                //console.log(jsonResponse);

                let divNavFilterElement = document.querySelector(".filters__task--category");

                let selectNavFilterElement = document.createElement("select");
                divNavFilterElement.appendChild(selectNavFilterElement);

                selectNavFilterElement.classList.add('filters__choice__add');
                //console.log(selectNavFilterElement);
             
                for (i = 0; i < jsonResponse.length; i++) {

                    optionItem = document.createElement('option');
                    optionItem.textContent = jsonResponse[i].name;
                    optionItem.setAttribute( "value", jsonResponse[i].id );
                    selectNavFilterElement.appendChild(optionItem);
                }

                let divAddFilterElement = document.querySelector(".task__category .select");

                let selectAddFilterElement = document.createElement("select");
                divAddFilterElement.appendChild(selectAddFilterElement);

                //e.log(selectAddFilterElement);

                for (i = 0; i < jsonResponse.length; i++) {

                    optionItem = document.createElement('option');
                    optionItem.textContent = jsonResponse[i].name;
                    optionItem.setAttribute( "value", jsonResponse[i].id );
                    selectAddFilterElement.appendChild(optionItem);
                }
            }
        )
    }
};