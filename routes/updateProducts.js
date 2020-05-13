let cheerio = require('cheerio');

let fs = require("fs");
const got = require('got');


let productionUpdateInterval = 600000; // 10 minutes
let developmentUpdateInterval = 25000; // 25 seconds

module.exports = (app, Users, Products) => {


  async function updateProduct(id, url, price, numChecks, title, alertSettings, cheapestEverPrice, isActive, wantsAlerts) {
      let productIsActive = isActive;

      requestHTML(url)
        .then(async (html) => {
          let $ = cheerio.load(html);
          let new_price = $("#priceblock_ourprice").html();
          let new_num_checks = numChecks + 1;

          if(typeof new_price == "string") {
              productIsActive = true;

              // check prices and then send notification if user is on
              if(typeof price == "string") { // if price has not changed on update then compare prices
                  comparePricesDifferent(cheapestEverPrice, price, new_price, title, id, Products, wantsAlerts, alertSettings);
              } else { // if price just got added then alert user accordingly
                  if(wantsAlerts) sendNotification(`Product is now available! - ${new_price}`, `${title}`);
              }


              // change last know price
              await Products.update({_id: id }, { $set: { lastKnownPrice: new_price } }, {multi:true}, function (err, numReplaced) {
                  if(err) {console.log(`Updated ${id} in db num checks ++ ${new_num_checks}`);}
              });

              await Products.update({_id: id }, { $set: { price: new_price } }, {multi:true}, function (err, numReplaced) {
                  if(err) {console.log(`Updated ${id} price in db:  ${new_price}`);}
              });
          } else { // old price was just changed and product is no longer on sale then alert user
            
              if(typeof price == "string" && wantsAlerts && alertSettings == "Any Price Change") {
                  sendNotification(`Product is now available! - ${new_price}`, `${title}`);
              }
              productIsActive = false; // product is not active
              await Products.update({_id: id }, { $set: { price: new_price } }, {multi:true}, function (err, numReplaced) {
                  if(err) {console.log(`Updated ${id} price in db:  ${new_price}`);}
              });
          }

          // change num checks for testing
          await Products.update({_id: id }, { $set: { num_checks: new_num_checks } }, {multi:true}, function (err, numReplaced) {
              if(!err) {console.log(`Updated ${id} in db num checks ++ ${new_num_checks}`);}
          });
          // change num checks for testing
          await Products.update({_id: id }, { $set: { date_last: Date.now() } }, {multi:true}, function (err, numReplaced) {
              if(err) {console.log(`Updated ${id} in db date: ${Date.now()}`);}
          });

          // change num checks for testing
          await Products.update({_id: id }, { $set: { isActive: productIsActive } }, {multi:true}, function (err, numReplaced) {
              if(err) {console.log(`Updated ${id} product's isActive: ${productIsActive}`);}
          });
      }).catch((err)=> {
        console.log(err);
      })
  }

  async function startUpdating () { //get all products crwaled
      await Products.loadDatabase((err) => {
          if(!err) {
              console.log(`Database loaded`);
          } else {
              console.log(err);
          }
      });
      await Products.find({}, async (err, data) => { // get all products out of db
          if(!err) {
              console.log(`${data.length} Products INDB Being tracked`);
              if(data.length < 1) {
                  console.log(`Data arr is less then one. no update happened`);
              }
              for(let i = 0; i < data.length; i++) { // for each profuct in products.db update it with function
                  updateProduct(data[i]._id, data[i].url, data[i].price, data[i].num_checks, data[i].title, data[i].alertSettings, data[i].cheapestPrice, data[i].isActive, data[i].alerts);
              }
          } else { // error :(
              console.log("fatal error updating product prices");
          }

      })
  }
  let updateInterval = developmentUpdateInterval; //interval for updating data

  setTimeout(()=> {
      setInterval(()=> { //update db after every x miliseconds
          startUpdating();
          console.log("Updating Every Product at once");
      }, updateInterval);
  }, 2000);

  function sendNotification(header, msg) {
      console.log('Notification will bve sent to user if there email is open');

  }

  async function comparePricesDifferent(cheapestEverPrice, oldPrice, newPrice, prodTitle, prodId, Products, wantsAlerts, alertSettings) {
      let newP = newPrice;
      let oldP = oldPrice;
      let cheapestP = cheapestEverPrice;

      //check for comma
      if(oldPrice.includes(",")) {oldP = oldPrice.replace(/,/g, '');}
      if(newPrice.includes(",")) {newP = newPrice.replace(/,/g, '');}
      if(cheapestEverPrice.includes(",")) {cheapestP = cheapestEverPrice.replace(/,/g, '');}

      let priceDif = oldP.split("$")[1] - newP.split("$")[1];

      if(priceDif > 0 && wantsAlerts && alertSettings !== "No Alerts") {
          sendNotification(`$${priceDif} Price Drop on Tracked Product!`, `${prodTitle}`);
          let cheapestDiff = cheapestP.split("$")[1] - newP.split("$")[1]; // check if cheapest ever recorded porice occured
          if(cheapestDiff > 0) {
              await Products.update({_id: prodId }, { $set: { cheapestPrice: cheapestEverPrice} }, {multi:true}, function (err) {
                  if(err) {
                      console.log(err);
                  }
              });
          }

      }
      if(priceDif <= 0) return false;
  }

  async function requestHTML(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await got(url);
        resolve(response.body);
      } catch(error) {
        console.log(error.response.body);
        reject(error);
      }
    });
  }







  //
}
