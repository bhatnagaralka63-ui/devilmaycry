// ===============================
// ENEMY SYSTEM
// ===============================

let enemies = [];

const ENEMY_SPEED = 2.2;
const ENEMY_HEALTH = 100;
const ENEMY_ATTACK_RANGE = 2.2;
const ENEMY_DETECT_RANGE = 15;

const ENEMY_DAMAGE = 10;
const ENEMY_ATTACK_COOLDOWN = 1.2;


// ===============================
// CREATE ENEMIES
// ===============================

function createEnemies(){

    createEnemy(-5, -5);
    createEnemy(5, -5);
    createEnemy(-6, 3);
    createEnemy(6, 3);
    createEnemy(0, -8);

}


// ===============================
// CREATE ONE ENEMY
// ===============================

function createEnemy(x, z){

    const geometry =
        new THREE.BoxGeometry(
            1.2,
            2,
            1.2
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x550000,
            roughness: 0.7
        });

    const enemy =
        new THREE.Mesh(
            geometry,
            material
        );

    enemy.position.set(
        x,
        1,
        z
    );

    enemy.castShadow = true;
    enemy.receiveShadow = true;

    enemy.health = ENEMY_HEALTH;
    enemy.maxHealth = ENEMY_HEALTH;

    enemy.attackCooldown = 0;

    // Hit reaction
    enemy.hitStunTimer = 0;
    enemy.knockbackVelocity =
        new THREE.Vector3();

    enemy.originalColor = 0x550000;

    scene.add(enemy);

    enemies.push(enemy);

    createEnemyHealthBar(enemy);
}


// ===============================
// UPDATE ENEMIES
// ===============================

function updateEnemies(delta){

    for(let i = enemies.length - 1; i >= 0; i--){

        const enemy = enemies[i];

        if(!enemy) continue;


        // =========================
        // HIT STUN
        // =========================

        if(enemy.hitStunTimer > 0){

            enemy.hitStunTimer -= delta;

            // Apply knockback
            enemy.position.addScaledVector(
                enemy.knockbackVelocity,
                delta
            );

            // Slow knockback
            enemy.knockbackVelocity.multiplyScalar(
                Math.pow(0.05, delta)
            );

            // Slight shake
            enemy.rotation.z =
                Math.sin(
                    performance.now() * 0.04
                ) * 0.08;

            continue;
        }


        // Reset rotation
        enemy.rotation.z = 0;


        // =========================
        // DISTANCE TO PLAYER
        // =========================

        const direction =
            new THREE.Vector3()
                .subVectors(
                    player.position,
                    enemy.position
                );

        const distance =
            direction.length();


        // =========================
        // FACE PLAYER
        // =========================

        enemy.lookAt(
            player.position.x,
            enemy.position.y,
            player.position.z
        );


        // =========================
        // ATTACK COOLDOWN
        // =========================

        if(enemy.attackCooldown > 0){

            enemy.attackCooldown -= delta;

        }


        // =========================
        // CHASE PLAYER
        // =========================

        if(
            distance > ENEMY_ATTACK_RANGE &&
            distance < ENEMY_DETECT_RANGE
        ){

            direction.normalize();

            enemy.position.addScaledVector(
                direction,
                ENEMY_SPEED * delta
            );

        }


        // =========================
        // ATTACK PLAYER
        // =========================

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

    // Small attack animation
    enemy.scale.set(
        1.15,
        0.9,
        1.15
    );

    setTimeout(function(){

        if(enemy){

            enemy.scale.set(
                1,
                1,
                1
            );

        }

    }, 150);


    damagePlayer(
        ENEMY_DAMAGE
    );
}


// ===============================
// DAMAGE ENEMY
// ===============================

function damageEnemy(enemy, damage){

    if(!enemy) return;

    if(enemy.health <= 0) return;


    // =========================
    // REDUCE HEALTH
    // =========================

    enemy.health -= damage;


    // =========================
    // HIT REACTION
    // =========================

    enemy.hitStunTimer = 0.18;


    // Direction away from player
    const knockbackDirection =
        new THREE.Vector3()
            .subVectors(
                enemy.position,
                player.position
            )
            .normalize();


    enemy.knockbackVelocity
        .copy(knockbackDirection)
        .multiplyScalar(4.5);


    // =========================
    // FLASH WHITE
    // =========================

    enemy.material.emissive.setHex(
        0xffffff
    );

    enemy.material.emissiveIntensity = 1;


    setTimeout(function(){

        if(enemy && enemy.material){

            enemy.material.emissive.setHex(
                0x000000
            );

            enemy.material.emissiveIntensity = 0;

        }

    }, 100);


    // =========================
    // DAMAGE NUMBER
    // =========================

    createDamageNumber(
        enemy,
        damage
    );


    // =========================
    // HIT EFFECT
    // =========================

    createHitEffect(
        enemy
    );


    // =========================
    // DEAD
    // =========================

    if(enemy.health <= 0){

        killEnemy(enemy);

    }

}


// ===============================
// KILL ENEMY
// ===============================

function killEnemy(enemy){

    const index =
        enemies.indexOf(enemy);

    if(index === -1) return;


    // Remove HP bar
    removeEnemyHealthBar(
        enemy
    );


    // Death animation
    enemy.scale.set(
        1,
        0.2,
        1
    );


    setTimeout(function(){

        scene.remove(enemy);

        enemies.splice(
            index,
            1
        );

        updateHUD();

    }, 200);

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

    scene.add(effect);


    setTimeout(function(){

        scene.remove(effect);

    }, 120);

}


// ===============================
// DAMAGE NUMBER
// ===============================

function createDamageNumber(
    enemy,
    damage
){

    const number =
        document.createElement(
            "div"
        );

    number.className =
        "damage-number";

    number.textContent =
        "-" + damage;

    document.body.appendChild(
        number
    );


    function animateNumber(){

        if(!enemy){

            number.remove();
            return;

        }


        const position =
            enemy.position.clone();

        position.y += 2;


        const screen =
            position.clone();

        screen.project(
            camera
        );


        const x =
            (screen.x * 0.5 + 0.5) *
            window.innerWidth;

        const y =
            (-screen.y * 0.5 + 0.5) *
            window.innerHeight;


        number.style.left =
            x + "px";

        number.style.top =
            y + "px";


        requestAnimationFrame(
            animateNumber
        );

    }


    animateNumber();


    setTimeout(function(){

        number.remove();

    }, 600);

}
