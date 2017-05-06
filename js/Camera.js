function FollowCamera(camera, player){
    this.camera = camera;
    this.player = player;
    
    this.camera.position.set(0, 0, 0);
    
    this.update = function(delta){
        
        let followSpeed = 0.005*delta;
        
        let playerPos = this.player.mesh.position;
        let newCameraPos = new THREE.Vector3(playerPos.x+20, playerPos.y+40, playerPos.z+50);
        let cameraPos = this.camera.position;
        let addCamera = new THREE.Vector3((newCameraPos.x-cameraPos.x)*followSpeed, (newCameraPos.y-cameraPos.y)*followSpeed, (newCameraPos.z-cameraPos.z)*followSpeed);
        
        this.camera.position.add(addCamera);
        this.camera.lookAt(this.player.mesh.position);
    }
    
}