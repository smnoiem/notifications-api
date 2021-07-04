
const db = require('./dbcon');

class driverModel {
  static getAllDrivers = cb => {
    const sqlQ = 'SELECT driver_id, nid_number, name, phone, vehicle_id  FROM drivers';
    db.execute(sqlQ)
      .then(result => cb(null, result[0]))
      .catch(err => cb(err, null));
  }
  
  static getDriverById = (driverId, cb) => {
    const sqlQ = "SELECT driver_id, name, phone, nid_number, vehicle_id FROM drivers WHERE driver_id = ?";
    db.execute(sqlQ, [driverId])
      .then(result => cb(null, result[0]))
      .catch(err => cb(err, null))
  }

  static getDriverByPhone = (driverId, cb) => {
    const sqlQ = "SELECT driver_id, name, phone, nid_number, vehicle_id FROM drivers WHERE phone = ?";
    db.execute(sqlQ, [driverId])
      .then(result => cb(null, result[0]))
      .catch(err => cb(err, null))
  }
  
  static completionRate = (driverId, lastDayBeginning, cb) => {
    console.log(lastDayBeginning);
    const sqlQ = 
      "SELECT status, count(status) AS occurrence FROM (SELECT status FROM orders WHERE (driver_id = ? AND timestamp>= ?) ORDER BY timestamp DESC LIMIT 100 )  as tmpOrders   GROUP BY status" ;
    
    db.execute(sqlQ, [driverId, lastDayBeginning])
      .then(result => cb(null, result[0]))
      .catch(err => cb(err, null))
  }

  static create = (userInfo, cb) => {
    const {nid_number, name, phone, vehicle_id} = userInfo;
    const sqlQ = "INSERT INTO drivers (nid_number, name, phone, vehicle_id) VALUES (?, ?, ?, ?) ";
    db.execute(sqlQ, [nid_number, name, phone, vehicle_id])
      .then(result => cb(null, result[0]))
      .catch(err => cb(err, null))
  }
}

module.exports = driverModel;
