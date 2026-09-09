// ===============================
// UI SYSTEM
// ===============================


// ===============================
// CREATE HUD
// ===============================

function createHUD(){

    const hud =
        document.createElement(
            "div"
        );

    hud.id =
        "gameHUD";


    hud.innerHTML = `

        <div class="hud-top">

            <div class="player-health">

                <div class="hud-title">
                    VITALITY
                </div>

                <div class="health-background">

                    <div
                        id="healthBar"
                        class="health-fill"
                    ></div>

                </div>

                <div
                    id="healthText"
                    class="health-text"
                >
                    100 / 100
                </div>

            </div>


            <div
                id="enemyCounter"
                class="enemy-counter"
            >
                ENEMIES: 0
            </div>

        </div>


        <div class="combat-info">

            <div
                id="comboText"
                class="combo-text"
            >
                0 HITS
            </div>

            <div
                id="styleRank"
                class="style-rank"
            >
                D
            </div>

            <div class="style-label">
                STYLE
            </div>

        </div>

    `;


    document.body.appendChild(
        hud
    );


    // Game over
    createGameOver();


    updateHUD();

}


// ===============================
// GAME OVER
// ===============================

function createGameOver(){

    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "gameOver";


    overlay.innerHTML = `

        <div class="game-over-box">

            <h1>YOU DIED</h1>

            <p>
                Your style ends here.
            </p>

            <button
                onclick="restartGame()"
            >
                RESTART
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ===============================
// UPDATE HUD
// ===============================

function updateHUD(){

    if(!player) return;


    // =========================
    // HEALTH
    // =========================

    const healthPercent =
        Math.max(
            0,
            playerHealth /
            playerMaxHealth *
            100
        );


    const healthBar =
        document.getElementById(
            "healthBar"
        );


    const healthText =
        document.getElementById(
            "healthText"
        );


    if(healthBar){

        healthBar.style.width =
            healthPercent + "%";

    }


    if(healthText){

        healthText.textContent =
            Math.ceil(playerHealth) +
            " / " +
            playerMaxHealth;

    }


    // =========================
    // ENEMY COUNTER
    // =========================

    const enemyCounter =
        document.getElementById(
            "enemyCounter"
        );


    if(enemyCounter){

        enemyCounter.textContent =
            "ENEMIES: " +
            enemies.length;

    }


    // =========================
    // COMBO
    // =========================

    const combo =
        getCombo();


    const comboText =
        document.getElementById(
            "comboText"
        );


    if(comboText){

        comboText.textContent =
            combo +
            " HITS";

    }


    // =========================
    // STYLE RANK
    // =========================

    let rank = "D";


    if(combo >= 25){

        rank = "SS";

    }
    else if(combo >= 15){

        rank = "S";

    }
    else if(combo >= 10){

        rank = "A";

    }
    else if(combo >= 6){

        rank = "B";

    }
    else if(combo >= 3){

        rank = "C";

    }


    const styleRank =
        document.getElementById(
            "styleRank"
        );


    if(styleRank){

        styleRank.textContent =
            rank;

    }


    // =========================
    // ENEMY HP BARS
    // =========================

    updateEnemyHealthBars();

}


// ===============================
// CREATE ENEMY HP BAR
// ===============================

function createEnemyHealthBar(enemy){

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "enemy-health-container";


    container.innerHTML = `

        <div class="enemy-health-bg">

            <div
                class="enemy-health-fill"
            ></div>

        </div>

    `;


    document.body.appendChild(
        container
    );


    enemy.healthBar =
        container;

}


// ===============================
// UPDATE ENEMY HP BARS
// ===============================

function updateEnemyHealthBars(){

    if(!camera) return;


    for(
        let i = 0;
        i < enemies.length;
        i++
    ){

        const enemy =
            enemies[i];


        if(
            !enemy ||
            !enemy.healthBar
        ){

            continue;

        }


        const position =
            enemy.position.clone();


        position.y += 1.7;


        position.project(
            camera
        );


        const x =
            (
                position.x *
                0.5 +
                0.5
            ) *
            window.innerWidth;


        const y =
            (
                -position.y *
                0.5 +
                0.5
            ) *
            window.innerHeight;


        enemy.healthBar.style.left =
            x + "px";


        enemy.healthBar.style.top =
            y + "px";


        const healthFill =
            enemy.healthBar.querySelector(
                ".enemy-health-fill"
            );


        const percent =
            Math.max(
                0,
                enemy.health /
                enemy.maxHealth *
                100
            );


        healthFill.style.width =
            percent + "%";


        // Hide if behind camera
        enemy.healthBar.style.display =
            position.z > 1
                ? "none"
                : "block";

    }

}


// ===============================
// REMOVE ENEMY HP BAR
// ===============================

function removeEnemyHealthBar(enemy){

    if(
        enemy &&
        enemy.healthBar
    ){

        enemy.healthBar.remove();

        enemy.healthBar =
            null;

    }

}


// ===============================
// GAME OVER
// ===============================

function showGameOver(){

    const overlay =
        document.getElementById(
            "gameOver"
        );


    if(overlay){

        overlay.classList.add(
            "active"
        );

    }

}


// ===============================
// RESTART
// ===============================

function restartGame(){

    location.reload();

}
