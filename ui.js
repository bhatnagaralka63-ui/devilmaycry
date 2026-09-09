// ===============================
// CRIMSON STYLE HUD
// ===============================

let healthBar;
let healthText;
let comboText;
let styleText;
let enemyText;
let gameOverScreen;


// ===============================
// CREATE HUD
// ===============================

function createHUD(){

    // -------------------------------
    // HUD CONTAINER
    // -------------------------------

    const hud = document.createElement("div");

    hud.id = "gameHUD";


    hud.innerHTML = `

        <div class="hud-top">

            <div class="health-container">

                <div class="health-label">
                    VITALITY
                </div>

                <div class="health-bar-bg">

                    <div
                        id="healthBar"
                        class="health-bar">
                    </div>

                </div>

                <div
                    id="healthText"
                    class="health-text">
                    100 / 100
                </div>

            </div>


            <div class="enemy-counter">

                DEMONS:
                <span id="enemyText">4</span>

            </div>

        </div>


        <div class="combat-info">

            <div
                id="comboText"
                class="combo-text">
                COMBO 0
            </div>

            <div
                id="styleText"
                class="style-text">
                D
            </div>

        </div>

    `;


    document.body.appendChild(hud);


    healthBar =
        document.getElementById(
            "healthBar"
        );


    healthText =
        document.getElementById(
            "healthText"
        );


    comboText =
        document.getElementById(
            "comboText"
        );


    styleText =
        document.getElementById(
            "styleText"
        );


    enemyText =
        document.getElementById(
            "enemyText"
        );


    createGameOver();

    updateHUD();

}


// ===============================
// GAME OVER SCREEN
// ===============================

function createGameOver(){

    gameOverScreen =
        document.createElement("div");


    gameOverScreen.id =
        "gameOverScreen";


    gameOverScreen.innerHTML = `

        <div class="game-over-box">

            <div class="game-over-title">
                YOU DIED
            </div>

            <div class="game-over-subtitle">
                THE HUNT ENDS HERE
            </div>

            <button
                id="restartButton">
                RESTART
            </button>

        </div>

    `;


    document.body.appendChild(
        gameOverScreen
    );


    document
        .getElementById("restartButton")
        .addEventListener(
            "click",
            restartGame
        );

}


// ===============================
// UPDATE HUD
// ===============================

function updateHUD(){

    if(!healthBar) return;


    // -------------------------------
    // HEALTH
    // -------------------------------

    const healthPercent =
        (playerHealth / playerMaxHealth) *
        100;


    healthBar.style.width =
        healthPercent + "%";


    healthText.textContent =
        Math.ceil(playerHealth) +
        " / " +
        playerMaxHealth;


    // -------------------------------
    // COMBO
    // -------------------------------

    let combo = 0;

    if(typeof getCombo === "function"){

        combo = getCombo();

    }


    comboText.textContent =
        "COMBO " + combo;


    // -------------------------------
    // ENEMIES
    // -------------------------------

    enemyText.textContent =
        enemies.length;


    // -------------------------------
    // STYLE RANK
    // -------------------------------

    let rank = "D";


    if(combo >= 3){
        rank = "C";
    }

    if(combo >= 6){
        rank = "B";
    }

    if(combo >= 10){
        rank = "A";
    }

    if(combo >= 15){
        rank = "S";
    }

    if(combo >= 25){
        rank = "SS";
    }


    styleText.textContent =
        rank;

}


// ===============================
// GAME OVER
// ===============================

function showGameOver(){

    if(!gameOverScreen) return;


    gameOverScreen.classList.add(
        "visible"
    );

}


// ===============================
// RESTART
// ===============================

function restartGame(){

    location.reload();

}
