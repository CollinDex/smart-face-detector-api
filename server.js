const express = require('express'); 
//const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); //Add kenx library to connect your backend with postgres
const { user } = require('pg/lib/defaults');
const bcrypt = require('bcrypt'); //Setup bcrypt
const saltRounds = 10;


const db = require('knex')({ //Initializing kenx library connection to db
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'A36361414a',
      database : 'smart-brain'
    }
  });

/* db.select('*').from('users').then(data => {
    console.log(data);
});
 */
const app = express();

app.use(express.urlencoded({extended:false})); //These two lines calls up middleware that parses your json so your backend will understand it
app.use(express.json());
app.use(cors());


app.get('/', (req, res)=> {
    res.send('sucess');
});

app.post('/signin', (req, res) => {
    db.select('email','hash').from('login')
      .where('email','=',req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        //console.log(isValid);
        if (isValid) {
            return db.select('*').from('users')
                    .where('email','=',req.body.email)
                    .then(user=> {
                    //    console.log(user);
                        res.json(user[0])
                    })
                    .catch(err=> res.status(400).json('unable to get user'));
        } else {
            res.status(400).json('Wrong Credentials')
        }        
        })
        .catch(err => res.status(400).json('Wrong Credentials'))
});

app.post('/register', (req, res) => {
    const {email, name, password } = req.body;

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
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    db.select('*').from('users')
        .where({
            id: id
        })
        .then(user =>{
            user.length ? res.json(user[0]) : res.status(400).json('Not Found');
        })
        .catch(err => res.status(400).json('Not Found'))
});

app.put('/image', (req, res) => {
    const { id } = req.body; 
    db('users').where('id','=',id)
      .increment('entries',1)
      .returning('entries')
      .then(entries => {
//        console.log(entries);
          res.json(entries[0].entries);
      })
      .catch(err => res.status(400).json('unable to get entries'))
});

app.listen(3000, ()=> {
    console.log('App is running on port 30000');
});



/* API PLAN
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user

*/

/*

bcrypt.hash(password, null, null, function(err, hash) {
 console.log(hash);
});
 // Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
 */