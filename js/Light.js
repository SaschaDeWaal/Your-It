function Light(scene, player){
    
    this.player = player;
    
    let light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.castShadow = true;
    light.position.set( 25, 60, 25 );
    light.target.position.set(0, 0, 0);

    light.castShadow = true;
    
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 100;

    light.shadow.camera.left = -150;
    light.shadow.camera.right = 150;
    light.shadow.camera.top = 150;
    light.shadow.camera.bottom = -150;
    
    
    

    scene.add( light );
    
    this.update = function(){
        //light.position.add(new THREE.Vector3(1,0,0));
    }
}