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
const request = require("request")


function getFullAccountInquiry() {

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };

  const token = sign(payload, secret_key)

  const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: {
      Authorization: `Bearer ${token}`
    },
  }

  let fullAccountInquiry;


  return new Promise(resolve => {

    request(options, (error, response, data) => {
      if (error) throw new Error(error)
      // createJsonFile(data,"FullAccountInquiry.json")
      fullAccountInquiry = data

      resolve(fullAccountInquiry)
    });



  }).then(function (result) {
    return JSON.parse(fullAccountInquiry) 
  })

}

module.exports = getFullAccountInquiry


//full account inquiry