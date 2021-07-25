const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {
  const query = `SELECT * FROM "genres" ORDER BY "name" ASC`;
  pool.query(query)
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: GET all genres', err);
      res.sendStatus(500)
    })
});

router.post('/', (req, res) => {
  const query = `SELECT * FROM "genres" ORDER BY "name" ASC`;
  pool.query(query)
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: POST new genre', err);
      res.sendStatus(500)
    })
});

router.put('/:genreId', (req, res) => {
  const genreId = req.params.genreId;
  const newGenre = req.body;
  const query = `
    UPDATE "genres"
    SET "name" = $1
    WHERE "id" = $2
  `;
  pool.query(query, [newGenre, genreId])
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: PUT to edit existing genre by id', err);
      res.sendStatus(500)
    })
});

router.delete('/:genreId', (req, res) => {
  const genreId = req.params.genreId;
  const query = `
    DELETE FROM "genres"
    WHERE "id" = $1
  `;
  pool.query(query, [genreId])
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: DELETE genre by id', err);
      res.sendStatus(500)
    })
});

module.exports = router;