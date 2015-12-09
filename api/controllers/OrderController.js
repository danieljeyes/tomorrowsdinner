/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	reserve_order: function (reqportions, reqmenuid) {

		// lets reserve the order fot the user
		Order.create({
			menuid: reqmenuid,
			portions: reqportions,
			status: 'draft'
			// date to add later
			// user to add later
		}).exec(function createCB(err, created){
		  console.log(created);
			if(created) {
				return created.id;
			} else {
				return false;
			}
		});

	},

};
