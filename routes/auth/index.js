const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('../../models/index');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const validator = require('validator')

const jwtSecret = "seungkyujooreallywannaworkfornaverlabs"

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  db.user.findOne({
    where: {
      username: username
    }
  })
  .then(user => {
    console.log(user)
    if(!user || !passwordHash.verify(password, user.password)) {
      const error = new Error('Incorrect email or password')
      error.name = 'IncorrectCredentialsError'
      return done(error);  
    }

    user.lastLoginIp = req.ip;
    user.lastLoginAt = moment().format();

    return user.save().then(() =>{
      const payload = {sub: user.id}
      const token = jwt.sign(payload, jwtSecret)
      const data = {username: user.username, access: user.access}
      return done(null, token, data);
    })
    .catch(err => {
      return done(err);
    });
  })
  .catch(err => {
    return done(err);
  })
}))

let authorization = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) { return res.status(401).end() }
    const userId = decoded.sub;
    db.user.findOne({ where: {id: userId, state: 1} })
    .then(user => {
      req.uesr = user;
      if(req.method !== "GET" && (req.user.access & 1) !== 1)
        return res.status(401).end()
      if(req.method === "POST"){
        db.log.create({
          username: user.username,
          apiPath: req.originalUrl,
          apiData: JSON.stringify(req.body),
        })
        .then(log => {
          next();
          return null;
        })
        .catch(err => {
          res.status(401).end();
        })
      } else {
        next();
      }
      return null;
    })
    .catch(err => {
      res.status(401).end();
    })  
  })
}

module.exports = function(app) {
  app.use(passport.initialize());
  app.use('/api', authorization)
  app.use('/auth', router)
};

router.post('/register', (req, res) => {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ success: false, msessage: "Invalid Email" })
  }
  if (validator.isEmpty(req.body.password)) {
    return res.status(400).json({ success: false, message: "Invalid Password" })
  }

  let hashed;
  try{
    hashed = passwordHash.generate(req.body.password, {algorithm: 'sha256'})
  } catch(e) {
    return res.status(400).json({ success: false, message: "invalid Password" })
  }

  const now = new Date();
  db.user.findOrCreate({
    where: {
      username: req.body.email
    },
    defaults : {
      password: hashed,
      access: 0,
      state: 2,
    }
  })
  .spread((user, created) => {
    if (created) {
      return res.json({success: true, message: "OK"})
    } else {
      return res.status(400).json({ success: false, message: "Duplicated Email"})
    }
  })
  .catch(err => {
    return res.status(400).json({ success: false, message: "DB Error - " + err})
  })
})

router.post('/login', (req, res) => {
  console.log(req.body)
  return passport.authenticate('local', (err, token, userData) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }
    console.log(userData)
    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    })
  })(req, res);
})

router.get('/logout', (req, res) => {
  req.logout()
  return res.json({success: true})
})