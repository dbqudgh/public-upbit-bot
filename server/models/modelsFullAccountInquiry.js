const {
  server_url
} = require("../config/config");


function getFullAccountInquiryOpstions(token) {
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