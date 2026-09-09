// ===============================
// PLAYER
// ===============================

let player;

const WALK_SPEED = 5;
const SPRINT_SPEED = 9;

const ACCELERATION = 35;
const DECELERATION = 25;

const JUMP_FORCE = 10;
const GRAVITY = -28;

const DASH_SPEED = 18;
const DASH_DURATION = 0.18;
const DASH_COOLDOWN = 0.7;

const DODGE_SPEED = 12;
const DODGE_DURATION = 0.35;
const DODGE_COOLDOWN = 0.8;


// ===============================
// PLAYER HEALTH
// ===============================

let playerHealth = 100;
let playerMaxHealth = 100;

let playerInvulnerable = false;
let playerInvulnerabilityTimer = 0;

let playerDead = false;


// ===============================
// MOVEMENT
// ===============================

const keys = {};

let velocityX = 0;
let velocityZ = 0;

let verticalVelocity = 0;

let isGrounded = true;
let jumpCount = 0;

const MAX_JUMPS = 2;


// ===============================
// DASH
// ===============================

let isDashing = false;
let dashTimer = 0;
let dashCooldownTimer = 0;

let dashDirectionX = 0;
let dashDirectionZ = 0;


// ===============================
// DODGE
// ===============================

let isDodging = false;
let dodgeTimer = 0;
let dodgeCooldownTimer = 0;

let dodgeDirectionX = 0;
let dodgeDirectionZ = 0;


// ===============================
// KEYBOARD
// ===============================

window.addEventListener("keydown", function(event){

    keys[event.code] = true;

    // Jump
    if(event.code === "Space"){
        jump();
    }

    // Dash
    if(event.code === "KeyQ"){
        startDash();
    }

    // Dodge
    if(event.code === "ControlLeft"){
        startDodge();
    }

});


window.addEventListener("keyup", function(event){

    keys[event.code] = false;

});


// ===============================
// CREATE PLAYER
// ===============================

function createPlayer(){

    const geometry = new THREE.BoxGeometry(
        1,
        2,
        1
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0xff0000
    });

    player = new THREE.Mesh(
        geometry,
        material
    );

    player.position.set(
        0,
        1,
        8
    );

    player.castShadow = true;

    scene.add(player);

    camera.position.set(
        0,
        6,
        20
    );

}


// ===============================
// UPDATE PLAYER
// ===============================

function updatePlayer(delta){

    if(!player) return;

    // -------------------------------
    // INVULNERABILITY TIMER
    // -------------------------------

    if(playerInvulnerabilityTimer > 0){

        playerInvulnerabilityTimer -= delta;

        if(playerInvulnerabilityTimer <= 0){

            playerInvulnerable = false;

            player.material.emissive.setHex(0x000000);

        }

    }


    // -------------------------------
    // DEAD
    // -------------------------------

    if(playerDead){

        return;

    }


    // -------------------------------
    // DASH
    // -------------------------------

    if(isDashing){

        dashTimer -= delta;

        player.position.x += dashDirectionX * DASH_SPEED * delta;
        player.position.z += dashDirectionZ * DASH_SPEED * delta;

        if(dashTimer <= 0){

            isDashing = false;

        }

        updateCamera();

        return;

    }


    // -------------------------------
    // DODGE
    // -------------------------------

    if(isDodging){

        dodgeTimer -= delta;

        player.position.x += dodgeDirectionX * DODGE_SPEED * delta;
        player.position.z += dodgeDirectionZ * DODGE_SPEED * delta;

        if(dodgeTimer <= 0){

            isDodging = false;

        }

        updateCamera();

        return;

    }


    // -------------------------------
    // MOVEMENT INPUT
    // -------------------------------

    let inputX = 0;
    let inputZ = 0;


    if(keys["KeyW"]){
        inputZ -= 1;
    }

    if(keys["KeyS"]){
        inputZ += 1;
    }

    if(keys["KeyA"]){
        inputX -= 1;
    }

    if(keys["KeyD"]){
        inputX += 1;
    }


    // Normalize diagonal movement

    const length = Math.sqrt(
        inputX * inputX +
        inputZ * inputZ
    );

    if(length > 0){

        inputX /= length;
        inputZ /= length;

    }


    // -------------------------------
    // SPEED
    // -------------------------------

    let targetSpeed = WALK_SPEED;

    if(keys["ShiftLeft"] || keys["ShiftRight"]){

        targetSpeed = SPRINT_SPEED;

    }


    const targetVelocityX =
        inputX * targetSpeed;

    const targetVelocityZ =
        inputZ * targetSpeed;


    // -------------------------------
    // ACCELERATION
    // -------------------------------

    if(inputX !== 0){

        velocityX = moveTowards(
            velocityX,
            targetVelocityX,
            ACCELERATION * delta
        );

    }
    else{

        velocityX = moveTowards(
            velocityX,
            0,
            DECELERATION * delta
        );

    }


    if(inputZ !== 0){

        velocityZ = moveTowards(
            velocityZ,
            targetVelocityZ,
            ACCELERATION * delta
        );

    }
    else{

        velocityZ = moveTowards(
            velocityZ,
            0,
            DECELERATION * delta
        );

    }


    // -------------------------------
    // APPLY MOVEMENT
    // -------------------------------

    player.position.x += velocityX * delta;
    player.position.z += velocityZ * delta;


    // -------------------------------
    // GRAVITY
    // -------------------------------

    verticalVelocity += GRAVITY * delta;

    player.position.y += verticalVelocity * delta;


    // -------------------------------
    // GROUND
    // -------------------------------

    if(player.position.y <= 1){

        player.position.y = 1;

        verticalVelocity = 0;

        isGrounded = true;

        jumpCount = 0;

    }
    else{

        isGrounded = false;

    }


    // -------------------------------
    // CAMERA
    // -------------------------------

    updateCamera();

}


