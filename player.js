let player;

const keys = {};

const speed = 6;

function createPlayer(){

    player = new THREE.Mesh(

        new THREE.BoxGeometry(1,2,1),

        new THREE.MeshStandardMaterial({
            color:0xff0000
        })

    );

    player.position.y = 1;

    scene.add(player);

    camera.position.set(0,6,12);

    window.addEventListener("keydown",(e)=>{
        keys[e.code]=true;
    });

    window.addEventListener("keyup",(e)=>{
        keys[e.code]=false;
    });

}

function updatePlayer(delta){

    if(keys["KeyW"]){
        player.position.z -= speed*delta;
    }

    if(keys["KeyS"]){
        player.position.z += speed*delta;
    }

    if(keys["KeyA"]){
        player.position.x -= speed*delta;
    }

    if(keys["KeyD"]){
        player.position.x += speed*delta;
    }

    // Camera follows player
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 12;

    camera.lookAt(player.position);

}