const express = require("express");
let __port = 8888;
const app = express();

app.use('/app', express.static('app'));
app.listen(__port, (err)=> {
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

