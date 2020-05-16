# DeskAppWebServer

This is the server for The desktop and mobile app DeskApp to get and recieve api requests from. Running NodeJs and Express It will be handling the api calls from the movile and desktop clients and allow them to sync while offline.

DeskApp itself has its own repo and is the gui for this api. It currently wworks on osx and windows devices Using Electron and Chronium for the view engine.


To Do:
  * Track prices depending on server load and fidn best time to track on timer per product basis.
  * Add data sterilization and checking before entering db.
  * Add api routes for settings:
    * Login settings
    * Basic notificatioon settings
  * Add support for notifications whern app isnt open on computer or phone.
    * send email when devices are offf line then add que to db of devices needing alerts.
      * maybe add timer to alert que array so after xc time alert will not be shown.
    * When app on desktop or mobile are started then show alert by checking in with the api for updates to the que.
    * if the que shows there was a prtice change then notify desktop client and send alert.
