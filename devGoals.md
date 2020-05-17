May 17 2020:
  Goals & Planned additions:
    * Notification Queue system on api side (1)

  * 1: Check for notification in updateProducts.js. ->
    * Then create a queue in the database with the Product
      name:
      url:
      price:
      oldPrice: =>
    * Add queued for devices after oldPrice possibly. queuedDevices: [desktop, online/email, ios, etc...],  
    * On the client desktop and ios side, we can call to this api and see the aued lists and display notification accordingly
