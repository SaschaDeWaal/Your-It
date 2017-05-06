function Network(player, scene, it){
    
    const serverPeerId = 'host';
    const serverKey = 'jwc9qpy8esnel8fr';
    const timeoutTime = 1000*10;
    
    this.player = player;

    let conn = null;
    let peerId = '';
    let playerList = {};
    let playerObjects = [];
    let playing = true;
    let connected = false;
    let lastPlayerPos = new THREE.Vector3(100,0,0);
    let peer = new Peer({key: 'jwc9qpy8esnel8fr'});
    let lastRecivedMassage = Date.now();
    
    it.setNetworkObject(this);

    //works only with firefox
    $( window ).unload(function() {
        conn.send({'id': peerId, 'type': 'exit'});
        peer.disconnect();
    });
    
    let reopenNetork = function(){
        console.log("Reopen network");
        
        peer.disconnect();
        
        peer = new Peer({key: 'jwc9qpy8esnel8fr'});
        peer.on('open', opOpenSignal);
        lastRecivedMassage = Date.now();
    }
    
    let opOpenSignal = function(id){
        peerId = id;
        conn = peer.connect(serverPeerId);
        conn.on('data',reviceData);
        conn.on('open', openNetwork);
        
        //keep connection alive
        setInterval(function(){
            conn.send(createData());
        },1000*5);
    }
    
    
    let openNetwork = function(){
        connected = true;
    }
    
    let reviceData = function(data){
        
        lastRecivedMassage = Date.now();
        
        if (data.type == "player"){
            
            if (playerList[data.id] !== undefined){
                updatePlayer(data);
            }else{
                newPlayer(data);
            }
            
        }else if (data.type == "server"){
            if (data.message == "quitPlayer" && playerList[data.id] != undefined) quitPlayer(playerList[data.id].obj, data.id);
            if (data.message == "setIt") setIt(data);
            if (data.message == "tag") it.hitEffect();
        }
        
        
    };
    
    let setIt = function(mgs){        
        if (mgs.id == peerId){
            player.isIt = true;
            it.setIt(player.mesh);
        }else{
            if (playerList[mgs.id] != undefined){
                let index = playerList[mgs.id].obj;
                player.isIt = false;
                it.setIt(playerObjects[index].getMesh());
            }
        }
    }
        
    let quitPlayer = function(index, id){

        playerObjects[index].destroy();
        playerObjects.slice(index, 1);
    }
    
    let updatePlayer = function(data){        
        let index = playerList[data.id].obj;
        playerList[data.id].lastData = data;
        playerObjects[index].moveTo.push(data.position);
        
        if (data.isit){
            player.isIt = false;
            it.setIt(playerObjects[index].getMesh());
        }
        
        if(!data.playing) quitPlayer(index, data.id);
    }
    
    let newPlayer = function(data){
        
        playerObjects.push(new NetworkPlayer(scene, data.position, data.color));
        playerList[data.id] = {
            "lastData" : data,
            "obj" : (playerObjects.length-1)
        }
        
        conn.send(createData());
    }
    
    let createData = function(){
        let position = worldToGrid(player.mesh.position);
        return {'id' : peerId,
                'position': [position.x, position.y, position.z],
                'playing' : playing,
                'color' : player.color,
                'isit' : player.isIt,
                'type' : 'player'
               }
    }
    
    let worldToGrid = function(pos){
        return new THREE.Vector3(Math.round(pos.x/gridWeight), Math.round(pos.y/gridWeight), Math.round(pos.z/gridWeight));
    }
    
    this.sendTag = function(){
        let position = worldToGrid(player.mesh.position);
        conn.send({"id": peerId, "type": "tag", "playing": true, 'position': [position.x, position.y, position.z],});
    }
    
    this.update = function(delta){
        for(let i = 0; i < playerObjects.length; i++){
            playerObjects[i].update(delta);
        }
        
        //send information when position changed
        if (connected && !lastPlayerPos.equals(worldToGrid(player.mesh.position))){
                lastPlayerPos = worldToGrid(player.mesh.position);
                conn.send(createData());
        }  
        
        if (Date.now() - lastRecivedMassage > timeoutTime) reopenNetork();
        
    }
    
    
    peer.on('open', opOpenSignal);
    
}