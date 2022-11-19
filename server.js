const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.json(database.users)
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let found = false
    database.users.forEach(user => {
        if (user.id === id){
            found = true
            return res.json(user)
        }
    })
    if(!found){
        res.status(404).json("no such user")
    }
})

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // unary operator
    id = (database.users[database.users.length - 1].id)
    id_incrementor =  (+id) + 1;
    database.users.push({
            id: id_incrementor.toString(),
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
    })
    res.json(database.users)
})

app.post('/image', (req, res) => {
    // req.body.entries + 1
    // res.send(users)
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++
            return res.json(user)
        }
    })
    if(!found){
        res.status(404).json("no such user")
    }
})

app.listen(3000, () => {
    console.log("app is running on port 3000")
})