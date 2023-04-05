const { response } = require('express');
const http = require('http');
const app = require("express")();
app.get("/",(req,res)=> res.sendFile(__dirname+"/index.html"))

app.listen(9091,()=>console.log("Server is listening http on port 9091"));
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(9090, () => { console.log('Server is listening on port 9090') });
//hashmaps
const clients={};
const games ={};

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);
    connection.on('open', () => {
        console.log("opened");
    })
    connection.on('closed',() => console.log("closed"))
    connection.on("message", message =>{
        const result = JSON.parse(message.utf8Data)
        console.log(result)

        //user wants to create a new game
        if (result.method==="create"){
            const clientId=result.clientId
            const gameId =guid();
            games[gameId]={
                'id':gameId,
                "balls":20,
                'clients':[]
            }
            const payLoad ={
                "method":"create",
                "game":games[gameId]
            }
            const con= clients[clientId].connection
            con.send(JSON.stringify(payLoad))
        }

        if (result.method==="join"){
            const clientId= result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length>=3){
                //max players reached
            }
            const color = { 0: "Red", 1: "Green", 2: "Blue" }[
              game.clients.length
            ];
            game.clients.push({"clientId":clientId,"color":color})
            if(game.clients.length ===3) updateGameState();
            const payLoad={
                "method":"join",
                "game":game
            }
            game.clients.forEach(c => {
                console.log(c)
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
        }
        if(result.method==="play"){
            const clientId = result.clientId;
            const gameId = result.gameId;
            const ballId = result.ballId;
            const color = result.color;
            let state=game[gameId].state;
            if(!state)
                state = {
                }
            state[ballId]=color;
            games[gameId].state=state;
        }


    });
    //generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection":connection
    }

    const payLoad={
        "method": "connect",
        "clientId":clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad))

})


function updateGameState(){
    for(const g of Object.keys(games)){
        const game= games[g]
        const payLoad={
            "method": "update",
            "game":game,
            
        }
        game.clients.forEach((c) => {
          clients[c.clientId].send(JSON.stringify(payLoad));
        });
    }

    setTimeout(updateGameState,500);
}



const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};