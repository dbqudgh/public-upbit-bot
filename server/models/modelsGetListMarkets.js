const request = require("request");

const options = {
    method: "GET",
    url:"https://api.upbit.com/v1/market/all",
  }

function getAllKrwMarketList() {

    let KRW_MARKET_LIST = [];
  
    return new Promise(resolve => {
  
      request(options, (error, response, data) => {
  
        if (error) throw new Error(error)
  
        const jsonParseData = JSON.parse(data)
  
        jsonParseData.map((item, index) => {
  
          const market = item.market;
  
          if (market.indexOf("KRW") != -1) {
            KRW_MARKET_LIST.push(`"${market}"`)
          }
  
        })
  
        resolve(KRW_MARKET_LIST)
  
      })
  
    }).then(function (result) {
      return KRW_MARKET_LIST
    })
  }
  

  module.exports = getAllKrwMarketList;
