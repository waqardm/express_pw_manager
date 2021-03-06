// Imports

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session');
const ejs = require('ejs');
const reload = require('reload');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Create Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'passwordManager'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('mysql connected');
});

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE passwordManager';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('database created...');
    });
});

///////////  ROUTES /////////

//set static

app.use(express.static(path.join(__dirname, 'public')));

// index
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Password Manager',
    });
});


// dashboard

app.get('/dashboard', function (req, res) {
    let sql = 'SELECT * FROM passwords';
    let query = db.query(sql, (err, result) => {
        res.render('dashboard', {
            title: 'Password Manager',
            result: result,
            success: true,
        });
    });
});


// add password 

app.get('/password/add', function (req, res) {
    res.render('add-password', {
        title: 'Add Password',
    });
});

app.post('/password/add', function(req, res) {

    let sql = "INSERT INTO passwords SET ?";
    let password = { 
        site: req.body.site,
        username: req.body.username,
        password: req.body.password
     }
    let query = db.query(sql, password, (err, result) => {
        if (err) throw err;
        res.redirect('../dashboard');
    });
});

//edit password	

app.get('/password/update/:id', function (req, res) {
    let id = req.params.id;
    let sql = `SELECT * FROM passwords WHERE id = '${id}'`;

    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('update-password', {
            title: 'Update Password',
            site: result[0].site,
            username: result[0].username,
            password: result[0].password,
            id: id
        });
    });


});
app.post('/password/update/:id', function (req, res) {
    let id = req.params.id;
    let password = {
        site: req.body.site,
        username: req.body.username,
        password: req.body.password
    }
    let sql = `UPDATE passwords SET ? WHERE id = '${id}'`;
    let query = db.query(sql, password, (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});


// delete

app.get('/password/delete/:id', function (req,res){
    let id = req.params.id;
    let sql = `DELETE FROM passwords WHERE id= '${ id }'`;
    
    let query = db.query(sql, (err, result)=>{
        if(err) throw err;
        res.redirect('/dashboard');
    });

});

app.listen('3000'), () => {
    console.log('server started on port 8080');
}