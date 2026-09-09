// =====================================
// ENEMY SYSTEM
// =====================================

let enemies = [];


// =====================================
// ENEMY SETTINGS
// =====================================

const ENEMY_SPEED = 2.2;
const ENEMY_HEALTH = 100;
const ENEMY_ATTACK_RANGE = 2.2;
const ENEMY_DETECT_RANGE = 15;


// =====================================
// CREATE ENEMY
// =====================================

function createEnemy(x, z){

    const enemy = new THREE.Mesh(

        new THREE.BoxGeometry(
            1.2,
            2,
            1.2
        ),

        new THREE.MeshStandardMaterial({
            color: 0x660000
        })

    );

    enemy.position.set(
        x,
        1,
        z
    );

    enemy.castShadow = true;

    // Custom enemy data
    enemy.health = ENEMY_HEALTH;
    enemy.maxHealth = ENEMY_HEALTH;
    enemy.attackCooldown = 0;

    scene.add(enemy);

    enemies.push(enemy);

}


// =====================================
// CREATE MULTIPLE ENEMIES
// =====================================

function createEnemies(){

    createEnemy(5, -5);
    createEnemy(-5, -5);
    createEnemy(7, 5);
    createEnemy(-7, 5);

}


// =====================================
// UPDATE ENEMIES
// =====================================

function updateEnemies(delta){

    if(!player) return;


    for(let i = enemies.length - 1; i >= 0; i--){

        const enemy = enemies[i];

        if(!enemy) continue;


        // Distance to player

        const dx =
            player.position.x -
            enemy.position.x;

        const dz =
            player.position.z -
            enemy.position.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );


        // =================================
        // DETECT PLAYER
        // =================================

        if(distance < ENEMY_DETECT_RANGE){

            // Face player

            enemy.rotation.y =
                Math.atan2(dx, dz);


            // =================================
            // MOVE TOWARD PLAYER
            // =================================

            if(
                distance >
                ENEMY_ATTACK_RANGE
            ){

                enemy.position.x +=
                    (dx / distance) *
                    ENEMY_SPEED *
                    delta;

                enemy.position.z +=
                    (dz / distance) *
                    ENEMY_SPEED *
                    delta;

            }


            // =================================
            // ATTACK
            // =================================

            if(distance <= ENEMY_ATTACK_RANGE){

                enemyAttack(enemy, delta);

            }

        }


        // =================================
        // REMOVE DEAD ENEMY
        // =================================

        if(enemy.health <= 0){

            scene.remove(enemy);

            enemies.splice(i, 1);

        }

    }

}


// =====================================
// ENEMY ATTACK
// =====================================

function enemyAttack(enemy, delta){

    if(enemy.attackCooldown > 0){

        enemy.attackCooldown -= delta;

        return;

    }


    enemy.attackCooldown = 1.2;

    console.log("Enemy attacked!");

}


// =====================================
// DAMAGE ENEMY
// =====================================

function damageEnemy(enemy, damage){

    if(!enemy) return;


    enemy.health -= damage;

    console.log(
        "Enemy HP:",
        enemy.health
    );


    // Flash red

    enemy.material.color.setHex(
        0xff0000
    );


    setTimeout(() => {

        if(enemy && enemy.material){

            enemy.material.color.setHex(
                0x660000
            );

        }

    }, 100);


    // Death

    if(enemy.health <= 0){

        console.log("Enemy defeated!");

    }

}

function damageEnemy(enemy, damage){

    if(!enemy) return;

    enemy.health -= damage;

    const dx =
        enemy.position.x -
        player.position.x;

    const dz =
        enemy.position.z -
        player.position.z;

    const distance =
        Math.sqrt(
            dx * dx +
            dz * dz
        );


    if(distance > 0){

        enemy.position.x +=
            (dx / distance) * 0.7;

        enemy.position.z +=
            (dz / distance) * 0.7;

    }


    // Hit flash

    enemy.material.color.setHex(
        0xffffff
    );


    setTimeout(function(){

        if(enemy && enemy.material){

            enemy.material.color.setHex(
                0x660000
            );

        }

    }, 80);


    // Death

    if(enemy.health <= 0){

        scene.remove(enemy);

        const index =
            enemies.indexOf(enemy);

        if(index !== -1){

            enemies.splice(
                index,
                1
            );

        }

    }

}
