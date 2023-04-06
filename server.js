const express = require('express'); 
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended:false})); //These two lines calls up middleware that parses your json so your backend will understand it
app.use(express.json());
app.use(cors());


const database = {
    users: [
        {
            id: '123',
            name: 'Amarachi',
            email: 'jamarachi024@gmail.com',
            password: 'amarachi024',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Dex',
            email: 'dex@gmail.com',
            password: 'dex',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=> {
    res.json(database.users);
});

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);    
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    const user = database.users.filter( user => user.id === id);
    user.length === 0 ? res.status(404).json('No such User') : res.json(user[0]); 
    /* let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    });
    if (!found) {
        res.status(404).json("No such User");
    } */
});

app.put('/image', (req, res) => {
    const { id } = req.body; 
    const user = database.users.filter( user => user.id === id);
    user.length === 0 ? res.status(404).json('No such User') :
    user[0].entries++;
    res.json(user[0].entries);    
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