// ===============================
// JUMP
// ===============================

function jump(){

    if(playerDead) return;

    if(jumpCount < MAX_JUMPS){

        verticalVelocity = JUMP_FORCE;

        jumpCount++;

        isGrounded = false;

    }

}


// ===============================
// DASH
// ===============================

function startDash(){

    if(playerDead) return;

    if(isDashing) return;

    if(dashCooldownTimer > 0) return;


    let directionX = 0;
    let directionZ = 0;


    if(keys["KeyW"]) directionZ -= 1;
    if(keys["KeyS"]) directionZ += 1;
    if(keys["KeyA"]) directionX -= 1;
    if(keys["KeyD"]) directionX += 1;


    // No movement input = forward dash

    if(directionX === 0 && directionZ === 0){

        directionZ = -1;

    }


    const length = Math.sqrt(
        directionX * directionX +
        directionZ * directionZ
    );


    directionX /= length;
    directionZ /= length;


    dashDirectionX = directionX;
    dashDirectionZ = directionZ;

    isDashing = true;

    dashTimer = DASH_DURATION;

    dashCooldownTimer = DASH_COOLDOWN;

}


// ===============================
// DODGE
// ===============================

function startDodge(){

    if(playerDead) return;

    if(isDodging) return;

    if(dodgeCooldownTimer > 0) return;


    let directionX = 0;
    let directionZ = 0;


    if(keys["KeyW"]) directionZ -= 1;
    if(keys["KeyS"]) directionZ += 1;
    if(keys["KeyA"]) directionX -= 1;
    if(keys["KeyD"]) directionX += 1;


    if(directionX === 0 && directionZ === 0){

        directionZ = -1;

    }


    const length = Math.sqrt(
        directionX * directionX +
        directionZ * directionZ
    );


    directionX /= length;
    directionZ /= length;


    dodgeDirectionX = directionX;
    dodgeDirectionZ = directionZ;

    isDodging = true;

    dodgeTimer = DODGE_DURATION;

    dodgeCooldownTimer = DODGE_COOLDOWN;

}


// ===============================
// PLAYER DAMAGE
// ===============================

function damagePlayer(damage){

    if(playerDead) return;

    if(playerInvulnerable) return;

    // Dodging gives temporary protection
    if(isDodging || isDashing){

        return;

    }


    playerHealth -= damage;

    if(playerHealth < 0){

        playerHealth = 0;

    }


    // Invulnerability frames

    playerInvulnerable = true;

    playerInvulnerabilityTimer = 0.6;


    // Damage flash

    player.material.emissive.setHex(
        0x550000
    );


    // Knockback

    if(player){

        player.position.z += 0.4;

    }


    // Update HUD

    if(typeof updateHUD === "function"){

        updateHUD();

    }


    // Death

    if(playerHealth <= 0){

        playerDeath();

    }

}


// ===============================
// PLAYER DEATH
// ===============================

function playerDeath(){

    playerDead = true;

    velocityX = 0;
    velocityZ = 0;

    player.material.emissive.setHex(
        0x220000
    );


    if(typeof showGameOver === "function"){

        showGameOver();

    }

}


// ===============================
// RESET PLAYER
// ===============================

function resetPlayer(){

    playerHealth = playerMaxHealth;

    playerDead = false;

    playerInvulnerable = false;

    playerInvulnerabilityTimer = 0;

    player.position.set(
        0,
        1,
        8
    );

    player.material.emissive.setHex(
        0x000000
    );

    updateHUD();

}


// ===============================
// CAMERA
// ===============================

function updateCamera(){

    if(!player) return;


    const targetX =
        player.position.x;

    const targetY =
        player.position.y + 5;

    const targetZ =
        player.position.z + 12;


    camera.position.x +=
        (targetX - camera.position.x) *
        5 *
        0.016;


    camera.position.y +=
        (targetY - camera.position.y) *
        5 *
        0.016;


    camera.position.z +=
        (targetZ - camera.position.z) *
        5 *
        0.016;


    camera.lookAt(
        player.position.x,
        player.position.y + 1,
        player.position.z
    );

}


// ===============================
// UTILITY
// ===============================

function moveTowards(current, target, maxDelta){

    if(Math.abs(target - current) <= maxDelta){

        return target;

    }

    return current +
        Math.sign(target - current) *
        maxDelta;

}
