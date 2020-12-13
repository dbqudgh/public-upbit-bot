const WebSocket = require('ws')


function tradeServerConnect(codes) {
    
    var ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    
    ws.on('open', ()=>{
        console.log('trade websocket is connected')
    })  

    ws.on('close', ()=>{
        console.log('trade websocket is closed');
        console.log('trade 재접속');
        tradeServerConnect(codes)
    })

}


async function start() {
    // 체결 서버 접속
    tradeServerConnect()
}

start()