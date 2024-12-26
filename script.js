// Author Mahmoud Attia
// Get menu and play button elements
let menu = document.getElementById("menu");
let playButton = document.getElementById("playButton");

// Game variables
let killerContainer;
let killerLeft = 0;
let killerBottom = 0;
let murdersArray = [];
let murdersRemaining = 0;
// Hide the menu and start the game on Play button click
playButton.addEventListener("click", function () {
    menu.style.display = "none"; // Hide menu
    startGame(); // Initialize game logic
    murders(); // Populate murder images
    document.getElementById(`gameAudio`).play(); // Play game audio
    let audioLevel = document.getElementById(`gameAudio`);
    audioLevel.volume = 0.4;
    
});

// Game logic
function startGame() {
    killerContainer = document.querySelector('.killer-container');

    if (!killerContainer) {
        console.error("killerContainer not found in DOM.");
        return;
    }

    // Initialize positions
    killerLeft = killerContainer.offsetLeft || 0;
    killerBottom = parseInt(window.getComputedStyle(killerContainer).bottom, 10) || 0;

    console.log('Game started. Initial positions:', { killerLeft, killerBottom });

    document.addEventListener(`keydown`, function (e) {
        // Get window dimensions
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        // Get killerContainer dimensions
        let killerWidth = killerContainer.offsetWidth;
        let killerHeight = killerContainer.offsetHeight;

        if (e.code === `ArrowRight`) {
            if (killerLeft + killerWidth < windowWidth) {
                killerLeft += 50;
                killerContainer.style.left = killerLeft + "px";
            }
        } else if (e.code === `ArrowLeft`) {
            if (killerLeft > 0) {
                killerLeft -= 60;
                killerContainer.style.left = killerLeft + "px";
            }
        } else if (e.code === `ArrowUp`) {
            if (killerBottom + killerHeight < windowHeight) {
                killerBottom += 60;
                killerContainer.style.bottom = killerBottom + "px";
            }
        } else if (e.code === `ArrowDown`) {
            if (killerBottom > 0) {
                killerBottom -= 60;
                killerContainer.style.bottom = killerBottom + "px";
            }
        } else if (e.code === `Space`) {
            fireBullet();
        }
    });
}

function setupMurders() {
    let murderContainer = document.getElementById("murder");
    murdersArray = [];
    murdersRemaining = 10; // Total number of murders

    for (let i = 0; i < murdersRemaining; i++) {
        let murder = document.createElement("div");
        murder.classList.add("murder");
        murder.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Random horizontal position
        murder.style.top = `${Math.random() * (window.innerHeight / 2)}px`; // Random vertical position
        murderContainer.appendChild(murder);

        murdersArray.push(murder);
    }
}

function fireBullet() {
    let bullet = document.createElement("div");
    bullet.classList.add("bullet");
    document.body.appendChild(bullet);

    bullet.style.left = killerLeft + 25 + "px";
    bullet.style.bottom = killerBottom + 50 + "px";

    let bulletBottom = killerBottom + 50;

    function animateBullet() {
        bulletBottom += 20;
        bullet.style.bottom = bulletBottom + "px";

        // Collision detection
        for (let i = murdersArray.length - 1; i >= 0; i--) {
            let murder = murdersArray[i];
            if (checkCollision(bullet, murder)) {
                bullet.remove();
                murder.remove();
                murdersArray.splice(i, 1);
                murdersRemaining--;

                if (murdersRemaining === 0) {
                    proceedToLevel2();
                }
                return; // Exit animation loop on collision
            }
        }

        if (bulletBottom > window.innerHeight) {
            bullet.remove();
        } else {
            requestAnimationFrame(animateBullet);
        }
    }

    requestAnimationFrame(animateBullet);
    document.getElementById("bulletAudio").play();
    let bulletLevel =  document.getElementById("bulletAudio");
    bulletLevel.volume = 0.4;
}

function checkCollision(bullet, murder) {
    let bulletRect = bullet.getBoundingClientRect();
    let murderRect = murder.getBoundingClientRect();

    return !(
        bulletRect.top > murderRect.bottom ||
        bulletRect.bottom < murderRect.top ||
        bulletRect.left > murderRect.right ||
        bulletRect.right < murderRect.left
    );
}

function proceedToLevel2() {
    alert("Level 2!"); // Replace with a proper level transition
    setupMurders(); // Reset murders for level 2
}
function murders() {
    let murder = document.getElementById(`murder`);
    let cartona = ``;

    for (let i = 0; i < 60; i++) {
        cartona += `<img src="Murder1.png" alt="Murder">`; // Add alt for accessibility
    }
    murder.innerHTML = cartona;
}
