# Backend

C'est qu'il faut penser à coder notre backend maintenant :astonished:

Et après avoir mis en place un petit framework, on va désormais utiliser _Lumen_, le micro-framework de _Laravel_ !

<details><summary>réaction attendue...</summary>

![](https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif)

<details><summary>ou...</summary>

![](https://media.giphy.com/media/b5LTssxCLpvVe/giphy.gif)

<details><summary>ou...</summary>

![](https://media.giphy.com/media/BlVnrxJgTGsUw/giphy.gif)

<details><summary>ou...</summary>

![](https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif)

<details><summary>tu as saisi l'idée ?</summary>

![](https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif)

</details>

</details>

</details>

</details>

</details>

## Etapes

### #1 Configuration :wrench:

- installer les dépendances `composer install`
- créer le fichier de config `.env` (équivalent de notre `app/config.ini`)
  - dupliquer le fichier `.env.example`
  - renommer la copie en `.env`
  - puis renseigner les valeurs dans le fichier `.env`
- dans le fichier `bootstrap/app.php`
  - la ligne `$app->withEloquent();` est décommentée (par défaut, elle est commentée)
  - la ligne `$app->withFacades();` est décommentée (par défaut, elle est commentée)
- **Eloquent** est [un ORM](https://fr.wikipedia.org/wiki/Mapping_objet-relationnel) respectant la conception _Active Record_
- [les **Facades**](https://fr.wikipedia.org/wiki/Fa%C3%A7ade_(patron_de_conception)) permettent de simplifier l'utilisation de certaines fonctionnalités de _Lumen_
  - sans `facade` :
    ```php
    $results = app('db')->select("SELECT * FROM users");
    ```
  - avec `facade` :
    ```php
    $results = DB::select("SELECT * FROM users");
    ```
  - ça fonctionne tout autant, mais c'est plus simple !

### #2 Première page :one:

- la route pour la première page est déjà codée
- mais ce n'est pas le cas du _Controller_ et de la méthode du _Controller_
- analyse la déclaration de la route pour connaître le nom du _Controller_ à déclarer
  - [cette doc sur le routage](https://lumen.laravel.com/docs/routing) peut aider
- créer ce _Controller_
  - [cette doc sur les _Controllers_](https://lumen.laravel.com/docs/controllers) peut aider
- déclarer la méthode
  - et y placer un petit _echo_
- la page est désormais consultable via un navigateur
  - pour vérifier, on va lancer un serveur Web spécifique, celui de PHP (et oui, pas de Apache cette fois encore)
  - dans le terminal, se placer à la racine du projet/dépôt
  - exécuter : `php -S 0.0.0.0:8080 -t public` (comme en S06 :tada:)
- désormais, on pourrait générer du code HTML grâce [aux _Views_ (et sa doc)](https://lumen.laravel.com/docs/views)
- mais on veut surtout générer du code JSON, donc pas de _View_...

### #3 Retourner un JSON :books:

- créer une route avec les infos suivantes :
  - URL : `/categories`
  - HTTP Method : `GET`
  - _Controller_ : `CategoryController`
  - Method : `list`
- coder le _Controller_ et déclarer la méthode
- retourner la version JSON du tableau ci-dessous
  - [cette doc sur les Responses HTTP](https://lumen.laravel.com/docs/responses#json-responses) peut aider

<details><summary>Tableau</summary>

```php
$categoriesList = [
  1 => [
    'id' => 1,
    'name' => 'Chemin vers O\'clock',
    'status' => 1
  ],
  2 => [
    'id' => 2,
    'name' => 'Courses',
    'status' => 1
  ],
  3 => [
    'id' => 3,
    'name' => 'O\'clock',
    'status' => 1
  ],
  4 => [
    'id' => 4,
    'name' => 'Titre Professionnel',
    'status' => 1
  ]
];
```

</details>

### #4 Retourner les données d'un élément en particulier :notebook:

- créer une route avec les infos suivantes :
  - URL : `/categories/[id]` où `[id]` est une portion dynamique de l'URL (mais il faut bien [lire cette doc](https://lumen.laravel.com/docs/routing#required-parameters))
  - HTTP Method : `GET`
  - _Controller_ : `CategoryController`
  - Method : `item`
- coder le _Controller_ et déclarer la méthode
- récupérer la portion dynamique de l'URL, nommée `id`
- récupérer ensuite les données sur la catégorie de cet `id`
  - utiliser le tableau de l'étape précédente
  - et oui, on va copier-coller ce tableau :scream:
- retourner la version JSON de ces données

### #5 404 not found :no_entry_sign:

- on va améliorer le code du _Endpoint_ de l'étape précédente
- si l'id fourni n'existe pas dans notre tableau, alors, on envoie une erreur 404 (sans affichage)
  - [cette doc sur les _Exceptions HTTP_](https://laravel.com/docs/errors#http-exceptions) peut aider

### #6 Parce que c'est cool :sunglasses:

- on peut lire [la doc sur les redirections](https://lumen.laravel.com/docs/responses#redirects)
- on peut lire [la doc sur les logs](https://laravel.com/docs/logging#writing-log-messages)
- on pourrait lire [toute la doc](https://lumen.laravel.com/docs), mais ça serait fastidieux :dizzy_face:
- on ira donc piocher dedans quand on aura un besoin :relieved:
