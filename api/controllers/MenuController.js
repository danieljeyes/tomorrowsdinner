/**
 * MenuController
 *
 * @description :: Server-side logic for managing menus
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	public: function (req, res) {

    // lets see if they pass a role name
    Menu.find(where={"status": 'approved'})
    .exec(function(err, found){
        res.json(found, 200);
      });

  }

};
