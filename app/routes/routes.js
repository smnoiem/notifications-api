
const express = require('express');
const driverModel = require('../model/driverModel');

const router = express.Router();

router.get('/completion-rate/:supply_id', (req, res) => {
  const driverId = req.params.supply_id;
  //console.log(driverId);
  res.send( {"info": "this is your info"} );
});

router.get('/drivers', (req, res) => {
  //
});



router.use( (req, res) => {
  res.status('404').send({"message": "Please send approprite request to get your desired data. <Some Guideline?> "});
} );


module.exports = router;
