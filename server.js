const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: 123,
            name: "John",
            email: "john@gmail.com",
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: 124,
            name: "Sally",
            email: "sally@gmail.com",
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send('this is working')
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    id_incrementor = (database.users[database.users.length -1].id + 1);
    database.users.push({
            id: id_incrementor,
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
    })
    res.json(database.users)
})

app.listen(3000, () => {
    console.log("app is running on port 3000")
})