function World(scene){
    
    
    this.treePositions = [[4,24],[8,2],[-15,4],[15,17],[2,-7],[13,-13],[-7,1],[-9,-5],[-1,21],[-12,-14],[-1,-11],[-8,24],[-14,-5],[-8,7],[-4,13],[-24,18],[-10,2],[16,2],[4,-14],[10,22],[-13,-20],[-23,11],[-20,22],[-14,1],[9,-18],[6,9],[-5,15],[0,1],[13,6],[-20,-14], [21, -8], [24,10],[25,25],[-13,18],[-23,-2]];
    var treePositions = this.treePositions;
    

    var loader = new THREE.AssimpJSONLoader();
    
    loader.load( "media/3d/originalTree.json", function(object){
        object.scale.multiplyScalar( 0.4 );
        for(var i = 0; i < treePositions.length; i++){
            var mesh = object.clone();

            mesh.position.set(treePositions[i][0]*gridWeight, 2, treePositions[i][1]*gridWeight);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add( mesh );
        }
    } );
    
    loader.load( "media/3d/pado.json", function(object){
        
        object.scale.multiplyScalar( 0.4 );
        object.castShadow = true;
        object.receiveShadow = true;
        
        for(var i = 0; i < 5; i++){
           var mesh = object.clone();
            mesh.position.set((-25+(Math.random()*50))*gridWeight, 3, (-25+(Math.random()*50))*gridWeight);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add( mesh );
        }

    });
    
    loader.load( "media/3d/Fence_Small_Timber_05.json", function(object){
        object.scale.multiplyScalar( 0.014 );
        object.castShadow = true;
        object.receiveShadow = true;
        
        for(var x = -25; x < 25; x+=2){
            var mesh = object.clone();
            mesh.position.set(((x+1)*gridWeight)+3,3,25.5*gridWeight);
            mesh.rotation.set(0, Math.PI, 0);
            scene.add( mesh );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            var mesh = object.clone();
            mesh.position.set((x*gridWeight)-3,3,-25.5*gridWeight);
            scene.add( mesh );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        
        for(var z = -24; z < 27; z+=2){
            var mesh = object.clone();
            mesh.position.set(-25.5*gridWeight, 3, z*gridWeight);
            mesh.rotation.set(0, Math.PI/2, 0);
            scene.add( mesh );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            var mesh = object.clone();
            mesh.position.set(25.5*gridWeight, 3, (z-2)*gridWeight);
            mesh.rotation.set(0, -(Math.PI/2), 0);
            scene.add( mesh );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        
        
    });
    
}