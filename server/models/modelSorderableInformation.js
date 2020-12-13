// getOrderableInformationOpstions
const queryEncode = require("querystring").encode
const sign = require("jsonwebtoken").sign;
const {
    v4: uuidv4
} = require("uuid");
const crypto = require('crypto');
const {
    access_key,
    secret_key,
    server_url
} = require("../config/config");

function getOrderableInformationOpstions(market) {
    //'KRW-BTC' default
    const body = {
        market: market
    }

    //hash
    const query = queryEncode(body)
    const hash = crypto.createHash('sha512')
    const queryHash = hash.update(query, 'utf-8').digest('hex')

    const payload = {
        access_key: access_key,
        nonce: uuidv4(),
        query_hash: queryHash,
        query_hash_alg: 'SHA512',
    };


    const token = sign(payload, secret_key)

    return options = {
        method: "GET",
        url: server_url + "/v1/orders/chance?" + query,
        headers: {
            Authorization: `Bearer ${token}`
        },
        json: body
    }
}



module.exports = getOrderableInformationOpstions
