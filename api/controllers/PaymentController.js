/**
 * PaymentController
 *
 * @description :: Server-side logic for managing payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var braintree = require("braintree");

 var gateway = braintree.connect({
     environment:  braintree.Environment.Sandbox,
     merchantId:   '8czy99w4xgc556jj',
     publicKey:    '4gqkfjd2gnbnn7p2',
     privateKey:   'aa6020e62e47807daba445e7158542f3'
 });

module.exports = {

	client_token: function (req, res) {

		gateway.clientToken.generate({}, function (err, response) {
			res.send(response.clientToken);
		});
	},

	checkout: function (req, res) {

		// lets get the payment nonce from the client to ensure its an authorized client
		var nonce = req.body.payment_method_nonce;

		// Lets make a order in our system with a status of pending
		// if the payment is accepted, we will update this to approved
		// if the payemnt is rejected, we will update this to failed

		Menu.findOne({id: req.body.menuid})
		.then(function (menufound) {
			console.log(req.body.menuid);
			// do something
			if (menufound) {
				chargeAmount = req.body.portions * menufound.price;
				return createdorder = Order.create({
					menuid: req.body.menuid,
					portions: req.body.portions,
					status: 'pending'
				});
				console.log(createdorder);
			} else {
				// At this point `menu` is undefined which means that no menu was found so I want to throw an error.
				// Right now the following statement does throw the error, but it crashes the server.
				throw new Error('Menu doesnt exist');
			}

		}).then(function (created) {
			if(created) {
				// lets setup the payment
				gateway.transaction.sale({
					amount: chargeAmount,
					orderId: created.id,
				paymentMethodNonce: nonce,
					}, function (err, result) {
						if (result.success) {
							result.transaction.customFields;

							// we need to create the payment in our system for refrence (i.e. a transaction)
							Payment.create({
								braintree_id: result.transaction.id,
								status: result.transaction.status,
								currency: result.transaction.currencyIsoCode,
								amount: result.transaction.amount,
								merchantAccountId: result.transaction.merchantAccountId,
								cardLastDigits: result.transaction.creditCard.last4,
								cardTypeImg: result.transaction.creditCard.imageUrl,

								// this is an association....
								orderid:  result.transaction.orderId,

							}).exec(function createCB(err, created){
								res.json('Payment Accepted', 200);
							});
							Order.update({id: created.id},{status:'approved'}).exec(function afterwards(err, updated){
							});
						} else {
							// failure
							res.json('Payment Failed', 400);
						}
					})
				}
		}).fail(function (err) {
			// update the order (if exists) to failed
			Order.update({id: created.id},{status:'failed'}).exec(function afterwards(err, updated){
			});

			res.json('Payment Failed', 400);
			console.log(err);
		});


	}
}
