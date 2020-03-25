const WebSocket = require('ws');
const sessionParser = require(__dirname + '/session-parser-module');

const createChatServer = server=>{
    const wsServer = new WebSocket.Server({server});
    const map = new Map();
    wsServer.on('connection', (ws, req)=>{
        console.log(req.url);
        console.log(req.session);
        sessionParser(req, {}, ()=>{
            // 判斷有沒有登入
            console.log(req.url);
            console.log(req.session);
        });

        map.set(ws, {});

        ws.on('message', message=>{
            const mObj = map.get(ws);
            let msg = '';
            if(! mObj.name){
                mObj.name = message;
                msg = `${mObj.name} 進入，人數：${wsServer.clients.size}`;
            } else {
                msg = `${mObj.name}: ${message}`;
            }
            wsServer.clients.forEach(c=>{
                if(c.readyState===WebSocket.OPEN){
                    c.send(msg);
                }
            });
        });
    });
};

module.exports = createChatServer;






