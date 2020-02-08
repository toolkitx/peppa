let http = require('http');
let util = require('util');
let path = require('path');
let fs = require('fs');

let port = process.env.PORT || 9999;
let commandRequestUrlReg = /^\/(ondemand|aad)\/(.*)$/;
let events = {};
let directory = path.join(__dirname, 'data');

newRequestId = () => {
    return `req-${new Date().getTime() + Math.floor((Math.random() * 100) + 1)}`;
};

responsePipe = (origin, command, content) => {
    if (!content) {
        return content;
    }
    const specialCmds = ['Main_GetAdminConsentUrlCommand', 'Main_GetSignInUrlCommand'];
    if (specialCmds.includes(command)) {
        content = content.replace('http://localhost:9000/', `${origin}/`);
    }
    return content;
};

handleRequest = (req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    if (req.method !== 'POST') {
        res.end(JSON.stringify({'error': 'METHOD NOT SUPPORT'}));
        triggerEvent('request', {type: 'error', data: 'METHOD NOT SUPPORT'});
    } else if (!new RegExp(commandRequestUrlReg).test(req.url)) {
        res.end(JSON.stringify({'error': 'URL NOT SUPPORT'}));
        triggerEvent('request', {type: 'error', data: 'URL NOT SUPPORT'});
    } else {
        const data = [];
        req.on('data', chunk => {
            data.push(chunk.toString())
        });
        req.on('end', () => {
            const commandReq = getCommandRequestData(req, data.join(''));
            console.log('--' + commandReq.command);
            readCommandData(commandReq, (responseDataStr) => {
                responseDataStr = responsePipe(req.headers.origin, commandReq.command, responseDataStr);
                commandReq.response = responseDataStr;
                triggerEvent('request', {id: newRequestId(), type: 'success', data: commandReq});
                if (responseDataStr) {
                    res.end(responseDataStr);
                } else {
                    res.end(JSON.stringify({state: 'Fail', output: {errorMessageId: 'MOCK DATA NOT FOUND'}}));
                }
            });

        });
    }
};

triggerEvent = (event, data) => {
    const callback = events[event];
    if (callback) {
        callback(data);
    }
};

getCommandRequestData = (req, bodyStr) => {
    const url = req.url;
    const matches = new RegExp(commandRequestUrlReg).exec(url);
    const commandName = matches[2];
    return {command: commandName, payload: bodyStr, headers: req.headers};
};

readCommandData= (commandReq, callback) => {
    const filePath = path.join(directory, `${commandReq.command}.json`);
    const exists = fs.existsSync(filePath);
    let rs;
    if (exists) {
        rs = fs.readFileSync(filePath, {encoding: 'utf8'});
    } else {
        rs = null;
    }
    callback(rs);
};


http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': req.headers['access-control-request-method'],
            'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
        };
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        });
        handleRequest(req, res);
    }

}).listen(port, () => {
    console.log('start');
});
