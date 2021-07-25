const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {

  const query = `SELECT * FROM movies ORDER BY "title" ASC`;
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
  RETURNING "id";`

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
      // remove last character - an we only need "," between insert values - and add closing ";"
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

module.exports = router;