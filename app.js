const express = require('express');
const mustacheExpress = require('mustache-express');
const mustache = mustacheExpress();
const bodyParser = require('body-parser');
const booksController = require('./controllers/booksController');

require('dotenv').config();
const app = express();


mustache.cache = null;

app.engine('mustache', mustache)
app.set('view engine', 'mustache');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));












app.listen(3000, function(){
  console.log('Server is running on port 3000')
});

//fire up the booksController
booksController(app);
