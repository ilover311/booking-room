const express = require('express');
const router = express.Router();
const db = require('../../models/index');

module.exports = function(app) {
  app.use('/api', router)
};

router.get('/', (req, res) => {
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

router.get('/searchroom', (req, res) => {
  res.send({
    s: '1'
  });
})