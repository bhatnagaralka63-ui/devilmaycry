// ===============================
// COMBAT SYSTEM
// ===============================

let attacking = false;
let attackTimer = 0;
let attackCooldown = 0;

let comboStep = 0;
let comboTimer = 0;

let hitEnemies = [];

let sword;


// ===============================
// COMBAT SETTINGS
// ===============================

const ATTACK_DURATION = 0.30;
const ATTACK_COOLDOWN = 0.35;
const COMBO_RESET_TIME = 0.80;

const HIT_RANGE = 3.2;


// ===============================
// COMBO DAMAGE
// ===============================

const COMBO_DAMAGE = {

    1: 25,
    2: 35,
    3: 55

};


// ===============================
// CREATE SWORD
// ===============================

function createSword(){

    const geometry =
        new THREE.BoxGeometry(
            0.15,
            0.15,
            2.5
        );

    const material =
        new THREE.MeshStandardMaterial({

            color: 0xdddddd,

            metalness: 0.8,

            roughness: 0.2

        });


    sword =
        new THREE.Mesh(
            geometry,
            material
        );


    sword.position.set(
        0.7,
        0.2,
        -1.2
    );


    sword.rotation.x =
        Math.PI / 2;


    sword.castShadow = true;


    player.add(
        sword
    );

}


// ===============================
// MOUSE ATTACK
// ===============================

window.addEventListener(
    "mousedown",
    function(event){

        if(event.button === 0){

            attack();

        }

    }
);


// ===============================
// START ATTACK
// ===============================

function attack(){

    if(attacking) return;

    if(attackCooldown > 0) return;

    if(playerDead) return;


    attacking = true;

    attackTimer =
        ATTACK_DURATION;

    attackCooldown =
        ATTACK_COOLDOWN;

    hitEnemies = [];


    // =========================
    // COMBO
    // =========================

    comboStep++;


    if(comboStep > 3){

        comboStep = 1;

    }


    comboTimer =
        COMBO_RESET_TIME;

}


// ===============================
// UPDATE COMBAT
// ===============================

function updateCombat(delta){

    // =========================
    // ATTACK COOLDOWN
    // =========================

    if(attackCooldown > 0){

        attackCooldown -= delta;

    }


    // =========================
    // COMBO TIMER
    // =========================

    if(comboTimer > 0){

        comboTimer -= delta;


        if(comboTimer <= 0){

            comboStep = 0;

        }

    }


    if(!attacking) return;


    // =========================
    // ATTACK TIMER
    // =========================

    attackTimer -= delta;


    const progress =
        1 -
        (
            attackTimer /
            ATTACK_DURATION
        );


    // =========================
    // ATTACK 1
    // =========================

    if(comboStep === 1){

        sword.rotation.z =
            -Math.PI *
            progress;

    }


    // =========================
    // ATTACK 2
    // =========================

    if(comboStep === 2){

        sword.rotation.z =
            Math.PI *
            progress;

    }


    // =========================
    // ATTACK 3
    // =========================

    if(comboStep === 3){

        sword.rotation.x =
            Math.PI / 2 +
            Math.PI *
            progress;

    }


    // =========================
    // CHECK HITS
    // =========================

    checkSwordHit();


    // =========================
    // ATTACK FINISHED
    // =========================

    if(attackTimer <= 0){

        attacking = false;

        sword.rotation.z = 0;

        sword.rotation.x =
            Math.PI / 2;

    }

}


// ===============================
// CHECK SWORD HIT
// ===============================

function checkSwordHit(){

    for(
        let i = 0;
        i < enemies.length;
        i++
    ){

        const enemy =
            enemies[i];


        if(!enemy) continue;


        // Already hit during
        // this attack
        if(
            hitEnemies.includes(
                enemy
            )
        ){

            continue;

        }


        // =========================
        // DISTANCE CHECK
        // =========================

        const distance =
            enemy.position.distanceTo(
                player.position
            );


        if(
            distance <= HIT_RANGE
        ){

            hitEnemies.push(
                enemy
            );


            // =========================
            // DAMAGE
            // =========================

            let damage =
                COMBO_DAMAGE[comboStep];


            // =========================
            // DEVIL TRIGGER BOOST
            // =========================

            if(devilTriggerActive){

                damage *=
                    DEVIL_TRIGGER_DAMAGE_MULTIPLIER;

            }


            // =========================
            // DAMAGE ENEMY
            // =========================

            damageEnemy(
                enemy,
                damage
            );


            // =========================
            // DEVIL TRIGGER GAUGE
            // =========================

            addDevilTrigger(8);

        }

    }

}


// ===============================
// HIT EFFECT
// ===============================

function createHitEffect(enemy){

    const geometry =
        new THREE.SphereGeometry(
            0.15,
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


    scene.add(
        effect
    );


    setTimeout(function(){

        scene.remove(
            effect
        );

    }, 120);

}


// ===============================
// RESET COMBO
// ===============================

function resetCombo(){

    comboStep = 0;

    comboTimer = 0;

}


// ===============================
// GET COMBO
// ===============================

function getCombo(){

    return comboStep;

}
