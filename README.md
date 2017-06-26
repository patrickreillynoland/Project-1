# Project 1: Chirp It On, All Or Nothing
## Due: Wednesday, June 28th, 09:00
##### Covalence
###### Full Stack: Summer 2017

## Info
* This project will be building on the Chirp Express Continuation lab
* Copy your package.json and client and server folders to this project folder
* Make sure this project folder has a `.gitignore` file with an entry for `node_modules`
* Run npm install on this project to install all your dependencies you need
* So far, Chirp Express displays a list of chirps when users go to http://localhost:3000
    * The page shown has a form with an input field for typing a chirp message, a dropdown for selecting a user, and a button for sending the chirp
    * The user selector is populated when the page first loads by making a GET request to the API for a list of users
* This project will expand upon that functionality

## Objectives - Application
* In your client folder, create a file called single_view.html
    * Tell Express to send this file when it receives a GET request to `'/chirps/*'`
    * The page will display just a single chirp
    * In the client-side JS for this page, you will need to get the URL of the current page
    * Once you have that, you will be able to figure out which chirp to get
        * ex: http://localhost:3000/chirps/12  => This page should ask for chirp 12 from the API and display it
        * This page should contain an edit button that links to `/chirps/id of the chirp/update`
            * ex: `<a href="/chirps/12/update">...</a>`
        * This page should contain a delete button that, when clicked, pops up a confirmation asking if we should delete
            * If the user confirms, a DELETE request should be sent to the server to delete the chirp. When that is successful, navigate back to to chirp list page
* In your client folder, create a file called single_update.html
    * Tell Express to send this file when it receives a GET request to `'/chirps/*/update'`
    * This page will contain an input box for the message of the chirp
    * It will also display the chirp author's name, but it will not be in an editable format
    * When the page loads, look at the url and figure out which chirp to GET from the API
    * Populate the message input box with the text of the chirp returned from the server
    * After a user changes the message, clicking the Update button will cause an API call to update the chirp
        * When that is successful, navigate back to the single chirp page for this chirp
* In your client folder, rename index.html to list.html
    * Tell Express to send this file when it receives a GET request to `/chirps`
    * As before, this file will get all chirps and display a list of them
    * However, now each chirp's row should link to `/chirps/id of the chirp`
        * ex. `<a href="/chirps/12">...</a>`
    * Remove the delete button from this page
* In your client folder, create a file called index.html
    * This is your home/landing page
    * Simply welcome the user to Chirper and have a button that links to `/chirps`
        * Going to `/chirps` will show the chirp list view

## Objectives - Database
* Your Express application should already handle RESTful requests for:
    * getting all chirps - Gets all chirps from the database
    * create a new chirp - Receives a chirp with properties `message` and `userId`. Inserts the chirp into the database and responds with the id of the inserted chirp
    * getting a single chirp - Looks at the id route parameter and gets the chirp from the database with that id
    * updating a single chirp - Looks at the id route parameter and updates the chirp in the db that has that id with the new message in the request body
    * deleting a single chirp - Looks at the id route parameter and deletes the chirp in the db that has that id
* If you haven't already, write the stored procedures in your Chirper MySQL database to perform these RESTful actions

## Tips/Hints
* You may find `window.location.pathname` useful to use on the front-end
* This project exposes you to the concept that Express lets you craft arbitrary routes
    * We are arbitrarily choosing to respond to `/chirps` with list.html
    * The same goes for update
    * These paths don't correspond to folders on our computer, but that's okay
    * People talking to our server don't need to know about our server's folder structure
    * We're making our front-end, so we decided that `/` shows the welcome page, `/chirps` shows the list, and `/chirps/*` shows the single chirp page
        * Why? Our URLs look much neater and we don't have to have a single html page for every single chirp
* In any script or css imports for your own files (not CDN hosted files), you will need to start your href/src with a `/`
    * ex: `<script src="/scripts.js"></script>`
* You will want separate JS files for list, single view, and single update
* The order of Express route handlers matter!
    * Starts from the top, works its way down
    * If we're looking for `/chirps/*` before `/chirps/*/update`, we will never make it to update!
        * The first one says "anything after `chirps/`
        * Therefore, make sure you adjust the order of your route handlers accordingly