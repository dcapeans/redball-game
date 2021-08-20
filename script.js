const screenWidth = window.innerWidth ;
const screenHeight = window.innerHeight;

const canvas = document.querySelector("#canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
const context = canvas.getContext("2d");
const scoreContainer = document.querySelector('#score');

let intervalId;
let scoreIntervalId;
let gameOver = false;

let player = {
    x: screenWidth / 2,
    y: screenHeight / 2,
    radius: 70,
    color: "red",
};

let score = 0;
let friends = [];
let enemies = [];

let enemy = {
    x: 0,
    y: 0,
    radius: 30,
    color: "blue",
    speedX: 10,
    speedY: 10,
};

function drawScore() {
    scoreContainer.textContent = `${score}`;
}

function randomizer(){
    const probability = Math.random()
    const randomAxis = Math.random()

    if(randomAxis > 0.5){
        const randomX = randomAxis * screenWidth;
        if(probability > 0.5){
            return {
                positionX: randomX,
                positionY: 10,
                directionX: 1,
                directionY: 1
            }
        } else {
            return {
                positionX: randomX,
                positionY: screenHeight,
                directionX: -1,
                directionY: -1
            }
        }
    } else {
        const randomY = randomAxis * screenHeight;
        if(probability > 0.5){
            return {
                positionX: 10,
                positionY: randomY,
                directionX: -1,
                directionY: 1
            }
        } else {
            return {
                positionX: screenWidth,
                positionY: randomY,
                directionX: 1,
                directionY: -1
            }
        }
    }

    
}

function onMouseMove(event) {
    player.x = event.clientX;
    player.y = event.clientY;
}

function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}

function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    drawCircle(player.x, player.y, player.radius, player.color);
}

function drawEnemy() {
    enemies.forEach(enemy => {
        drawCircle(enemy.x, enemy.y, enemy.radius, enemy.color);
    })
}

function drawFriend() {
    friends.forEach(friend => {
        drawCircle(friend.x, friend.y, friend.radius, friend.color);
    })
}

function createNewEnemy() {
    const random = randomizer()
    const enemy = {
        x: random.positionX,
        y: random.positionY,
        radius: 30,
        color: "blue",
        speedX: 5 * random.directionX,
        speedY: 5 * random.directionY
    };

    enemies.push(enemy);
    return enemy;
}

function createNewFriend() {
    const random = randomizer()
    const friend = {
        x: random.positionX,
        y: random.positionY,
        radius: 30,
        color: "green",
        speedX: 4 * random.directionX,
        speedY: 4 * random.directionY
    };

    friends.push(friend);
    return friend;
}

function randomizeEnemyCreation(){
    if(Math.random() > 0.995) createNewEnemy();
}

function randomizeFriendCreation(){
    if(Math.random() > 0.995) createNewFriend();
}

function moveEnemy() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
    })
}

function moveFriend() {
    friends.forEach(friend => {
        friend.x += friend.speedX;
        friend.y += friend.speedY;
    })
}

function checkEnemyCollision() {
    let hasCollided = false
    enemies.forEach(enemy => {
        const distance = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);
        
        if(distance < player.radius + enemy.radius) hasCollided = true
    })
    return hasCollided
}

function checkFriendCollision() {
    friends.forEach(friend => {
        const distance = Math.sqrt((player.x - friend.x) ** 2 + (player.y - friend.y) ** 2);
        
        if(distance < player.radius + friend.radius) {
            score++
            friends = friends.filter(rescued => friend !== rescued)
        }
    })
}

function bounceEnemyOnEdge() {
    enemies.forEach(enemy => {
        if (enemy.x < 0 || enemy.x > screenWidth) {
            enemy.speedX *= -1;
        }
        
        if (enemy.y < 0 || enemy.y > screenHeight) {
            enemy.speedY *= -1;
        }
    })
}

function checkFriendExitScreen() {
    friends.forEach(friend => {
        if (friend.x < 0 || friend.x > screenWidth || friend.y < 0 || friend.y > screenHeight) {
            friends = friends.filter(rescued => friend !== rescued)
        }
    })
}

function increaseEnemySpeed() {
    enemy.speedX *= 1.001;
    enemy.speedY *= 1.001;
}

function endGame() {
    alert("Game Over! You scored " + score + " points!");
    clearInterval(intervalId);
    clearInterval(scoreIntervalId);
    gameOver = true
}

function startGame() {
    player.x = screenWidth / 2;
    player.y = screenHeight / 2;

    createNewEnemy()

    clearInterval(intervalId);
    clearInterval(scoreIntervalId);
    intervalId = setInterval(gameLoop, 1000 / 60);
    scoreIntervalId = setInterval(() => score++, 1000)
    console.log(friends)
    console.log(enemies)
}

function restart(){

}

function gameLoop() {
    clearScreen();
    moveEnemy();
    moveFriend();
    randomizeEnemyCreation();
    randomizeFriendCreation();

    if (checkEnemyCollision()) {
    endGame();
    }
    checkFriendCollision();

    bounceEnemyOnEdge();
    increaseEnemySpeed();

    drawScore();
    drawPlayer();
    drawEnemy();
    drawFriend();
}

startGame();