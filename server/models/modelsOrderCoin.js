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

    const body = {
        market: market,
        side: side,
        volume: volume,
        price: price,
        ord_type: 'limit'
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
        if (error) {
            console.log(error)
            cb(error)
        }else if (body.error) {
            cb(body.error)
        }

        cb(null,true)
        // const state = body.state
        // const uuid = body.uuid
        // if (state === 'wait') {
        //     cb(state)
        //     const body = {
        //         uuid: uuid
        //     }

        //     const query = queryEncode(body)

        //     const hash = crypto.createHash('sha512')
        //     const queryHash = hash.update(query, 'utf-8').digest('hex')

        //     const payload = {
        //         access_key: access_key,
        //         nonce: uuidv4(),
        //         query_hash: queryHash,
        //         query_hash_alg: 'SHA512',
        //     }

        //     const token = sign(payload, secret_key)

        //     const options = {
        //         method: "DELETE",
        //         url: server_url + "/v1/order?" + query,
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         },
        //         json: body
        //     }

        //     request(options, (error, response, body) => {
        //         if (error) throw new Error(error)
        //         console.log(body)
        //     })
        // }
    })
}


module.exports = orderCoin