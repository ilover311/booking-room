const express = require('express');
const router = express.Router();
const db = require('../../models/index');

module.exports = function(app) {
  app.use('/api', router)
};

router.get('/roomlist', (req, res) => {
  db.room.findAll({})
  .then(values => {
    let rooms = values.map((val, inx, ary) => {
      return val.dataValues
    })
    res.send({
      result: 0,
      rooms: rooms
    });  
  })
  .catch(err => {
    console.error(err)
    res.send({
      result: 1,
      error: err  
    })
  })
})

router.get('/bookings', (req, res) => {
  const q = req.query;
  db.booking.findAll({where: {
    roomNo: q.roomNo,
    date: q.date
  }})
  .then(values => {
    let bookings = values.map((val, idx, ary) => {
      return vale.dataValues;
    })
    console.log(bookings)
    res.send({
      result: 0,
      bookings: bookings
    })
  })
  .catch(err => {
    console.error(err)
    res.send({
      result: 1,
      error: err
    })
  })
})