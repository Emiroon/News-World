// External imports
const express = require('express')
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const axios = require('axios')

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
let clientID = "";

wsServer.on('connection', (webSocket) => {
    console.log('WebSocket Server :: a new client has connected')
    
    webSocket.onclose = (event) => {
        
        //Lors d'une fermeture de connexion websocket avec un client
        clients = clients.filter((client) => client !== webSocket)
        console.log('WebSocket :: client disconnected. clientsConnected('+clients.length+')')
    }
    webSocket.onmessage = (message) => {
		
		//Parsage des donnees envoyees depuis le client
		var obj_recu = JSON.parse(message.data);
		
		if (obj_recu.what == "message")
		{
			//Affichage d'un simple message venant depuis le client
			console.log('WebSocket :: got a new message', message.data);
			console.log(webSocket.ID);
		}
		else (obj_recu.what == "articles_check")
		{	
			//Comparaison date du recent article sur page du client avec d'eventuels nouveaux articles provenant de l'API, toutes les 10 secondes
			setInterval(() => {
			    var request = axios
				.get('https://newsapi.org/v2/top-headlines?country=fr&apiKey=52fc969cb14946979ebfe1abafb0c88a')
				.then((httpResponse) => {
					
					//Si la date est inferieur au récent article fourni par l'api, on update les articles, sinon on ne fait rien
					if ( httpResponse.data.articles[0].publishedAt > obj_recu.last_article_date )
					{
						obj_recu.last_article_date =  httpResponse.data.articles[0].publishedAt;
						webSocket.send(JSON.stringify({what: "articles_update", content: httpResponse.data}));
					}
					/*else
						webSocket.send(JSON.stringify({what: "message", content: 'Up to date newsapi!'}));*/
					
				});		
			}, 10000);
			
		}
        //webSocket.send('message reçu!');
    }
    
    //Generation d'ID du client
    clientID = new Date();
    clientID &= 0xFFFFFFFF; //ici transformation date en un id unique
    webSocket.ID = clientID;
    clients.push(webSocket)
})


// Servers log
console.log(`HTTP server listening on ${config.http.host}:${config.http.port}`)
console.log(`WebSocket server listening on ${config.ws.host}:${config.ws.port}`)

httpServer.listen(config.http.port, config.http.host)
