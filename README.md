# Project Name

[Project Instructions](./INSTRUCTIONS.md), this line may be removed once you have updated the README.md

## Description

Your project description goes here. What problem did you solve? How did you solve it?

Additional README details can be found [here](https://github.com/PrimeAcademy/readme-template/blob/master/README.md).

Notes:
    multiple genres per movie and movies per genre (many-to-many) table
    movie posters in public/images, paths in poster column of movies table
    add my posters there if I want
    home page is completed already - displays all of the movies in the database
To-do:
    [ ] STRETCH goals on home screen:
        [ ] show top 10 movies
        [ ] show movies by genre
        [ ] search bar
            [ ] bigger stretch: do this server side
    [X] on click, bring user to /details view for that movie
        [X] list *ALL* genres (use query from other assignment)
        [X] load movie details
            [X] STRETCH: keep them on refresh
            [X] react router url params: /details/1 (list movie name in url?)
    [X] "add movie" page and a way to get there
    [X] Add movie page:
        [X] inputs:
            [X] movie title
            [X] poster image URL
            [X] textarea for description
            [X] dropdown for genres
                [X] populate with genres in DB
            [X] STRETCH: allow user to add more than one genre
        [X] buttons:
            [X] cancel
                [X] return to home screen
            [X] save
                [X] add inputs to the database
                [X] bring user to home page (which includes new movie)
    [X] STRETCH: edit page
        [X] display current values
        [X] inputs
            [X] input field for changing the title of a selected movie
            [X] textarea for changing the description
            [X] means of adding genres
            [X] means of deleting genres
            [X] edit image URL / path
        [X] buttons
            [X] cancel
                [X] bring user to movie's Details page
            [X] save
                [X] update db
                [X] go to Details Page
                [ ] show new info
    [ ] STRETCH: admin screen:
        [ ] link from home page
        [ ] login form (username and password)
        [ ] only display if correct username ('camera') and password ('action') are entered
        [ ] form to add genres to database
        [ ] list of all genres in database with an 'x' to remove them from the database
            [ ] be sure to remove corresponding items in "movies_genres" table
    [X] move sagas and reducers out of index.js and into separate files
        [X] `src/redux/reducers`
        [X] `src/redux/sagas`
    [X] Invest some time in styling it up!
        [X] Research cards for your movie posters on the list page
        [X] Research grids for your movie posters on the Movie List page
    [X] Commit your code frequently! You should have at 15+ commits on a project of this size. Use branches to help break down your features.
    [X] Comment your code.
    [ ] Update this README to include a description of the project in your own words.
    [ ] add material-ui breadcrumbs: https://material-ui.com/components/breadcrumbs/