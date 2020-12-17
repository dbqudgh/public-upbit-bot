const WebSocket = require('ws');
const sendTelegramMessage = require("./models/modelsSendTelegramMessage");
const getAllKrwMarketList = require("./models/modelsGetListMarkets");


let trades = {};
let formatTrades = {};

function tradeServerConnect(codes, cb) {

    var ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.on('open', () => {
        console.log('trade websocket is connected');
        ws.send(`[{"ticket":"test"},{"type":"ticker","codes":["KRW-BTC"]}]`);
    })

    ws.on('close', () => {
        console.log('trade websocket is closed');
        tradeServerConnect(codes)
    })

    ws.on('message', (data) => {
        try {

            const str = data.toString('utf-8')
            const parseData = JSON.parse(str)
           
            const cttpd = (parseData.trade_price - parseData.opening_price) / parseData.opening_price * 100

            formatTrades[`${parseData.code}`] = {
                market: parseData.code,
                cttpd: cttpd,
                time: parseData.trade_time
            }


            trades[`${parseData.code}`] = parseData
            console.log(`${cttpd}%`)

        } catch (e) {
      
            console.log(e)
        }
    })
}

async function main() {
    const krwMarketList = await getAllKrwMarketList(); // 모든 마켓 정보 가저옴
    tradeServerConnect()
}

main()