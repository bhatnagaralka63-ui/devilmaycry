// =====================================
// CRIMSON STYLE - COMBAT SYSTEM
// =====================================

// -------------------------------------
// COMBAT STATE
// -------------------------------------

let attacking = false;

let attackTimer = 0;
let attackCooldown = 0;

let comboStep = 0;
let comboTimer = 0;

let hitEnemies = [];

let sword;


// -------------------------------------
// COMBAT SETTINGS
// -------------------------------------

const ATTACK_DURATION = 0.30;
const ATTACK_COOLDOWN = 0.35;

const COMBO_RESET_TIME = 0.80;

const ATTACK_DAMAGE = 35;
const HIT_RANGE = 3.2;


// =====================================
// CREATE SWORD
// =====================================

function createSword(){

    if(!player) return;

    sword = new THREE.Mesh(

        new THREE.BoxGeometry(
            0.15,
            0.15,
            2.5
        ),

        new THREE.MeshStandardMaterial({

            color: 0xdddddd,

            metalness: 0.85,

            roughness: 0.2

        })

    );


    sword.castShadow = true;


    sword.position.set(

        0.7,
        0.2,
        -1.2

    );


    sword.rotation.x =
        Math.PI / 2;


    player.add(sword);

}


// =====================================
// MOUSE ATTACK
// =====================================

window.addEventListener(
    "mousedown",
    function(event){

        // Left mouse button

        if(event.button === 0){

            attack();

        }

    }
);


// =====================================
// ATTACK FUNCTION
// =====================================

function attack(){

    // Don't attack while already
    // performing an attack

    if(attacking){

        return;

    }


    // Cooldown

    if(attackCooldown > 0){

        return;

    }


    // Start attack

    attacking = true;

    attackTimer = ATTACK_DURATION;

    attackCooldown = ATTACK_COOLDOWN;


    // Reset hit list

    hitEnemies = [];


    // Increase combo

    comboStep++;


    if(comboStep > 3){

        comboStep = 1;

    }


    comboTimer =
        COMBO_RESET_TIME;


    console.log(
        "COMBO:",
        comboStep
    );

}


// =====================================
// UPDATE COMBAT
// =====================================

function updateCombat(delta){

    if(!player) return;


    // ---------------------------------
    // ATTACK COOLDOWN
    // ---------------------------------

    if(attackCooldown > 0){

        attackCooldown -= delta;

    }


    // ---------------------------------
    // COMBO TIMER
    // ---------------------------------

    if(comboTimer > 0){

        comboTimer -= delta;

    }

    else{

        comboStep = 0;

    }


    // ---------------------------------
    // ATTACK ANIMATION
    // ---------------------------------

    if(attacking){

        attackTimer -= delta;


        if(!sword) return;


        // =============================
        // COMBO 1
        // =============================

        if(comboStep === 1){

            const progress =
                1 -
                attackTimer /
                ATTACK_DURATION;


            sword.rotation.y =
                -1.5 +
                progress * 3;


        }


        // =============================
        // COMBO 2
        // =============================

        else if(comboStep === 2){

            const progress =
                1 -
                attackTimer /
                ATTACK_DURATION;


            sword.rotation.y =
                1.5 -
                progress * 3;


        }


        // =============================
        // COMBO 3
        // =============================

        else if(comboStep === 3){

            const progress =
                1 -
                attackTimer /
                ATTACK_DURATION;


            sword.rotation.y =
                -2 +
                progress * 4;


        }


        // ---------------------------------
        // CHECK FOR HITS
        // ---------------------------------

        checkSwordHit();


        // ---------------------------------
        // END ATTACK
        // ---------------------------------

        if(attackTimer <= 0){

            attacking = false;

            sword.rotation.y = 0;

        }

    }

}


// =====================================
// SWORD HIT DETECTION
// =====================================

function checkSwordHit(){

    if(!enemies) return;


    for(
        let i = 0;
        i < enemies.length;
        i++
    ){

        const enemy = enemies[i];


        if(!enemy) continue;


        // ---------------------------------
        // Don't hit same enemy twice
        // during one swing
        // ---------------------------------

        if(
            hitEnemies.includes(enemy)
        ){

            continue;

        }


        // ---------------------------------
        // Distance
        // ---------------------------------

        const distance =
            player.position.distanceTo(
                enemy.position
            );


        // ---------------------------------
        // Enemy is inside sword range
        // ---------------------------------

        if(distance <= HIT_RANGE){

            damageEnemy(
                enemy,
                ATTACK_DAMAGE
            );


            hitEnemies.push(enemy);


            // Hit effect

            createHitEffect(enemy);


            console.log(
                "HIT!",
                "Damage:",
                ATTACK_DAMAGE
            );

        }

    }

}


// =====================================
// HIT EFFECT
// =====================================

function createHitEffect(enemy){

    if(!enemy) return;


    const geometry =
        new THREE.SphereGeometry(
            0.12,
            8,
            8
        );


    const material =
        new THREE.MeshBasicMaterial({

            color: 0xffff00

        });


    const effect =
        new THREE.Mesh(
            geometry,
            material
        );


    effect.position.copy(
        enemy.position
    );


    effect.position.y += 1;


    scene.add(effect);


    // Remove effect shortly after

    setTimeout(function(){

        scene.remove(effect);

        geometry.dispose();

        material.dispose();

    }, 120);

}


// =====================================
// RESET COMBO
// =====================================

function resetCombo(){

    comboStep = 0;

    comboTimer = 0;

    hitEnemies = [];

}


// =====================================
// GET COMBO
// =====================================

function getCombo(){

    return comboStep;

}
