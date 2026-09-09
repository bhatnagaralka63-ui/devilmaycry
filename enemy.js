// ===============================
// ENEMIES
// ===============================

let enemies = [];

const ENEMY_SPEED = 2.2;
const ENEMY_HEALTH = 100;

const ENEMY_ATTACK_RANGE = 2.2;
const ENEMY_DETECT_RANGE = 15;

const ENEMY_DAMAGE = 10;
const ENEMY_ATTACK_COOLDOWN = 1.2;


// ===============================
// CREATE ENEMY
// ===============================

function createEnemy(x, z){

    const geometry = new THREE.BoxGeometry(
        1.2,
        2,
        1.2
    );


    const material =
        new THREE.MeshStandardMaterial({
            color: 0x660000
        });


    const enemy = new THREE.Mesh(
        geometry,
        material
    );


    enemy.position.set(
        x,
        1,
        z
    );


    enemy.castShadow = true;


    enemy.health = ENEMY_HEALTH;

    enemy.maxHealth = ENEMY_HEALTH;

    enemy.attackCooldown = 0;


    scene.add(enemy);

    enemies.push(enemy);

}


// ===============================
// CREATE ALL ENEMIES
// ===============================

function createEnemies(){

    createEnemy(5, -5);

    createEnemy(-5, -5);

    createEnemy(7, 5);

    createEnemy(-7, 5);

}


// ===============================
// UPDATE ENEMIES
// ===============================

function updateEnemies(delta){

    if(!player) return;

    if(playerDead) return;


    for(let i = enemies.length - 1; i >= 0; i--){

        const enemy = enemies[i];

        if(!enemy) continue;


        // Cooldown

        if(enemy.attackCooldown > 0){

            enemy.attackCooldown -= delta;

        }


        // Distance to player

        const distance =
            enemy.position.distanceTo(
                player.position
            );


        // -------------------------------
        // CHASE
        // -------------------------------

        if(
            distance <= ENEMY_DETECT_RANGE &&
            distance > ENEMY_ATTACK_RANGE
        ){

            const direction =
                new THREE.Vector3()
                    .subVectors(
                        player.position,
                        enemy.position
                    )
                    .normalize();


            enemy.position.x +=
                direction.x *
                ENEMY_SPEED *
                delta;


            enemy.position.z +=
                direction.z *
                ENEMY_SPEED *
                delta;

        }


        // -------------------------------
        // FACE PLAYER
        // -------------------------------

        if(distance <= ENEMY_DETECT_RANGE){

            enemy.lookAt(
                player.position.x,
                enemy.position.y,
                player.position.z
            );

        }


        // -------------------------------
        // ATTACK
        // -------------------------------

        if(
            distance <= ENEMY_ATTACK_RANGE &&
            enemy.attackCooldown <= 0
        ){

            enemyAttack(enemy);

        }

    }

}


// ===============================
// ENEMY ATTACK
// ===============================

function enemyAttack(enemy){

    enemy.attackCooldown =
        ENEMY_ATTACK_COOLDOWN;


    damagePlayer(
        ENEMY_DAMAGE
    );

}


// ===============================
// DAMAGE ENEMY
// ===============================

function damageEnemy(enemy, damage){

    if(!enemy) return;


    enemy.health -= damage;


    // Flash white

    enemy.material.emissive.setHex(
        0xffffff
    );


    setTimeout(function(){

        if(enemy.material){

            enemy.material.emissive.setHex(
                0x000000
            );

        }

    }, 100);


    // Knockback

    const direction =
        new THREE.Vector3()
            .subVectors(
                enemy.position,
                player.position
            )
            .normalize();


    enemy.position.x +=
        direction.x * 0.7;

    enemy.position.z +=
        direction.z * 0.7;


    // Dead

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


    updateHUD();

}
