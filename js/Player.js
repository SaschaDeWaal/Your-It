function Player(scene, keyboard, it, world){
    
    this.scene = scene;
    this.keyboard = keyboard;
    this.color = 'rgb(255,0,0)'
    this.isIt = false;
    
    
    const speed = 0.04;
    const alineSpeed = 0.005;
    
    let lastDir = -1;
    let pressed = false;
    let audio = new Audio('media/sound/roll.wav');
    let lastPosition = new THREE.Vector2(0, 0);

    this.init = function(){
        
        //create mesh
        this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        let cubeGemerty = new THREE.BoxGeometry(gridWeight, gridWeight, gridWeight);
        let cubeMaterial = new THREE.MeshLambertMaterial({color: this.color});
        this.mesh = new THREE.Mesh(cubeGemerty, cubeMaterial);
        this.mesh.position.set(13*gridWeight, gridWeight, gridWeight*-6);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
 
    }
    
    let animation = function(mesh){
        
        let xState = ((mesh.position.x/gridWeight) - Math.floor(mesh.position.x/gridWeight));
        let zState = ((mesh.position.z/gridWeight) - Math.floor(mesh.position.z/gridWeight));
        
        xState = Math.round(xState*100)/100;
        zState = Math.round(zState*100)/100;
                
        if (lastDir == 1 || lastDir == 2) zState = 0;
        if (lastDir == 3 || lastDir == 4) xState = 0;
        
        mesh.rotation.set(Math.PI*(zState/2), 0, Math.PI*(xState/2)*-1);

    }
    
    let clamb = function(num, min, max){
        if (num < min) num = min;
        if (num > max) num = max;
        return num;
    }
    
    let soundEffect = function(x, y){
        if (!lastPosition.equals(new THREE.Vector2(x,y))){
            audio.play();
            lastPosition = new THREE.Vector2(x,y);
        }
    }
    
    let checkPosition = function(x, y){

        for(var i = 0; i < world.treePositions.length; i++){
            if (x == world.treePositions[i][0] && y == world.treePositions[i][1]) return false;
        }
        
        return true;
    }
    
 
    this.moveControll = function(){
        
        let moveX = 0;
        let moveZ = 0;
        
        let gridX = Math.round(this.mesh.position.x/gridWeight);
        let gridZ = Math.round(this.mesh.position.z/gridWeight);
                
        //movement
        if(this.keyboard.pressed("left") && checkPosition(gridX-1, gridZ)){
            this.mesh.position.x -= speed*delta;    
            lastDir = 1;
            moveZ = this.mesh.position.z - (Math.round(this.mesh.position.z/gridWeight)*gridWeight);
        }else if(this.keyboard.pressed("right")  && checkPosition(gridX+1, gridZ)){
            this.mesh.position.x += speed*delta; 
            moveZ = this.mesh.position.z - (Math.round(this.mesh.position.z/gridWeight)*gridWeight);
            lastDir = 2;
        }else if(this.keyboard.pressed("up")  && checkPosition(gridX, gridZ-1)){
            this.mesh.position.z -= speed*delta;    
            lastDir = 3;
            moveX = this.mesh.position.x - (Math.round(this.mesh.position.x/gridWeight)*gridWeight);
        }else if(this.keyboard.pressed("down") && checkPosition(gridX, gridZ+1)){
            this.mesh.position.z += speed*delta;  
            lastDir = 4;
            moveX = this.mesh.position.x - (Math.round(this.mesh.position.x/gridWeight)*gridWeight);
            
        //aline the player on the grid
        }else{

            if (lastDir == 1) moveX = this.mesh.position.x - (Math.floor(this.mesh.position.x/gridWeight)*gridWeight); 
            if (lastDir == 2) moveX = this.mesh.position.x - (Math.ceil(this.mesh.position.x/gridWeight)*gridWeight); 
            if (lastDir == 3) moveZ = this.mesh.position.z - (Math.floor(this.mesh.position.z/gridWeight)*gridWeight); 
            if (lastDir == 4) moveZ = this.mesh.position.z - (Math.ceil(this.mesh.position.z/gridWeight)*gridWeight); 
            
        }
        
        this.mesh.position.add(new THREE.Vector3(moveX*-1*alineSpeed*delta, 0, moveZ*-1*alineSpeed*delta));
        this.mesh.position.set(Mathf.toTwoDecimal(this.mesh.position.x), Mathf.toTwoDecimal(this.mesh.position.y), Mathf.toTwoDecimal(this.mesh.position.z) );
        
        
        
        this.mesh.position.x = clamb(this.mesh.position.x, -125, 125);
        this.mesh.position.z = clamb(this.mesh.position.z, -125, 125);
        
        soundEffect(Math.round(this.mesh.position.x/gridWeight), Math.round(this.mesh.position.z/gridWeight));
    }
    
    this.tag = function(){
        if(this.keyboard.pressed("ctrl")){
            if (!pressed){
                pressed = true;
                console.log("tik");
                it.hit();
            }
        }else{
            pressed = false;
        }
    }
    
    this.update = function(delta){
        
        this.moveControll();
        animation(this.mesh);
        
        if (this.isIt) this.tag();
    }
    
    this.init();
}
