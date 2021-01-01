//models
const createJsonFile = require("./models/modelsCreateJsonFile");
const getFullAccountInquiry = require("./models/modelsFullAccountInquiry")
const getOrderableInformation = require("./models/modelsSorderableInformation")
const getAllKrwMarketList = require("./models/modelsGetListMarkets");

const market = 'KRW-BTC'


async function main(){

  const krwMarketList =  await getAllKrwMarketList(); // 모든 마켓 정보 가저옴
  const orderableInformationBTC = await getOrderableInformation(market); //마켓 정보 조회
  const fullAccountInquiry = await getFullAccountInquiry(); //주문정보 조회
  // console.log(krwMarketList)
  // console.log(orderableInformationBTC)


  console.log(orderableInformationBTC)
  console.log(fullAccountInquiry)


}main()


//모든 비트코인 마켓 정보





//full account inquiry