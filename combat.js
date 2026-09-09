// =====================================
// COMBAT SYSTEM
// =====================================

let attacking = false;
let attackTimer = 0;
let attackCooldown = 0;

let comboStep = 0;
let comboTimer = 0;

const ATTACK_DURATION = 0.25;
const ATTACK_COOLDOWN = 0.35;
const COMBO_RESET_TIME = 0.8;


// =====================================
// SWORD
// =====================================

let sword;


// =====================================
// CREATE SWORD
// =====================================

function createSword(){

    sword = new THREE.Mesh(

        new THREE.BoxGeometry(
            0.15,
            0.15,
            2.5
        ),

        new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            metalness: 0.8,
            roughness: 0.2
        })

    );

    sword.position.set(
        0.7,
        0.2,
        -1.2
    );

    sword.rotation.x = Math.PI / 2;

    player.add(sword);

}


// =====================================
// INPUT
// =====================================

window.addEventListener("keydown", (event) => {

    if(event.code === "Mouse0"){
        attack();
    }

});


// Mouse attack
window.addEventListener("mousedown", (event) => {

    if(event.button === 0){

        attack();

    }

});


// =====================================
// ATTACK
// =====================================

function attack(){

    if(attacking) return;

    if(attackCooldown > 0) return;

    attacking = true;

    attackTimer = ATTACK_DURATION;

    attackCooldown = ATTACK_COOLDOWN;


    // Increase combo

    comboStep++;

    if(comboStep > 3){

        comboStep = 1;

    }

    comboTimer = COMBO_RESET_TIME;


    console.log(
        "ATTACK COMBO:",
        comboStep
    );

}


// =====================================
// UPDATE COMBAT
// =====================================

function updateCombat(delta){

    if(!player) return;


    // Cooldown

    if(attackCooldown > 0){

        attackCooldown -= delta;

    }


    // Combo timer

    if(comboTimer > 0){

        comboTimer -= delta;

    }
    else{

        comboStep = 0;

    }


    // Attack animation

    if(attacking){

        attackTimer -= delta;


        // Sword swing

        if(comboStep === 1){

            sword.rotation.y =
                Math.sin(
                    attackTimer * 18
                ) * 1.5;

        }

        else if(comboStep === 2){

            sword.rotation.y =
                -Math.sin(
                    attackTimer * 18
                ) * 1.8;

        }

        else if(comboStep === 3){

            sword.rotation.y =
                Math.sin(
                    attackTimer * 22
                ) * 2.2;

        }


        // End attack

        if(attackTimer <= 0){

            attacking = false;

            sword.rotation.y = 0;

        }

    }

}
