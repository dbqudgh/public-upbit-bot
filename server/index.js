//lib
const request = require("request");

//models
const createJsonFile = require("./models/modelsCreateJsonFile");
const getFullAccountInquiryOpstions = require("./models/modelsFullAccountInquiry") 
const getOrderableInformationOpstions = require("./models/modelSorderableInformation")

const market = 'KRW-BTC'

//전체 계좌 조회
request(getFullAccountInquiryOpstions(), (error, response, data) => {
    if (error) throw new Error(error)
    createJsonFile(data,"FullAccountInquiry.json")
});


//주문 가능 정보
request(getOrderableInformationOpstions(market), (error, response, data) => {
  if (error) throw new Error(error)
  createJsonFile(JSON.stringify(data),"SorderableInformation.json")
});



//full account inquiry













