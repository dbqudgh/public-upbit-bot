const request = require('request')
const {
	v4: uuidv4
} = require("uuid");
const crypto = require('crypto')
const sign = require('jsonwebtoken').sign
const queryEncode = require("querystring").encode

const {
	access_key,
	secret_key,
	server_url
} = require("../config/config");



function orderCoin(market, volume, price, side, cb) {

	let ord_type = 'limit'

	if (volume === null) {
		ord_type = 'price'
	}


	if (price === null) {

		ord_type = 'market'

	}

	const body = {
		market: market,
		side: side,
		volume: volume,
		price: price,
		ord_type: ord_type
	}

	//8자리 까지


	const query = queryEncode(body)

	const hash = crypto.createHash('sha512')
	const queryHash = hash.update(query, 'utf-8').digest('hex')

	const payload = {
		access_key: access_key,
		nonce: uuidv4(),
		query_hash: queryHash,
		query_hash_alg: 'SHA512',
	}

	const token = sign(payload, secret_key)

	const options = {
		method: "POST",
		url: server_url + "/v1/orders",
		headers: {
			Authorization: `Bearer ${token}`
		},
		json: body
	}

	request(options, (error, response, body) => {

		const state = body.state
		const uuid = body.uuid

		if (error) {

			console.log(error)
			cb(JSON.stringify(error))

		} else if (body.error) {

			console.log(body.error)
			cb(JSON.stringify(body.error))

		} else {
			cb(null, JSON.stringify(body))
		}





	})
}


module.exports = orderCoin






// const request = require('request')
// const {
// 	v4: uuidv4
// } = require("uuid");
// const crypto = require('crypto')
// const sign = require('jsonwebtoken').sign
// const queryEncode = require("querystring").encode

// const {
// 	access_key,
// 	secret_key,
// 	server_url
// } = require("../config/config");



// function orderCoin(market, volume, price, side, cb) {

// 	let ord_type = 'limit'

// 	if (volume === null) {
// 		ord_type = 'price'
// 	}


// 	if (price === null) {

// 		ord_type = 'market'

// 	}

// 	const body = {
// 		market: market,
// 		side: side,
// 		volume: volume,
// 		price: price,
// 		ord_type: ord_type
// 	}

// 	//8자리 까지


// 	const query = queryEncode(body)

// 	const hash = crypto.createHash('sha512')
// 	const queryHash = hash.update(query, 'utf-8').digest('hex')

// 	const payload = {
// 		access_key: access_key,
// 		nonce: uuidv4(),
// 		query_hash: queryHash,
// 		query_hash_alg: 'SHA512',
// 	}

// 	const token = sign(payload, secret_key)

// 	const options = {
// 		method: "POST",
// 		url: server_url + "/v1/orders",
// 		headers: {
// 			Authorization: `Bearer ${token}`
// 		},
// 		json: body
// 	}

// 	request(options, (error, response, body) => {

// 		const state = body.state
// 		const uuid = body.uuid

// 		if (error) {

// 			console.log(error)
// 			cb(JSON.stringify(error))

// 		} else if (body.error) {

// 			console.log(body.error)
// 			cb(JSON.stringify(body.error))

// 		} else if (state === 'wait') {

// 			const body = {
// 				uuid: uuid
// 			}

// 			const query = queryEncode(body)

// 			const hash = crypto.createHash('sha512')
// 			const queryHash = hash.update(query, 'utf-8').digest('hex')

// 			const payload = {
// 				access_key: access_key,
// 				nonce: uuidv4(),
// 				query_hash: queryHash,
// 				query_hash_alg: 'SHA512',
// 			}

// 			const token = sign(payload, secret_key)

// 			const options = {
// 				method: "DELETE",
// 				url: server_url + "/v1/order?" + query,
// 				headers: {
// 					Authorization: `Bearer ${token}`
// 				},
// 				json: body
// 			}

// 			request(options, (error, response, body) => {
// 				if (error) cb(JSON.stringify(error))
// 				if (body) {
// 					if (body.error) {
// 						cb(JSON.stringify(body.error))
// 					}
// 					cb(`매수주문 취소합니다`)
// 				}
// 			})
// 		} else {

// 			cb(null, JSON.stringify(body))

// 		}





// 	})
// }


// module.exports = orderCoin