const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('../../models/index');

module.exports = function(app) {
  app.use('/api', router)
};

router.get('/room', (req, res) => {
  db.room.findOne({
    where: { roomNo: req.query.roomNo }
  })
  .then(val => {
    res.send({
      result: 0,
      room: val
    })
  })
  .catch(e => {
    res.send({
      result: -1,
      msg: e
    })
  })
})

router.get('/roomlist', (req, res) => {
  db.room.findAll({})
  .then(values => {
    let rooms = values.map((val, inx, ary) => {
      return val.dataValues
    })
    res.send({
      result: 0,
      rooms: rooms,
      msg: "",
    });  
  })
  .catch(err => {
    console.error(err)
    res.send({
      result: -1,
      msg: err  
    })
  })
})

router.get('/bookings', (req, res) => {
  const q = req.query;
  console.log(q.date)
  db.booking.findAll({where: {
    roomNo: q.roomNo,
    date: q.date
  }})
  .then(values => {
    let bookings = values.map((val, idx, ary) => {
      return val.dataValues;
    })
    res.send({
      result: 0,
      bookings: bookings,
      msg: ""
    })
  })
  .catch(err => {
    console.error(err)
    res.send({
      result: -1,
      msg: err,
    })
  })
})

router.post('/reserve', (req, res) => {
  let b = req.body;
  (async function() {
    try {
      let overbooking = await db.booking.findAll({ where: {
        roomNo: b.roomNo,
        date: b.date,
        startTime : { $lt: b.endTime },
        endTime: { $gt: b.startTime }
      }});

      if (overbooking.length > 0) {
        res.send({
          result: 1,
          msg: "이미 원하시는 시간에 예약이 되어있습니다."
        })
        return ;
      }

      let room = await db.room.findOne({ where: { roomNo: b.roomNo }})

      if(b.startTime < room.openTime || b.endTime > room.closeTime || b.endTime <= b.startTime) {
        res.send({
          result: 2,
          msg: "예약 할 수 없는 시간입니다."
        })
        return;
      }

      if(room.dataValues.capacity < b.attendee.split(',').length) {
        res.send({
          result: 3,
          msg: "수용인원보다 많은 인원입니다."
        })
        return;
      }

      let booking = await db.booking.create({
          roomNo: b.roomNo,
          date: b.date,
          startTime: b.startTime,
          endTime: b.endTime,
          attendee: b.attendee,
          owner: b.owner
      });

      res.send({
        result: 0,
        data: booking.dateValues,
        msg: "예약에 성공했습니다."
      })
    } catch(e) {
      res.send({
        result: -1,
        msg: e
      })
    }
  })(); 
})

router.get('/mybookings', (req, res) => {
  db.booking.findAll({ where: { owner: req.user.username } })
  .then(result => {
    res.send({
      result: 0,
      bookings: result
    })
  })
  .catch(e => {

  })

})

router.delete('/removebooking', (req, res) => {
  
})