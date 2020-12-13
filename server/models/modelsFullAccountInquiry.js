//lib
const sign = require("jsonwebtoken").sign;
const {
  v4: uuidv4
} = require("uuid");

//config
const {
  access_key,
  secret_key,
  server_url
} = require("../config/config");

function getFullAccountInquiryOpstions() {

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };
  const token = sign(payload, secret_key)

  return options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: {
      Authorization: `Bearer ${token}`
    },
  }
}

module.exports = getFullAccountInquiryOpstions


//full account inquiry