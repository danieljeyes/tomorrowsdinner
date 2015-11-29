// api/models/User.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  schema: true,

      attributes: {
      email: {
        type: 'email',
        unique: true
      },
      about: {
        type: 'string'
      }
      visablename:{
        type: 'string',
        unique: true
      },
      profileimg:{
        type: 'string',
      },
      fname: {
        type: 'string',
        required: true
      },
      lname: {
        type: 'string',
        required: true
      },
      city: {
        type: 'string',
        required: true
      },
      menus: {
        collection: 'menu',
        via: 'owner'
      }
    },

});
