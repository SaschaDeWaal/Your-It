var lineCount = 0;
var players = [];
var connectionInterval, itCheckInterval = null;
var peer = null;
var lastItId = "";

const timeout = 10 * 1000; 

const peerName = "host";
const seerverKey = "jwc9qpy8esnel8fr";

$(function(){
    log("Init server");
    peer = new Peer(peerName, {key: seerverKey});
    log("Waiting on connection");
    
    peer.on('open', onOpen);
    peer.on("disconnected", onDisconnection);
    peer.on("error", onError);
    $( window ).unload(onUnload);
    
})

function onOpen(id) {
    log("Connected to signal server with id '" + id + "'" );
        
    connectionInterval = setInterval(checkConnectionsAreAlive,10*1000);
    itCheckInterval = setInterval(checkIt,5*1000);
        
    peer.on('connection', newConection);
   
};

function onDisconnection(){
    log("disconnected from signal server", "red");
    clearInterval(connectionInterval);
    clearInterval(itCheckInterval);
}

function onError(err){
   log("Error: " + JSON.stringify(err), "red"); 
}

function onUnload(){
    peer.disconnect();
    clearInterval(connectionInterval);
    clearInterval(itCheckInterval);
    log("disconnected from signal server");
}

function sendAllPlayers(data, id){
    if (id == null) id = '';
    
    for(let i = 0; i < players.length; i++){
        if(players[i].id != id) players[i].connection.send(data);
    }
}

function newConection(conn){
    
    log("New connection with " + conn.id, "green");
    
    let newPlayer = {
        "connection" : conn,
        "id" : conn.id,
        "peerName" : "",
        "msg" : [],
        "lastMsh" : Date.now(),
        "startConnection" : Date.now(),
        "connected" : true,
        "it": false
    }
    
    players.push(newPlayer);
        
    setTimeout(function(){
        checkIt();
    }, 1000);
    
    conn.on('data', function(data) {
        receiveData(newPlayer, data);
    });
}

function findPlayer(id){
    for(let i = 0; i < players.length; i++){
        if (players[i].peerName == id) return i;
    }
    
    return null;
}

function receiveData(player, data){    
    try{
        if (player == undefined) {
            log(data.id + " came back.", "green");
        }else{
        
            player.lastMsh = Date.now();
            player.msg.push(data);
            player.peerName = data.id;

            switch(data.type){
                case 'player':
                    sendAllPlayers(data, player.id);
                break;

                case 'tag':
                    tagReqeust(data, player);
                break;

                case 'exit':
                    log("Closing connection with " + player.id + " (Exit)", "green");
                    sendAllPlayers({type: "server", "message" : "quitPlayer", "id": player.peerName}, player.peerName);
                    players.splice(findPlayer(player.peerName));
                    checkIt();
                break;

            }
            
        }

    }
    catch(exp){
        log("Error " + JSON.stringify(exp), "red");
        console.error(exp, data);
    }
}

function tagReqeust(data, player){
    
    if (player.it){
    
        sendAllPlayers({type: "server", "message" : "tag"}, player.peerName);
        
        let x2, y2 = 0;

        let x1 = data.position[0];
        let y1 = data.position[2];

        for(let i = 0; i < players.length; i++){
            if (players[i].id !== player.id){

                let position = players[i].msg[players[i].msg.length-1].position;
                x2 = position[0];
                y2 = position[2];

                let d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );

                if (d < 3){
                    log(player.id  + " tagged " + players[i].id, "blue");
                    player.it = false;
                    setIt(players[i]);
                    return;
                }
            }
        }

        log(player.id + " tried to tag but nobody was close enough", "blue");
        
    }

}

function checkConnectionsAreAlive(){

    let time = Date.now();
    let remove = [];
    
    for(let i = 0; i < players.length; i++){
        if ((time - players[i].lastMsh) >= timeout){
            remove.push(i);
        }
    };
    
    for(let i = 0; i < remove.length; i++){
        sendAllPlayers({type: "server", "message" : "quitPlayer", "id": players[remove[i]].peerName}, players[remove[i]].peerName);
        log("Closing connection with " + players[remove[i]].id + " (Timeout)", "green");
        players.splice(remove[i], 1);
        checkIt();
    }
    
    log("There are " + players.length + " active players");
}

function setIt(player){
    player.it = true;
    sendAllPlayers({type: "server", "message" : "setIt", "id": player.peerName}, "none");
}


function checkIt(){
    let countPlayer = 0.0;
    
    for(let i = 0; i < players.length; i++){
        if (players[i].connected){
            countPlayer ++;
            
            if (players[i].it) {
                setIt(players[i]);
                return;
            }
        }
    }
    
    if (countPlayer > 0.0){
        var newIt = Math.round(Math.random()*(countPlayer-1));
        var found = 0;
        
        for(let i = 0; i < players.length; i++){
            if (players[i].connected){

                if (newIt === found){
                    log(players[i].id + " is now randomly selected as 'it'", "blue");
                    setIt(players[i]);
                    return;
                }
                found++;
            }
        }
    }
}


function log(text, color){
    if (typeof(showLog) !== 'undefined' && showLog){
        if (color == undefined) color = "white";
        $("#info").prepend("<div style='color:" + color + ";'>" + lineCount.toString() + ". " + text + "</div>");
        lineCount++;
    }
}