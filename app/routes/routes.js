
const express = require('express');
const driverModel = require('../model/driverModel');
const messages = require('../notification/message');

const router = express.Router();

router.get('/completion-rate/:supply_id', (req, res) => {
  const driverId = req.params.supply_id;

  //validating driver id
  driverModel.getDriverById( driverId, (errInGetDriver, resultInGetDriver) => {
    if(errInGetDriver) {
      res.send( {"Error" : "something happened in db query111!", "error_code" : errInGetDriver.errno });
    }
    else {
      if(resultInGetDriver.length > 0) {

        //
        //fetching driver completion data
        
        let lastDay = new Date( Date.now() - 86400000);
        
        let lastDayBeginning = lastDay.toISOString().slice(0, 10);

        driverModel.getTotalOrder(driverId, (errInTotal, resultInTotal) => {
          if(errInTotal) res.send({"Error" : "Error fetching total order", "error_code" : errInTotal.errno});
          else{
            const totalOrderAssigned = resultInTotal;
            //res.send( totalOrderAssigned );

            //
            // completion rate counting starts

            driverModel.completionRate(driverId, lastDayBeginning, (err, result) => {
              if(err) res.send( {"Error":"something went wrong while fetching completion rate", "error_code": err.errno } );
              else{
                //res.send(result);
                //return;
                let completed = 0;
                let cancelled = 0;
                for(let data of result){
                  if(data.status == 'COMPLETED') completed = data.occurrence;
                  if(data.status == 'CANCELLED') cancelled = data.occurrence;
                }
                console.log('here ', completed, cancelled);
                let rate = 0.85;
                if( totalOrderAssigned >= 100 ) {
                  rate = completed/100.0;
                }
                messages.getMessage(rate, (msg) => {
                  res.send({
                    "Completion_rate": rate,
                    "Message": msg
                    });
                });
              }
            });
            //
            // driver's ride completion data fetching ends













            
          }
        });

        









        

      }
      else res.send({"Error": "Invalid driver id"});
    }

  });


  /*
  let lastDayBeginning = Date.now();

  let timePassedInTheDay = ( 
    currDT.getHours()*3600000 
    + currDT.getMinutes()*60000 
    + currDT.getSeconds() * 1000
    + currDT.getMilliseconds()
  );

  lastDayBeginning = lastDayBeginning - timePassedInTheDay - 86400000;
  */

  //let tmp = new Date(lastDayBeginning);
/*
  let prevDO = new Date(lastDayBeginning);
  console.log( 'date', prevDO.getDate(), 'month', prevDO.getMonth() , 'h', prevDO.getHours(), 'm', prevDO.getMinutes(), 's', prevDO.getSeconds() );
*/


  //res.send( {"info": "this is your info"} );

});

router.post('/create', (req, res) => {
  
  if(!req.body) {
    res.send({"message": "Please provide enough user information."});
    return;
  }
  const {nid_number, name, phone, vehicle_id} = req.body;
  const sqlQ = "INSERT INTO drivers VALUES (?,?,?,?) ";

  //validation
  if(nid_number && name && phone && vehicle_id){
    driverModel.create(req.body, (err, result) => {
      if(err) res.send( {"succes": "false", "error_code": err.errno } );
      else{
        res.send({
          "succes": "true", 
          "driver_id": `${result.insertId}` });
      }
    });
  }
  else res.send({"succes": "false", "message:": "Invalid input. Please follow the documentation"});

});

router.get('/drivers', (req, res) => {
  driverModel.getAllDrivers( (err, result) => {
    if(err) res.send({"message": "No drivers found!", "error_code": err.errno});
    else{
      res.send(result);
    }
  });
});

router.get('/drivers/by_id/:driverId', (req, res) => {
  driverModel.getDriverById( req.params.driverId, (err, result) => {
    if(err) res.send({"message" : "driver not found", "error_code" : err.errno });
    else {
      if(result.length) res.send(result);
      else res.send({"Error": "invalid driver id"});
    }
  });
});

router.get('/drivers/by_phone/:driverPhone', (req, res) => {
  driverModel.getDriverByPhone( req.params.driverPhone, (err, result) => {
    if(err) res.send({"message" : "driver not found", "error_code" : err.errno });
    else {
      if(result.length) res.send(result);
      else res.send({"Error": "invalid driver id"});
    }
  });
});



router.use( (req, res) => {
  res.status('404').send({"message": "Please send approprite request to get your desired data. <Some Guideline?> "});
} );


module.exports = router;
