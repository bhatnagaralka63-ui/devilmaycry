let scene;
let camera;
let renderer;
let clock;

function init(){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({
        antialias:true
    });
    
    renderer.shadowMap.enabled = true;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();
    
    createWorld();
    createPlayer();
    createSword();
    createEnemies();
    animate();

}

function animate(){

    requestAnimationFrame(animate);

    let delta = clock.getDelta();

    updatePlayer(delta);
    updateCombat(delta);

    renderer.render(scene,camera);

}

init();
