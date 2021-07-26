const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

// GET list of movies
router.get('/', (req, res) => {
  if (req.body.genre_id === undefined){
    // if user hasn't specified a genre,
    // get all movies
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
  } else {
    // if user has specified a genre,
    // only get movies with that genre
    const query = `
      SELECT "movies"."id", "movies"."title", "movies"."poster", "movies"."description"
      FROM "movies"
      JOIN "movies_genres" ON "movies"."id" = "movies_genres"."movie_id"
      WHERE "movies_genres"."genre_id" = $1;
    `;
    pool.query(query, [req.body.genre_id])
      .then( result => {
        res.send(result.rows);
      })
      .catch(err => {
        console.log('ERROR: Get all movies in specified genre', err);
        res.sendStatus(500)
      })
  };
});

router.get('/details/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  const query = `
    SELECT "movies"."id", "movies"."title", "movies"."poster", "movies"."description", array_agg("genres"."name") AS "genreList", array_agg("genres"."id") AS "genreIdList"
    FROM "movies"
    JOIN "movies_genres" ON "movies"."id" = "movies_genres"."movie_id"
    JOIN "genres" ON "genres"."id" = "movies_genres"."genre_id"
    WHERE "movies"."id" = $1
    GROUP BY "movies"."id", "movies"."title", "movies"."poster", "movies"."description";
  `;
  pool.query(query, [movieId])
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get movie details', err);
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
    // groundwork for adding multiple genres: expect req.body.genre_ids to be an array of genre_ids
    if (req.body.genre_ids.length = 0) {
      //NO GENRES TO ADD
      res.sendStatus(201);
    } else {
      // init query
      let insertMovieGenreQuery = `
        INSERT INTO "movies_genres" ("movie_id", "genre_id")
        VALUES 
      `;
      // add ($1, $#) for each genre_id, to add all in one query while protecting against SQL injection
      for (const index in req.body.genre_ids) {
        insertMovieGenreQuery += `($1, $${index+2}),`
      }
      // remove last character - we only need "," between insert values - and add closing ";"
      insertMovieGenreQuery = insertMovieGenreQuery.substring(0, insertMovieGenreQuery.length - 1);
      insertMovieGenreQuery += `;`
        // SECOND QUERY ADDS GENRE(S) FOR THAT NEW MOVIE
        pool.query(insertMovieGenreQuery, [createdMovieId].concat(req.body.genre_ids)).then(result => {
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
router.put('/:movieId', (req, res) => {
  console.log(req.body);
  // get movieId and any associated genre_ids
  const movieId = Number(req.params.movieId);
  const genreIdArray = req.body.genre_ids;

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
    // query to edit "movies" table succeeded
    // CONSTRUCT QUERY TO UPDATE "movies_genres" TABLE
  
    // REMOVE GENRES THAT NO LONGER APPLY
    // if genreIdArray is empty, delete all genres
    let removeGenres = `
      DELETE FROM "movies_genres"
      WHERE "movie_id" = $1
    `;

    // otherwise, only delete genres not in genreIdArray
    let placeholderString = "(";
    for (const index in genreIdArray) {
      placeholderString += `$${Number(index) + 2},`;
    }
    // replace trailing "," with ");" to close parentheses and end delete
    placeholderString = placeholderString.substring(0, placeholderString.length - 1);
    placeholderString += `);`

    if ( genreIdArray.length > 0 ) {
      removeGenres += `AND "genre_id" NOT IN ${placeholderString}`;
    }

    // REMOVE GENRES THAT NO LONGER APPLY
    pool.query(removeGenres, [movieId].concat(genreIdArray))
    .then(result => {
      // ADD ANY GENRES NOT IN "movies_genres" TABLE
      for (const genreId of genreIdArray) {
        const checkIfExistQuery = `
          SELECT COUNT("id") FROM "movies_genres" 
          WHERE "movie_id" = $1
          AND "genre_id" = $2;
        `;
        pool.query(checkIfExistQuery, [movieId, genreId])
        .then(result => {
          console.log("checkIfExistQuery result", result.rows[0].count);
          if (Number(result.rows[0].count) === 0) {
            // if genre isn't already in db, add it
            const insertQuery = `
              INSERT INTO "movies_genres" ("movie_id", "genre_id")
              VALUES ($1, $2);
            `;
            pool.query(insertQuery, [movieId, genreId])
          .then(result => {
            console.log("insertQuery", movieId, genreId);
            if(genreId === genreIdArray[genreIdArray.length - 1]){
              //only send success status on last insert
              res.sendStatus(201);
            }
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500)
          })
          }
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(500)
        })
      }

    }).catch(err => {
      // catch for query to remove genres not in array
      console.log(err);
      res.sendStatus(500)
    })

  }).catch(err => {
    // catch for query to edit movie
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