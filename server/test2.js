const WebSocket = require('ws');
const sendTelegramMessage = require("./models/modelsSendTelegramMessage");
const getAllKrwMarketList = require("./models/modelsGetListMarkets");
const orderCoin = require("./models/modelsOrderCoin");
const lndividualOrderLookup = require("./models/modelsLndividualOrderLookup")

// orderCoin(market,volume,price,side)
let TRADS = {};
let MY_ACCOUNT = {
	market: null
};
let BYCOIN = false;
//거래할 자금 만원으로 테스트
const PRICE = 5000;

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

			if (BYCOIN && MY_ACCOUNT.market === marketName) { //내잔고랑 market 내임 있다면

				const newTradePrice = parseData.trade_price;
				const myPrice = MY_ACCOUNT.price;

				const increase = getTheRateOfIncrease(newTradePrice, myPrice);
				let text;

				increase > 0 ? text = "증가:" : text = "감소";



				console.log(`${text}${increase}`)

				if (increase < -1 || increase > 0.3) {

					lndividualOrderLookup(MY_ACCOUNT.uuid, (error, body) => {

						if (error) {

							sendTelegramMessage(error)

						} else if (body) {

							// console.log(body.trades)

							const  volume = body.trades[0].volume

							orderCoin(marketName, volume, null, 'ask', (error, body) => {
							
								if (error) {

									sendTelegramMessage(`${error}`)

								} else if (body) {

									if (body.error) {

										sendTelegramMessage(body.error)

									} else {

										const increasePrice = ((increase / 100) * PRICE).toFixed(0)
										console.log(`이득본가격:${increasePrice}원`)
										sendTelegramMessage(`이득본가격:${increasePrice}원`)

										MY_ACCOUNT = {
											market: null
										};

										BYCOIN = false;

									}


								}
							})
						}

					})

				}

			} else if (TRADS[`${marketName}`]) {

				const newTradePrice = parseData.trade_price;
				const oldOpeningPrice = TRADS[`${marketName}`].trade_price;

				const increase = getTheRateOfIncrease(newTradePrice, oldOpeningPrice)
				const volume = (PRICE / newTradePrice).toFixed(8);

				//코인 구매 조건
				if ((increase > 5 || (increase < 0.3 && increase > -1)) && BYCOIN === false) {

					BYCOIN = true;
					// orderCoin(market,volume,price,side)
					orderCoin(marketName, null, PRICE, 'bid', (error, body) => {
						if (error) {
							sendTelegramMessage(`${error}`)
							BYCOIN = false;

						} else if (body) {

							if (body.error) {

								sendTelegramMessage(body.message)

							} else {

								const textData = `코인: ${marketName} 구매`
								console.log(textData)

								MY_ACCOUNT = {
									market: marketName,
									price: newTradePrice,
									volume: body.volume,
									uuid: body.uuid
								}

								sendTelegramMessage(textData)
								//구매했다는 가상을 새우고 그 데이터가 변화했다면 ? 비교	
							}

						} else {
							BYCOIN = false
						}


					})
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