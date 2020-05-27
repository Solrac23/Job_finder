const express    = require('express');
const exphbs     = require('express-handlebars');
const path       = require('path');
const app        = express();
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;

// connection server in the port 3000
app.listen(3000, function() {
  console.log('O express está rodando na porta 3000');
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set('views', path.join(__dirname, 'views')); // onde irá ficar as views do layout
app.engine('handlebars', exphbs({ defaultLayout: 'main' })); // arquivo principal do layout
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db
  .authenticate()
  .then(() => {
    console.log('Conectou ao banco com sucesso');
  })
  .catch(err => {
    console.log('Ocorreu um erro ao conectar', err);
  });

// routes
app.get('/', (req, res) => {

  let search = req.query.job;
  let query = '%'+search+'%' // PH -> PHP 

  if(!search){
    Job.findAll({ order: [
        ['createdAt', 'DESC']
    ]})
    .then(jobs => {
  
      res.render('index', {
        jobs
      });
    })
    .catch(err => console.log(err));
  }else {
    Job.findAll({
      where: {title: {[Op.like]: query}},
      order: [
        ['createdAt', 'DESC']
    ]})
    .then(jobs => {
  
      res.render('index', {
        jobs, search
      });
  
    })
    .catch(err => console.log(err));
  };
});

// job routes
app.use('/jobs', require('./routes/jobs'));