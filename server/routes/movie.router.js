const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {

  const query = `
    SELECT * FROM "movies"
    ORDER BY "title" ASC;
  `;
  pool.query(query)
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })

});

router.post('/', (req, res) => {
  console.log(req.body);
  // RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
    INSERT INTO "movies" ("title", "poster", "description")
    VALUES ($1, $2, $3)
    RETURNING "id";
  `;

  // FIRST QUERY MAKES MOVIE
  pool.query(insertMovieQuery, [req.body.title, req.body.poster, req.body.description])
  .then(result => {
    console.log('New Movie Id:', result.rows[0].id); //ID IS HERE!
    
    const createdMovieId = result.rows[0].id

    // Now handle the genre reference
    // groundwork for adding multiple genres: expect req.body.genre_id to be an array of genre_ids
    if (req.body.genre_id.length = 0) {
      //NO GENRES TO ADD
      res.sendStatus(201);
    } else {
      // init query
      let insertMovieGenreQuery = `
        INSERT INTO "movies_genres" ("movie_id", "genre_id")
        VALUES 
      `;
      // add ($1, $#) for each genre_id, to add all in one query while protecting against SQL injection
      for (const index in req.body.genre_id) {
        insertMovieGenreQuery += `($1, $${index+2}),`
      }
      // remove last character - we only need "," between insert values - and add closing ";"
      insertMovieGenreQuery = insertMovieGenreQuery.substring(0, insertMovieGenreQuery.length - 1);
      insertMovieGenreQuery += `;`
        // SECOND QUERY ADDS GENRE(S) FOR THAT NEW MOVIE
        pool.query(insertMovieGenreQuery, [createdMovieId].concat(req.body.genre_id)).then(result => {
          //Now that both are done, send back success!
          res.sendStatus(201);
        }).catch(err => {
          // catch for second query
          console.log(err);
          res.sendStatus(500)
        })
    }
// Catch for first query
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
})

// PUT for movies table
router.put('/movie/:movieId', (req, res) => {
  console.log(req.body);
  // get id
  const movieId = req.params.movieId;

  // query to update "movies" table
  const updateMovieQuery = `
    UPDATE "movies"
    SET "title" = $1,
      "poster" = $2,
      "description" = $3
    WHERE "id" = $4;
  `;

  // QUERY TO EDIT MOVIE
  pool.query(updateMovieQuery, [req.body.title, req.body.poster, req.body.description, movieId])
  .then(result => {
      res.sendStatus(201);
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
})

// PUT to update movie genres in movies_genres table
router.put('/genre/:movieId', (req, res) => {
  console.log(req.body);
  // get id
  const movieId = req.params.movieId;

  // query to update "movies" table
  const updateMovieQuery = `
    
  `;

  // QUERY TO EDIT MOVIE
  pool.query(updateMovieQuery, [req.body.title, req.body.poster, req.body.description])
  .then(result => {
      res.sendStatus(201);
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
})

router.delete('/:movieId', (req, res) => {
  // get id
  const movieId = req.params.movieId;

  // query to delete movie from "movies_genres" table and "movies" table
  const deleteMovieQuery = `
    DELETE FROM "movies_genres"
    WHERE "movie_id" = $1;
    DELETE FROM "movies"
    WHERE "id" = $1;
  `;

  // QUERY TO DELETE MOVIE
  pool.query(deleteMovieQuery, [movieId])
  .then(result => {
      res.sendStatus(201);
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
})

module.exports = router;