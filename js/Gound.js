function Ground(scene){


    let grid = new THREE.GridHelper(130, gridWeight);
    grid.setColors(0x112b00, 0x112b00);
    grid.position.set(gridWeight/2, gridWeight/2, gridWeight/2);
    scene.add(grid);
    var loader = new THREE.Loader();
    
    let grassLayers = [];
    

    
    let CreateMesh = function(){
        var loader = new THREE.TextureLoader();
        
        loader.load("media/textrues/grass-texture.jpg", function(tex){
            loader.load("media/textrues/terain.png", function(terainTex){
        
                tex.repeat.set(30, 30);
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;

                //let planeGemorty = new THREE.PlaneGeometry(500, 500, 500);
                let planeGemorty = new THREE.PlaneBufferGeometry( 1000, 1000, 250, 250 );
  
                let planeMaterial = new THREE.MeshLambertMaterial({map: tex});

                let plane = new THREE.Mesh(planeGemorty, planeMaterial);

                plane.rotation.x = -0.5*Math.PI;
                plane.receiveShadow = true;
                plane.castShadow = true;
                scene.add(plane);

                plane.position.set(0,(gridWeight/2)-0.1,0);
            })
        });
    }

    
    this.update = function(delta){
        

    }
    
    
    CreateMesh();


    
    
}