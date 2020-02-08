const http = require('http');
const path = require('path');
const {readRawFile, isFileExists, newRequestId} = require('./until');
const commandRequestUrlReg = /^\/(ondemand|aad)\/(.*)$/;

class MockServer {
    instance;
    events = {};

    constructor(dir, port = 1337) {
        this.directory = dir;
        this.port = port;
    }

    async start() {
        // Create an HTTP tunneling proxy
        this.instance = http.createServer(async (req, res) => {
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
                await this.handleRequest(req, res);
            }

        });
        this.instance.listen(this.port);
        console.log('start');
        return this.instance;
    }

    on(event, callback) {
        this.events[event] = callback;
    }

    triggerEvent(event, data) {
        const callback = this.events[event];
        if (callback) {
            callback(data);
        }
    }

    stop(callback) {
        console.log('stop');
        if (this.instance) {
            this.instance.close(callback);
        }
    }

    async handleRequest(req, res) {
        console.log(`Received request: ${req.method} ${req.url}`);
        if (req.method !== 'POST') {
            res.end(JSON.stringify({'error': 'METHOD NOT SUPPORT'}));
            this.triggerEvent('request', {type: 'error', data: 'METHOD NOT SUPPORT'});
        } else if (!new RegExp(commandRequestUrlReg).test(req.url)) {
            res.end(JSON.stringify({'error': 'URL NOT SUPPORT'}));
            this.triggerEvent('request', {type: 'error', data: 'URL NOT SUPPORT'});
        } else {
            const data = [];
            req.on('data', chunk => {
                data.push(chunk.toString())
            });
            req.on('end', async () => {
                const commandReq = this.getCommandRequestData(req, data.join(''));
                console.log('--' + commandReq.command);
                let responseDataStr = await this.readCommandData(commandReq);
                commandReq.response = responseDataStr;
                this.triggerEvent('request', {id: newRequestId(), type: 'success', data: commandReq});
                if (responseDataStr) {
                    res.end(responseDataStr);
                } else {
                    res.end(JSON.stringify({state: 'Fail', output: {errorMessageId: 'MOCK DATA NOT FOUND'}}));
                }
            });
        }
    }

    getCommandRequestData(req, bodyStr) {
        const url = req.url;
        const matches = new RegExp(commandRequestUrlReg).exec(url);
        const commandName = matches[2];
        return {command: commandName, payload: bodyStr, headers: req.headers};
    }

    async readCommandData(commandReq) {
        const filePath = path.join(this.directory, `${commandReq.command}.json`);
        const exists = await isFileExists(filePath);
        if (exists) {
            return await readRawFile(filePath);
        } else {
            return null;
        }
    }
}

exports.MockServer = MockServer;
