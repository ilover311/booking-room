const Sequelize = require('sequelize');
const moment = require('moment');

const db = new Sequelize('database', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  state: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  lastLoginIp: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastLoginAt: {
    type: Sequelize.DATE,
    allowNull: true
  }
})

const Log = db.define('log', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  apiPath: {
    type: Sequelize.STRING,
    allowNull: false
  },
  apiData: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

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
    type: Sequelize.TIME,
    allowNull: false,
  },
  closeTime: {
    type: Sequelize.TIME,
    allowNull: false,
  }
});

const Booking = db.define('booking', {
  bookingID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  roomNo: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  owner: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  endTime: {
    type: Sequelize.TIME,
    allowNull: false
  },
  attendee: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

db.sync()
.then(() => {
  // default values
  return Room.count() 
})
.then((val) => {
  if (val == 0) {
    Room.bulkCreate(
      [1,2,3,4,5].map((val, idx, ary) => {
        return {
          roomNo: val,
          roomName: '회의실' + val,
          capacity: 20,
          openTime: '09:00:00',
          closeTime: '20:00:00',
        }
    }))
  }
})
.catch(e => {
  console.error(e);
})

module.exports = {
  room: Room,
  booking: Booking,
  user: User,
  log: Log
}