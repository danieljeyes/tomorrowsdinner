/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

    'get /menus':{
      view: 'menulist'
    },

    'get /consumer': {
      view: 'consumer/consumer'
    },

    'get /cook': {
      view: 'cook/cook'
    },

      'get /cook/dashboard': {
      view: 'cook/dashboard'
    },


    'get /menus/:id': {
      view: 'viewMenu'
    },

    'get /uploadtest': {
      view: 'upload3'
    },

    'get /login': {
      view: 'login'
    },

    'get /account/profile': {
      view: 'user/profile'
    },

    'get /cook/menus/:id': {
      view: 'cook/menu'
    },

    'get /cook/menus/new': {
      view: 'cook/menu'
    },

    'get /cook/menus/': {
      view: 'cook/menulist'
    },

    'get / menu/public/:limit': 'MenuController.public',

    'get /user/:id/role': 'UserController.userpermissions',
    'get /user/:id/role/:rolename': 'UserController.userpermissions',


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
