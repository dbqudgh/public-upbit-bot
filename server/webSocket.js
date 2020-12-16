const WebSocket = require('ws');
const sendTelegramMessage = require("./models/modelsSendTelegramMessage");
const getAllKrwMarketList = require("./models/modelsGetListMarkets");



let trades = {};


function tradeServerConnect(codes, cb) {

    var ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.on('open', () => {
        console.log('trade websocket is connected');
        sendTelegramMessage('trade websocket is connected')
        ws.send(`[{"ticket":"test"},{"type":"ticker","codes":[${codes}]}]`);
    })

    ws.on('close', () => {
        console.log('trade websocket is closed');
        sendTelegramMessage('trade websocket is closed trade 재접속');
        tradeServerConnect(codes)
    })

    ws.on('message', (data) => {
        try {

            const str = data.toString('utf-8')
            const parseData = JSON.parse(str)

            if (trades[`${parseData.code}`]) {
        
                const newTradePrice =  parseData.trade_price;
                const oldTradePrice =trades[`${parseData.code}`].trade_price;

                const increase = (oldTradePrice - newTradePrice) / oldTradePrice;
                
                if (increase > 2) {
                    
                    const textData = `코인: ${parseData.code} 증가량: ${increase.toFixed(4)}%`
                    console.log(textData)
                    sendTelegramMessage(textData)                 

                }
            }

            trades[`${parseData.code}`] = parseData

        } catch (e) {
            sendTelegramMessage("서버에러");
            console.log(e)
        }
    })
}



// if (trades.length > 0) { //기존데이터가 있다면


//     const newTradePrice = json.trade_price;
//     const oldTradePrice = trades[0].trade_price;

//     const increase = (oldTradePrice - newTradePrice) / oldTradePrice;


//     if (increase > 0.0001) {
//         const textData = `증가량:${increase}`
//         sendTelegramMessage(textData)
//     }

//     // trades[0] 
//     // json
//     trades = [];
// }
// trades.push(json)


//기존 데이터 그리고 새로운 데이터 비교 하여 전일대비 가격이 2퍼센트 올랐다면

//시작값 - 비교할값 / 시작값

//그 코인을 호가로 주문 그리고 만약 산 가격보다 2퍼센트 올랐다면 호가로 바로 손절

//만약 2퍼센트 내려갔다면 바로 손절 


//[{"ticket":"test"},{"type":"ticker","codes":["KRW-BTC"]}]



async function main() {
    const krwMarketList = await getAllKrwMarketList(); // 모든 마켓 정보 가저옴
    tradeServerConnect(krwMarketList)
}

main()