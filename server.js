const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


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

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('something went wrong'))
        } else {
            res.status(400).json('Invalid credentials')
        }
    })
    .catch(err => res.status(400).json('invalid credentials'))
})

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({ 
            hash: hash,
            email: email
         })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: capitalizeFirstLetter(name),
                email: loginEmail[0].email,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to join'))
})

//for future development
app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    db.select('*').from('users').where({ id })
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(404).json("no such user")
        }
    })
    .catch(err => res.status(404).json("error getting user"))
})

app.put('/image', (req, res) => {
    // req.body.entries + 1
    // res.send(users)
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err =>  res.status(404).json("unable to get entries"))
})

app.listen(3000, () => {
    console.log("app is running on port 3000")
})