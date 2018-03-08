const express = require('express');
const mustacheExpress = require('mustache-express');
const mustache = mustacheExpress();
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();
const app = express();


mustache.cache = null;

app.engine('mustache', mustache)
app.set('view engine', 'mustache');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/books', function(req, res) {
  const client = new Client();
  client.connect()
    .then(() => {
      console.log('connections complete');
      //do query stuff
      return client.query('SELECT * FROM books');
    })
      .then((results) => {
        console.log('results?', results);
        res.render('index', {books: results.rows});
      })
        .catch((err) => {
          console.log('error', err);
          res.send('Something bad happened');
        });

});

app.get('/book/add', function(req, res) {
  res.render('book-form');
});

app.post('/book/add', function(req, res){
  console.log('post body', req.body);

const client = new Client();
client.connect()
  .then(() => {
    console.log('connection complete')
    //do querey stuff
    const sql = 'INSERT INTO books (title, authors) VALUES ($1, $2)'
    const params = [req.body.title, req.body.authors];
    return client.query(sql, params);
  })
    .then((result) => {
      console.log('result?', result);
      res.redirect('/books');
    })
      .catch((err) => {
        console.log('err', err);
        res.redirect('/books');
      });
});

app.post('/book/delete/:id', function(req, res) {
  console.log('deleting id', req.params.id);

  const client = new Client();
  client.connect()
    .then(() => {
      const sql = 'DELETE FROM books WHERE book_id = $1'
      const params = [req.params.id]
      return client.query(sql, params)
        .then((results) => {
          console.log('delete results', results);
          res.redirect('/books');
        })
          .catch((err) => {
            console.log('error', err);
            res.redirect('/books');
          });
    });
});

app.get('/book/edit/:id', function(req, res) {
  console.log('editing id', req.params.id);

  const client = new Client();
  client.connect()
    .then(() => {
      const sql = 'SELECT * FROM books WHERE book_id = $1'
      const params = [req.params.id]
      return client.query(sql, params);
    })
      .then((results) => {

        if (results.rowCount === 0) {
          res.redirect('/books');
          return;
        }
        res.render('book-edit', { book: results.rows[0] });
      })
        .catch((err) => {
          console.log("errr", err);
          res.redirect('/books');
        });
});

app.post('/book/edit/:id', function(req, res) {
  const client = new Client();
  client.connect()
    .then(() => {
      const sql = 'UPDATE books SET title= $1, authors= $2 WHERE book_id = $3';
      const params = [req.body.title, req.body.authors, req.params.id];
      return client.query(sql, params);
    })
    .then ((results) => {
      console.log('Update results', results);
      res.redirect('/books');
    })
    .catch((err) => {
      console.log('error', err);
      res.redirect('/books');
    });
});

app.listen(3000, function(){
  console.log('Server is running on port 3000')
});
