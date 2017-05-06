function ItIcon(scene){
    
    
    this.followMesh = null;
    this.network = null;
    let size = 1;
    this.hitAudio = new Audio('media/sound/it.wav');
    this.newIt = new Audio('media/sound/newIt.wav');
    
    this.init = function(){
        
        //create it
        let textGemerty = new THREE.CircleGeometry(gridWeight*1.5, 32);
        let textMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        this.itMesh = new THREE.Mesh(textGemerty, textMaterial);
        this.itMesh.position.set(0, -10, 0);
        this.itMesh.receiveShadow = true;
        this.itMesh.rotation.set( -(Math.PI/2), 0, 0);
        this.itMesh.scale.set(size, size, size);
        scene.add(this.itMesh);
        
    }
    
    this.setNetworkObject = function(network){
        this.network = network;
    }
    
    this.hit = function(){
        this.hitEffect();
        if (this.network != null) this.network.sendTag();
    }
    
    this.hitEffect = function(){
        size = 2;
        this.hitAudio.play();
    }
    
    this.setIt = function(mesh){
        if (this.followMesh != mesh){
            this.followMesh = mesh;
            this.newIt.play();
        }
        
    }
    
    this.update = function(delta){
        if (this.followMesh != null){
            this.itMesh.position.set(this.followMesh.position.x, 2.5, this.followMesh.position.z);
            this.itMesh.scale.set(size, size, size);
            
            if (size > 1) size -= (delta/200);
            if (size < 1) size += (delta/200);
        }
    }
    
    this.init();
}

