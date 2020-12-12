const sign  = require("jsonwebtoken").sign;
const {v4: uuidv4} = require("uuid");
const request = require("request");
const getFullAccountInquiryOpstions = require("./models/modelsFullAccountInquiry")
const {access_key, secret_key, server_url} = require("./config/config");
const createJsonFile = require("./models/modelsCreateJsonFile");

const payload = {
  access_key: access_key,
  nonce: uuidv4(),
};

const token = sign(payload, secret_key)


//전체 계좌 조회
request(getFullAccountInquiryOpstions(token), (error, response, data) => {
    if (error) throw new Error(error)
    createJsonFile(data,"FullAccountInquiry.json")
})


//full account inquiry













