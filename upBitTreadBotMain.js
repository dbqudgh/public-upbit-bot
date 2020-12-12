const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");

const payload = {
  access_key: "cG6xxUzxavsI8deNf1sqbux5WFRk0bJKOT65uZMu",
  nonce: uuidv4(),
};

const jwtToken = jwt.sign(payload, "55xASKx2Z87VU3uHX4xEy66MGXbFNWzEUWcIrbF6");
const authorizationToken = `Bearer ${jwtToken}`;







