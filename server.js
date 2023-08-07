const express = require('express'); 
//const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); //Add kenx library to connect your backend with postgres
const { user } = require('pg/lib/defaults');
const bcrypt = require('bcrypt'); //Setup bcrypt
const saltRounds = 10;
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image')
const res = require('express/lib/response');



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

app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, db, bcrypt, saltRounds)});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)});//Dependency Injection

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

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