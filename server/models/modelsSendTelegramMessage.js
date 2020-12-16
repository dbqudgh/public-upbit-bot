// https://api.telegram.org/bot1465996451:AAGf6Y4hHifpo6mGWot4x_ibWDdpOxpXiG4/sendmessage?chat_id=1126066605&text=Message
const request = require("request");
const urlencode = require("urlencode");
const indexUrl = `https://api.telegram.org/bot1465996451:AAGf6Y4hHifpo6mGWot4x_ibWDdpOxpXiG4/sendmessage?chat_id=1126066605&text=`


function sendTelegramMessage(MESSAGE) {
  request({
    url:indexUrl+urlencode(MESSAGE),
    encoding: null
  } , (body, error) => {

  })
}

module.exports = sendTelegramMessage