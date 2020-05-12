module.exports = function (app, Users, bodyParser) {
    app.post("/api/register", (req, res) => {
        let username = req.body.username;
        let password1 = req.body.password1;
        let password2 = req.body.password2;
        let email = req.body.email;
        console.log(req.body);

        checkData(Users, email)
            .then(() => { // data is good // add usetr to database
                console.log('1');
                registerUsers(Users, username, email, password1)
                    .then(() => { // send jsonb back to user api
                        console.log('2');
                        let jsonResponse = {err: false, successMsg: `Added User to the datbase succesfully`, username: username, email: email};
                        res.json(jsonResponse);      
                    })
                    .catch((err) => { // error adding user to db
                        console.log('4');
                        let jsonResponse = {err: true, errMsg: `ERR: ${err}`};
                        res.json(jsonResponse);
                    })
            })
            .catch((err)=> { // error adding user to db
                console.log('2');
                let jsonResponse = {err: true, errMsg: `ERR: ${err}`};
                res.json(jsonResponse);
            })
    })
}

function checkData(Users, email) {
    console.log('2');
    //filter data first
    return new Promise((resolve, reject) => {
        Users.find({email: email}, (err, data) => {
            if(err) reject(`Err: ${err}`);
            if(data.length == 0) resolve();
            if(data.length > 0) reject(`Error: User Taken`);
        });
    }) 
}

//
async function registerUsers(Users, username, email, password1) {
    let User = {
        username: username, 
        email: email, 
        password: password1
    };

    return new Promise((resolve, reject) => {
        Users.insert(User, (err) => {
            if(err) {
                console.log(`Errr: updating and adding user to db ${err}`);
                reject(`${err}`);
            } else {
                resolve();
            }
       });
    });
}