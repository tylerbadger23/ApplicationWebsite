
const express = require("express");
const app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
let __port = process.env.PORT || 80;
var Datastore = require('nedb')
  , Users = new Datastore({ filename: __dirname + '/dbs/Users.db', autoload: true })
  , Products = new Datastore({filename: __dirname + "/dbs/Products.db", autoload: true})
  , Notifications = new Datastore({filename: __dirname + "/dbs/Notifications.db", autoload: true})


  // CLASSES & SERVICES

app.use('/app', express.static('app'));
app.listen(__port, (err) => {
    if(err) {
        console.log(`Server had error : ${err}`);
    } else {
        console.log(`Server started and is running on port ${__port}`);
    }
});


//ROUTES
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/pages/index.html");
    console.log(`Rendered Index File`);
});

app.get("/download", (req,res)=> {
    res.sendFile(__dirname + "/pages/download.html");
})

app.get("/about", (req,res)=> {
    res.sendFile(__dirname + "/pages/about.html");
});

app.get("/features", (req,res) =>{
    res.sendFile(__dirname + "/pages/features.html");
});

app.get("/support", (req,res) =>{
    res.sendFile(__dirname + "/pages/about.html");
});

const api = require( __dirname + "/routes/newUser")(app, Users, Products, bodyParser);
const UpdateHandler = require(__dirname + "/services/Updatehandler")(Users, Products);
const NotificationHandler = require(__dirname + "/services/NotificationHandler")(Users, Notifications);



//
