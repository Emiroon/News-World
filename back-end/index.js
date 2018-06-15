// External imports
const express = require('express')
const WebSocket = require('ws')
const bodyParser = require('body-parser')

// Internal imports
const router = require('./router.js')
const config = require('./config.json')

// HTTP Server initialisation
function initHttpServer() {
    const server = express()
    server.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        next()
    })
    server.use(bodyParser.json())
    server.use(router)

    return server
}

// WebSocket Server initialisation
function initWSServer() {
    const wss = new WebSocket.Server({
        port: config.ws.port,
        host: config.ws.host
    })
    return wss
}

//
const httpServer = initHttpServer()
const wsServer = initWSServer()

// WebSocket Server events binding

let clients = []

wsServer.on('connection', (webSocket) => {
    console.log('WebSocket Server :: a new client has connected')
    
    webSocket.onclose = (event) => {
        console.log('WebSocket :: client disconnected')
        clients = clients.filter((client) => client !== webSocket)
    }
    webSocket.onmessage = (message) => {
        console.log('WebSocket :: got a new message', message.data)
    }
    clients.push(webSocket)
})


// Servers log
console.log(`HTTP server listening on ${config.http.host}:${config.http.port}`)
console.log(`WebSocket server listening on ${config.ws.host}:${config.ws.port}`)

httpServer.listen(config.http.port, config.http.host)
