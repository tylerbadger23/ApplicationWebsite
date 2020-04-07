    const express = require("express");
let __port = process.env.PORT || 80;
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

app.get("/download", (req,res)=> {
    res.sendFile(__dirname + "/pages/download.html");
})

app.get("/about", (req,res)=> {
    res.sendFile(__dirname + "/pages/about.html");
});

app.get("/features", (req,res) =>{
    res.sendFile(__dirname + "/pages/features.html");
});
