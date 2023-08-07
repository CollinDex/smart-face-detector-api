const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const {email, name, password } = req.body;
    //Handle input Validation
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    //Setup Bcrypt hashing algorithm
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        //Create a pgsql transaction so that both login and users table are always in sync and have the same data ie: you cant add to the login table without being registered
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
                .insert({ //kenx syntax for inserting things into database
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
                .then(user => {
                    res.json(user[0]);
                })        
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
    });
}

module.exports = {
    handleRegister: handleRegister
};