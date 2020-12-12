const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const {access_key, secret_key} = require("./config/config")

const payload = {
  access_key: access_key,
  nonce: uuidv4(),
};

const jwtToken = jwt.sign(payload, secret_key);
const authorizationToken = `Bearer ${jwtToken}`;







