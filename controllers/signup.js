const handleSignUp = (req, res, db, bcrypt) => {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json('invalid credentials')
    }
    
    
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    console.log('start fetch')
    db.transaction(trx => {
        console.log('inside transaction')
        trx.insert({ 
            hash: hash,
            email: email
         })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('inside email')
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
    .catch(err => {
        
        res.status(400).json(err)
    })
}

module.exports = {handleSignUp: handleSignUp}