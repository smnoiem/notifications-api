Notification API

As the ride sharing services are growing tremendously in number, it is becoming quite a difficult task to maintain the driver quality. To mitigate the problem, this project is aimed to improve the experience of drivers and passengers through implementing a feature. The feature will allow the users to know the completion rate of a driver considering last 100 rides that the driver took in last couple of days. 

Setup instructions:
1. Install the dependencies:
npm install

2. Initiate your mysql database server
3. Write your database credentials into dbcon.js file
 go to notification_system/app/model/dbcon.js directory
 if your db server running on 

4. Run project:
npm start

5. Test the API using postman

Postman request instructions:

please write the server address with port before the routes.
By default it is localhost:3000
please write the parameters without the square brackets [  ] .
You may get errors with appropriate error messages and error codes.
Error codes are mainly mysql 'errno' values. It is set '-1' by default that means this error is not a mysql error rather a logical error in the script or the request is not made in the instructed format. You may get proper guidelines in the messages.

1. GET a driver's completion rate
  method: GET,
  url: localhost:3000/completion-rate/[driverId]
  
2. POST driver's info to create a new driver id. User should store the returned driver_id.
  method: POST,
  url: localhost:3000/create
  data type:
    raw json
  example:
  {
  "nid_number": "12323",
    "name": "manik munshi",
    "phone": "1234",
    "vehicle_id": "45wrt"
  }
  
3. GET driver information by driver_id
  method: GET,
  url: localhost:3000/drivers/by_id/[driver_id]
  
4. GET driver information by phone
   method: GET,
   url: localhost:3000/drivers/by_phone/[phone]
   
5. GET the information of all the drivers
  method: GET,
  url: localhost:3000/drivers
  
  
