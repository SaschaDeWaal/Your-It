function NetworkPlayer(scene, startPosition, color){
    
    this.moveTo = [];
    let mesh = null;
    const speed = 0.1;
    
    let createMesh = function(){
        let cubeGemerty = new THREE.BoxGeometry(gridWeight, gridWeight, gridWeight);
        let cubeMaterial = new THREE.MeshLambertMaterial({color: color});
        mesh = new THREE.Mesh(cubeGemerty, cubeMaterial);
        mesh.position.set(startPosition[0]*gridWeight, startPosition[1]*gridWeight, startPosition[2]*gridWeight);
        mesh.castShadow = true;
        scene.add(mesh);
 
    }
    
    let animation = function(mesh){
        
        let xState = ((mesh.position.x/gridWeight) - Math.floor(mesh.position.x/gridWeight));
        let zState = ((mesh.position.z/gridWeight) - Math.floor(mesh.position.z/gridWeight));
        
        xState = Math.round(xState*100)/100;
        zState = Math.round(zState*100)/100;
                
        if (zState < 0.1 || zState > 0.9) zState = 0;
        
        mesh.rotation.set(Math.PI*(zState/2), 0, Math.PI*(xState/2)*-1);

    }
    
    let maxSpeed = function(val){
        if (val > 1) val = 1;
        if (val < -1) val = -1;
        return val;
    }
    
    this.update = function(delta){
        
        /*if (this.moveTo.length > 0){
        
            let move = new THREE.Vector3(this.moveTo[0][0]*gridWeight, this.moveTo[0][1]*gridWeight, this.moveTo[0][2]*gridWeight);
            let deltaTime = 1;//(delta/20.0);
            
            console.log(delta);
            
            mesh.position.add(new THREE.Vector3(maxSpeed(move.x-mesh.position.x)*(deltaTime), 0, maxSpeed(move.z-mesh.position.z)*(deltaTime)));

            animation(mesh);
            
            if (Math.abs(move.x-mesh.position.x) < 0.1 && Math.abs(move.z-mesh.position.z) < 0.1){
                this.moveTo.splice(0,1);
            }
        }*/
        
        
        //if (this.moveTo.length > 20) this.moveTo.slice(0, this.moveTo.length-2);
        
        if (this.moveTo.length > 0){
            let move = new THREE.Vector3(this.moveTo[this.moveTo.length-1][0]*gridWeight, this.moveTo[this.moveTo.length-1][1]*gridWeight, this.moveTo[this.moveTo.length-1][2]*gridWeight);
            mesh.position.lerp(move, delta/100)
            
            animation(mesh);
        }
        
    }
    
    this.getMesh = function(){
        return mesh;
    }
    
    this.destroy = function(){
        scene.remove(mesh);
    }
    
    
    createMesh();
    
}