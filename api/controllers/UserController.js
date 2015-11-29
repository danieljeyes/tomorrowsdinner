// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  me: function (req, res) {

    // lets see if the user is authenticated....
    // if req.session.passport.user doesnt exist, means user is not looged in
    if(req.session.passport.user) {
        res.json(req.session.passport.user, 200);
    } else {
      res.json('User not logged in', 403);
    }

  },

  userpermissions: function (req, res) {

    // lets get the ID of the user and set it
    var user = req.param('id');
    var rolename = req.param('rolename');
    // lets see if they pass a role name
    if(req.param('rolename')) {
      User.findOne({id: user})
      .populate('roles',{name: rolename})
      .exec(function(err, found){
        res.json(found, 200);
      });
    } else {
      // lets check the user
      User.findOne({id: user})
      .populate('roles')
      .exec(function(err, found){
        console.log(found);
        if(found){
          res.json(found, 200);
        } else {
          res.json('User not logged in', 403);
        }
      });
    }

  }

});
