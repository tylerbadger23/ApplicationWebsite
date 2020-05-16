module.exports = function (app, Users, Products, bodyParser) {

  // login route
    app.post('/api/login', (req,res) => {
      let email = req.body.email;
      let password = req.body.password;
      let staysLoggedIn = req.body.staysLoggedIn;

      filterDataForCheck(staysLoggedIn, email, password)
        .then((usr) => {
          checkValidUser(usr.staysLoggedIn, usr.email, usr.password, Users)
            .then((response) => {
              res.json(response);
              console.log(response);
          }).catch((errResponse) => {
            res.json(errResponse);
            console.log(errResponse);
          })
      }).catch((errMsg)=> {
        res.json({err:true, errMsg: errMsg, loggedIn: false, incorrectDataResponse: true});
      })

    });

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
                    .then((User) => { // send jsonb back to user api
                      getUserID(User, Users)
                        .then((userNewId) => {
                          let jsonResponse = {err: false, successMsg: `Added User to the datbase succesfully`, username: username, email: email, userId: userNewId};
                          res.json(jsonResponse);
                      })
                    })
                    .catch((err) => { // error adding user to db
                        console.log('4');
                        let jsonResponse = {err: true, errMsg: `ERR: ${err}`};
                        console.log(jsonResponse)
                        res.json(jsonResponse);
                    })
            })
            .catch((err)=> { // error adding user to db
                console.log('2');
                let jsonResponse = {err: true, errMsg: `ERR: ${err}`};
                console.log(jsonResponse)
                res.json(jsonResponse);
            })
    });

    // user creates new Product to track
    app.post('/api/new/product', (req,res) => {
        console.log(req.body);
        let Product = {
            alerts: req.body.alerts,
            alertSettings: req.body.alertSettings,
            title: req.body.title,
            price: req.body.price,
            lastKnownPrice: req.body.price,
            cheapestPrice: req.body.price,
            url: req.body.url,
            img: req.body.img,
            date_last: Date.now(),
            num_checks: 1,
            isActive: req.body.isActive,
            userId: req.body.userId,
            userEmail: req.body.userEmail
        };

        addNewProduct(Products, Product)
            .then((msg) => {
                res.json({err: false, successMsg: msg, productTitle: Product.title});
            }).catch((errMsg) => { // catch errors adding data to db
                res.json({err: true, errMsg: errMsg});
            })
    });
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

async function getUserID(userAdded, Users) {
  return new Promise((resolve , reject) => {
    Users.find(userAdded, (err, data) => {
        if(err) {
            console.log(`Errr: finding adding user to db ${err}`);
            reject(`${err}`);
        } else {
            resolve(data[0]._id);
            console.log(data[0]._id);
        }
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

    return new Promise(async (resolve, reject) => {
       Users.insert(User, (err) => {
            if(err) {
                console.log(`Errr: updating and adding user to db ${err}`);
                reject(`${err}`);
            } else {
                resolve(User);
            }
       });
    });
}



//ADD Product FROM API
async function addNewProduct(Products, Product) {

    return new Promise((resolve, reject) => {
        Products.insert(Product, (err) => {
            if(err) {
                console.log(`Errr: adding product to db ${err}`);
                reject(`${err}`);
            } else {
                resolve(`Product Added Successfully`);
                console.log(`product added to db: :: ${Product}`);
            }
       });
    });
// end
}

async function filterDataForCheck(staysLoggedIn, email, password) {
  return new Promise((resolve, reject) => {
    if(email.length > 5 && password.length > 4) {
      resolve({email: email, password: password, staysLoggedIn: staysLoggedIn});
    } else {
      reject('data is incorrect');
    }

  });
}


async function checkValidUser(staysLoggedIn ,email, password, Users) {
  return new Promise((resolve, reject) => {
    Users.find({email: email}, (err, data) => {
      if(!err) {
        if(data.length == 1) { //email is correct
          if(data[0].password == password) { // basic password check
            resolve({err: false, isLoggedIn: true, serverKey: data[0]._id, email: email, username: data[0].username, staysLoggedIn: staysLoggedIn});
          } else {
            reject({err: true, reason: "password was incorrect.", isLoggedIn: false});
          }
        } else { // email does not match user in db
          let errResponse = {err: true, reason: "user does not exists in database with that email", isLoggedIn: false};
          reject(errResponse);
        }
      } else {
        console.log(err);
        reject(err);
      }
    })

  });
}



//// end of file
