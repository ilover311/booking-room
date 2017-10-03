const Sequelize = require('sequelize');

const db = new Sequelize('database', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Room = db.define('room', {
  roomNo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  roomName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  capacity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  openTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  closeTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});


db.sync()
.then(() => {
  // default values
  Room.findOrCreate({
    where: {
      roomNo: 1
    },
    defaults: {
      roomName: '회의실1',
      capacity: 20,
      openTime: 9,
      closeTime: 20
    }
  })
  Room.findOrCreate({
    where: {
      roomNo: 2
    },
    defaults: {
      roomName: '회의실2',
      capacity: 20,
      openTime: 13,
      closeTime: 20
    }
  })
  Room.findOrCreate({
    where: {
      roomNo: 3
    },
    defaults: {
      roomName: '회의실3',
      capacity: 20,
      openTime: 9,
      closeTime: 17
    }
  })
  Room.findOrCreate({
    where: {
      roomNo: 4
    },
    defaults: {
      roomName: '회의실4',
      capacity: 20,
      openTime: 10,
      closeTime: 15
    }
  })
})
.catch(e => {
  console.error(e);
})

module.exports = {
  room: Room,

}