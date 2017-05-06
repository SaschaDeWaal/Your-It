const gridWeight = 5;

$(function(){
    
    var scene, camera, renderer;
    var keyboard;
    var player, followCamera, light, ground, network, it, world, backgroundMusic;
    var oldTime = 0;
    
    function Init(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 500);
        renderer = new THREE.WebGLRenderer();
        scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
        scene.add(camera);

        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
    
        keyboard = new THREEx.KeyboardState();

        //create objects
        world = new World(scene);
        it = new ItIcon(scene);
        player = new Player(scene, keyboard, it, world);
        followCamera = new FollowCamera(camera, player);
        light = new Light(scene, player);
        ground = new Ground(scene);
        network = new Network(player, scene, it);
        
        //music
        backgroundMusic = new Audio('media/sound/background.wav');
        backgroundMusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        backgroundMusic.play();
        
        
        
        $("#webGL-container").append(renderer.domElement);
        $(window).resize(Resize);
        
        Update();
    }
    
    function Resize(){
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    function Render(delta){
                
        player.update(delta);
        followCamera.update(delta);
        light.update();
        network.update(delta);
        ground.update(delta);
        it.update(delta);
        
        renderer.render(scene, camera);
        
    }
    
    function Update(){
        
        delta = Date.now() - oldTime;
        oldTime = Date.now();
        if (delta > 100) delta = 0;
        
        Render(delta);
        requestAnimationFrame(Update);
    }
    

    
    Init();
    
});


