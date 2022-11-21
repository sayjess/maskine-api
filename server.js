const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'maskine'
    }
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(db.users)
})

app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt))
app.post('/signup', (req, res) => { signup.handleSignUp(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleAPIcall(req, res)})


app.listen(3000, () => {
    console.log("app is running on port 3000")
})