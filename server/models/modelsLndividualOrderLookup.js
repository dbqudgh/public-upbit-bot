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



function lndividualOrderLookup(uuid, cb) {

	const body = {
		uuid: uuid
	}

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
		method: "GET",
		url: server_url + "/v1/order?" + query,
		headers: {
			Authorization: `Bearer ${token}`
		},
		json: body
	}

	request(options, (error, response, body) => {
		if (error) {
			cb(JSON.stringify(error))
		} else if (body) {

			if (body.error) {
				cb(JSON.stringify(body))
			} else {
				cb(null, body)
			}
			//body.trades.volume	
		}
	})

}




module.exports = lndividualOrderLookup;