var express = require('express');
var router = express.Router();
const ObjectID = require('mongoose').ObjectID;


// Configure user account profile edit
// --------------------------------------------------
router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()) { 
    res.redirect('/auth/login');
  }
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }

    res.render('account', { ...results });
  });
});
// --------------------------------------------------


// Get public profile for any user
// --------------------------------------------------
router.get('/:email', (req, res, next) => {
  const users = req.app.locals.users;
  const email = req.params.email;

  users.findOne({ email }, (err, results) => {
    if (err || !results) {
      res.render('public-profile', { messages: { error: ['User not found'] } });
    }

    res.render('public-profile', { ...results, email });
  });
})
// --------------------------------------------------


// Handle updating user profile data
// --------------------------------------------------
router.post('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  }

  const users = req.app.locals.users;
  const { first, last, email } = req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne({ _id }, { $set: { first, last, email } }, (err) => {
    if (err) {
      throw err;
    }
    
    res.redirect('/users');
  });
});
// --------------------------------------------------

module.exports = router;