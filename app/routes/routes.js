
const express = require('express');
const driverModel = require('../model/driverModel');
const messages = require('../notification/message');

const router = express.Router();

const getDriverPromise = (driverId) => {

  return new Promise( (resolve, reject) => {

    driverModel.getDriverById( driverId, (err, result) => {
      if(err) {
        reject({
          "msg": "Something happened in db query",
          "error_code": err.errno
        });
      }
      else {
        if(result.length > 0) {
          resolve(result[0]);
        }
        else {
          reject({
            "Error": "Invalid driver id",
            "error_code": -1
          });
        }
      }

    });
  }
)}


const getTotalOrderPromise = (driverId) => {

  return new Promise( (resolve, reject) => {

    driverModel.getTotalOrder(driverId, (err, result) => {
      if(err) {
        reject(new Error({"Error" : "Error fetching total order", "error_code" : err.errno}) );
      }
      else{
        if(result.length > 0 ) resolve(result[0].totalAssigned);
        else resolve(0);
      }
    });

  });

}

const getDriverRatingPromise = (driverId, lastDayBeginning) => {

  return new Promise( (resolve, reject) => {

    driverModel.completionRate(driverId, lastDayBeginning, (err, result) => {

      if(err) {
        reject(new Error( {"Error":"something went wrong while fetching completion rate", "error_code": err.errno }) );
      }
      else{
        let completed = 0;
        let cancelled = 0;
        if(result.length > 0) {
          for(let data of result) {
            if(data.status == 'COMPLETED') completed = data.occurrence;
            if(data.status == 'CANCELLED') cancelled = data.occurrence;
          }
        }

        console.log('here ', completed, cancelled);

        let divideBy = (completed+cancelled);

        let rate = 0;
        if(divideBy>0) rate = completed/divideBy;

        messages.getMessage(rate, (msg) => {
          resolve({
            "Completion_rate": rate,
            "Message": msg
          });
        });
      }

    });

  })

}



router.get('/completion-rate/:supply_id', (req, res) => {

  const driverId = req.params.supply_id;

  let lastDay = new Date( Date.now() - 86400000);
  let lastDayBeginning = lastDay.toISOString().slice(0, 10);

  getDriverPromise(driverId)
    .then( driverResult => getTotalOrderPromise(driverId) )
    .then( totalOrderResult => getDriverRatingPromise(driverId, lastDayBeginning) )
    .then( driverRatingResult => res.send(driverRatingResult) )
    .catch( err =>  res.send(err) );
});


router.post('/create', (req, res) => {

  if(!req.body) {
    res.send({"message": "Please provide enough user information."});
    return;
  }
  const {nid_number, name, phone, vehicle_id} = req.body;

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
      else res.send({"Error": "No driver is registered with this phone number."});
    }
  });
});

router.get('/drivers/by_nid/:nid', (req, res) => {
  driverModel.getDriverByNid( req.params.nid, (err, result) => {
    if(err) res.send({"message" : "driver not found", "error_code" : err.errno });
    else {
      if(result.length) res.send(result);
      else res.send({"Error": "No driver is registered with this NID"});
    }
  });
});

router.get('/drivers/by_vehicle/:vehicleId', (req, res) => {
  driverModel.getDriverByVehicleId( req.params.vehicleId, (err, result) => {
    if(err) res.send({"message" : "driver not found", "error_code" : err.errno });
    else {
      if(result.length) res.send(result);
      else res.send({"Error": "No driver is registered with this vehicle"});
    }
  });
});



router.use( (req, res) => {
  res.status('404').send({"message": "Please send approprite request to get your desired data. <Some Guideline?> "});
} );


module.exports = router;
