
const request = require("request");
const urlencode = require("urlencode");
const indexUrl = ``//내 탤래그램 아이디 값 넣어줘야함


function sendTelegramMessage(MESSAGE) {
  request({
    url:indexUrl+urlencode(MESSAGE),
    encoding: null
  } , (body, error) => {

  })
}

module.exports = sendTelegramMessage


