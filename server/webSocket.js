const WebSocket = require('ws');
const sendTelegramMessage = require("./models/modelsSendTelegramMessage");
const getAllKrwMarketList = require("./models/modelsGetListMarkets");
const orderCoin = require("./models/modelsOrderCoin");


// orderCoin(market,volume,price,side)
let TRADS = {};


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
			const marketName = parseData.code

			 if (TRADS[`${marketName}`]) {

				const newTradePrice = parseData.trade_price;
				const oldTradePrice = TRADS[`${marketName}`].trade_price;

				const increase = getTheRateOfIncrease(newTradePrice, oldTradePrice)
				

				//알림 조건
				if (increase > 5) {
					sendTelegramMessage(`${marketName}:코인  ${increase.toFixed(2)}%:증가`)
				}


			}

			TRADS[`${marketName}`] = parseData


		} catch (e) {
			sendTelegramMessage("서버에러");
			console.log(e)
		}
	})
}

function getTheRateOfIncrease(newData, oldData) {
	const increase = (newData - oldData) / oldData * 100;
	return increase
}

async function main() {


	const krwMarketList = await getAllKrwMarketList(); // 모든 마켓 정보 가저옴
	tradeServerConnect(krwMarketList)
}

main()