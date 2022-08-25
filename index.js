const exp = require('constants');
var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
(async() => {
  await Comments.sync();
  // console.log(comments === sequelize.models.comments); // true
})();


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
  const comments = await Comments.findAll();

  // console.log(comments);

  res.render('index', { comments: comments});
});

app.post('/create', async function(req, res) {
  console.log(req.body)

  const { content } = req.body
  
  // Create a new user
  const jane = await Comments.create({ content: content });
  console.log("Jane's auto-generated ID:", jane.id);

  // res.send('hi')
  res.redirect('/')
});

app.post('/update/:id', async function(req, res) {
  console.log(req.params)
  // console.log(req.body)

  const { content } = req.body
  const { id } = req.params

  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  res.redirect('/')
});

app.post('/delete/:id', async function(req, res) {
  console.log(req.params)

  // const { content } = req.body
  const { id } = req.params

  await Comments.destroy({
    where: {
      id: id
    }
  });

  // res.send('hi')
  res.redirect('/')
});

app.listen(3000);
console.log('Server is listening on port 3000');
