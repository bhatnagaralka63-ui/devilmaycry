// =====================================
// PLAYER CONTROLLER
// =====================================

let player;

// =====================================
// SETTINGS
// =====================================

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


// =====================================
// INPUT
// =====================================

const keys = {};

window.addEventListener("keydown", (event) => {

    keys[event.code] = true;

    // Prevent browser scrolling
    if (
        event.code === "Space" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown"
    ) {
        event.preventDefault();
    }

});

window.addEventListener("keyup", (event) => {

    keys[event.code] = false;

});


// =====================================
// PLAYER VARIABLES
// =====================================

let velocityX = 0;
let velocityZ = 0;

let verticalVelocity = 0;

let isGrounded = true;

let jumpCount = 0;
const MAX_JUMPS = 2;


// =====================================
// DASH
// =====================================

let isDashing = false;
let dashTimer = 0;
let dashCooldown = 0;

let dashDirectionX = 0;
let dashDirectionZ = 0;


// =====================================
// DODGE
// =====================================

let isDodging = false;
let dodgeTimer = 0;
let dodgeCooldown = 0;

let dodgeDirectionX = 0;
let dodgeDirectionZ = 0;


// =====================================
// CREATE PLAYER
// =====================================

function createPlayer(){

    player = new THREE.Mesh(

        new THREE.BoxGeometry(
            1,
            2,
            1
        ),

        new THREE.MeshStandardMaterial({
            color: 0xff0000
        })

    );

    // Start standing on ground
    player.position.set(
        0,
        1,
        0
    );

    player.castShadow = true;

    scene.add(player);


    // Camera starting position
    camera.position.set(
        0,
        6,
        12
    );

    camera.lookAt(player.position);

}


// =====================================
// UPDATE PLAYER
// =====================================

function updatePlayer(delta){

    if(!player) return;


    // =================================
    // COOLDOWNS
    // =================================

    if(dashCooldown > 0){
        dashCooldown -= delta;
    }

    if(dodgeCooldown > 0){
        dodgeCooldown -= delta;
    }


    // =================================
    // DASH
    // =================================

    if(
        keys["KeyQ"] &&
        !isDashing &&
        !isDodging &&
        dashCooldown <= 0
    ){

        startDash();

        // Prevent holding Q from
        // repeatedly triggering dash
        keys["KeyQ"] = false;

    }


    // =================================
    // DODGE
    // =================================

    if(
        keys["ControlLeft"] &&
        !isDashing &&
        !isDodging &&
        dodgeCooldown <= 0
    ){

        startDodge();

        keys["ControlLeft"] = false;

    }


    // =================================
    // DASH MOVEMENT
    // =================================

    if(isDashing){

        player.position.x +=
            dashDirectionX *
            DASH_SPEED *
            delta;

        player.position.z +=
            dashDirectionZ *
            DASH_SPEED *
            delta;

        dashTimer -= delta;

        if(dashTimer <= 0){

            isDashing = false;

        }

    }


    // =================================
    // DODGE MOVEMENT
    // =================================

    else if(isDodging){

        player.position.x +=
            dodgeDirectionX *
            DODGE_SPEED *
            delta;

        player.position.z +=
            dodgeDirectionZ *
            DODGE_SPEED *
            delta;

        dodgeTimer -= delta;

        if(dodgeTimer <= 0){

            isDodging = false;

        }

    }


    // =================================
    // NORMAL MOVEMENT
    // =================================

    else{

        let inputX = 0;
        let inputZ = 0;


        // WASD

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


        // =================================
        // SPRINT
        // =================================

        let targetSpeed = WALK_SPEED;

        if(keys["ShiftLeft"] || keys["ShiftRight"]){

            targetSpeed = SPRINT_SPEED;

        }


        // Target velocity

        const targetVelocityX =
            inputX * targetSpeed;

        const targetVelocityZ =
            inputZ * targetSpeed;


        // =================================
        // SMOOTH ACCELERATION
        // =================================

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


        // =================================
        // APPLY MOVEMENT
        // =================================

        player.position.x +=
            velocityX * delta;

        player.position.z +=
            velocityZ * delta;


        // =================================
        // ROTATE PLAYER
        // =================================

        if(length > 0){

            const targetRotation =
                Math.atan2(
                    inputX,
                    inputZ
                );

            player.rotation.y =
                targetRotation;

        }

    }


    // =================================
    // JUMP
    // =================================

    if(keys["Space"]){

        jump();

        // Prevent holding space
        keys["Space"] = false;

    }


    // =================================
    // GRAVITY
    // =================================

    verticalVelocity +=
        GRAVITY * delta;

    player.position.y +=
        verticalVelocity * delta;


    // =================================
    // GROUND DETECTION
    // =================================

    if(player.position.y <= 1){

        player.position.y = 1;

        verticalVelocity = 0;

        isGrounded = true;

        jumpCount = 0;

    }
    else{

        isGrounded = false;

    }


    // =================================
    // CAMERA FOLLOW
    // =================================

    camera.position.x =
        player.position.x;

    camera.position.z =
        player.position.z + 12;

    camera.position.y = 6;

    camera.lookAt(
        player.position.x,
        player.position.y + 1,
        player.position.z
    );

}


// =====================================
// JUMP FUNCTION
// =====================================

function jump(){

    // First jump
    if(isGrounded){

        verticalVelocity = JUMP_FORCE;

        isGrounded = false;

        jumpCount = 1;

        return;

    }


    // Double jump
    if(jumpCount < MAX_JUMPS){

        verticalVelocity = JUMP_FORCE;

        jumpCount++;

    }

}


// =====================================
// START DASH
// =====================================

function startDash(){

    isDashing = true;

    dashTimer = DASH_DURATION;

    dashCooldown = DASH_COOLDOWN;


    // Use movement direction

    let directionX = 0;
    let directionZ = 0;


    if(keys["KeyW"]){
        directionZ -= 1;
    }

    if(keys["KeyS"]){
        directionZ += 1;
    }

    if(keys["KeyA"]){
        directionX -= 1;
    }

    if(keys["KeyD"]){
        directionX += 1;
    }


    // If no movement input,
    // dash forward

    if(directionX === 0 && directionZ === 0){

        directionZ = -1;

    }


    // Normalize

    const length = Math.sqrt(
        directionX * directionX +
        directionZ * directionZ
    );

    dashDirectionX =
        directionX / length;

    dashDirectionZ =
        directionZ / length;

}


// =====================================
// START DODGE
// =====================================

function startDodge(){

    isDodging = true;

    dodgeTimer = DODGE_DURATION;

    dodgeCooldown = DODGE_COOLDOWN;


    let directionX = 0;
    let directionZ = 0;


    if(keys["KeyW"]){
        directionZ -= 1;
    }

    if(keys["KeyS"]){
        directionZ += 1;
    }

    if(keys["KeyA"]){
        directionX -= 1;
    }

    if(keys["KeyD"]){
        directionX += 1;
    }


    // Default dodge forward

    if(directionX === 0 && directionZ === 0){

        directionZ = -1;

    }


    const length = Math.sqrt(
        directionX * directionX +
        directionZ * directionZ
    );


    dodgeDirectionX =
        directionX / length;

    dodgeDirectionZ =
        directionZ / length;

}


// =====================================
// SMOOTH MOVEMENT HELPER
// =====================================

function moveTowards(
    current,
    target,
    maxDelta
){

    if(
        Math.abs(target - current)
        <= maxDelta
    ){

        return target;

    }


    if(current < target){

        return current + maxDelta;

    }


    return current - maxDelta;

}
