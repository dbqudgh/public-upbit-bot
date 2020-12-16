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
const request = require("request");


function getOrderableInformation(market) {
    //'KRW-BTC' default
    
    //주문 가능 정보
    let orderableInformation;


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

    const options = {
        method: "GET",
        url: server_url + "/v1/orders/chance?" + query,
        headers: {
            Authorization: `Bearer ${token}`
        },
        json: body
    }


    return new Promise(resolve => {

        request(options, (error, response, data) => {

            if (error) throw new Error(error)
            orderableInformation = data

            resolve(orderableInformation)
        });


    }).then(function (result) {

        return orderableInformation


    })

}



module.exports = getOrderableInformation