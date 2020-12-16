
const WebSocket = require('ws');

let trades = [];




const myMarketInfo = '[{"ticket":"test"},{"type":"ticker","codes":["KRW-BTC"]}]';


function tradeServerConnect(codes) {
    
    var ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    
    ws.on('open', ()=>{
        console.log('trade websocket is connected');
        ws.send(myMarketInfo);
    }) 

    ws.on('close', ()=>{
        console.log('trade websocket is closed');
        console.log('trade 재접속');
        tradeServerConnect(codes)
    })

    ws.on('message', (data)=>{
        try {
            const str = data.toString('utf-8')
            
            const json = JSON.parse(str)
            if(trades.length > 0) {  //기존데이터가 있다면
                console.log(trades[0])
                // trades[0] 
                // json
            }
            trades[0] = json;

            // console.log(trades.length);
        } catch (e) {
            console.log(e)
        }
    })
}

//기존 데이터 그리고 새로운 데이터 비교 하여 전일대비 가격이 2퍼센트 올랐다면

//그 코인을 호가로 주문 그리고 만약 산 가격보다 2퍼센트 올랐다면 호가로 바로 손절

//만약 2퍼센트 내려갔다면 바로 손절 






//[{"ticket":"test"},{"type":"ticker","codes":["KRW-BTC"]}]



async function start() {
    // 체결 서버 접속
    tradeServerConnect()
}

start()