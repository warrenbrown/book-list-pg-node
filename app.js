const express = require('express');
const mustacheExpress = require('mustache-express');
const mustache = mustacheExpress();
require('dotenv').config();
const app = express();

console.log(process.env);

mustache.cache = null;

app.engine('mustache', mustache)
app.set('view engine', 'mustache');

app.use(express.static('public'));

app.get('/', function(req, res) {
res.render('index')
});

app.listen(3000, function(){
  console.log('Server is running on port 3000')
})
