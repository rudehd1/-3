const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200; // 화면 너비
canvas.height = 300; // 화면 높이

const dinoImage = new Image();
dinoImage.src = 'dino.png';

const groundY = canvas.height - 50; // 공룡이 붙어 있어야 할 바닥 위치 (장애물과 맞춤)

let dino = {
    x: 100,
    y: groundY, // 공룡의 초기 Y 위치를 바닥에 맞춤
    width: 50, // 공룡 크기
    height: 50,
    isJumping: false,
    velocity: 0,
    jumpHeight: 15, // 점프 높이
    gravity: 0.8 // 중력
};

let obstacles = [];
let frame = 0;

function drawDino() {
    ctx.drawImage(dinoImage, dino.x, dino.y - dino.height, dino.width, dino.height);
    // 공룡의 충돌 히트박스 표시
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(dino.x, dino.y - dino.height, dino.width, dino.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);
        // 장애물의 충돌 히트박스 표시
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, groundY - obs.height, obs.width, obs.height);
    }
}

function updateObstacles() {
    if (frame % 60 === 0) {
        let height = Math.random() * 50 + 20; // 허들 높이를 20에서 70 사이로 무작위 설정
        let width = 30; // 장애물 너비
        obstacles.push({
            x: canvas.width,
            y: groundY - height,
            width: width,
            height: height
        });
    }
    obstacles = obstacles.filter(obs => obs.x > -30);
    for (let obs of obstacles) {
        obs.x -= 5; // 장애물 이동 속도 조정
    }
}

function detectCollision() {
    for (let obs of obstacles) {
        // 공룡과 장애물 간의 충돌 감지
        if (dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y - dino.height < groundY - obs.y + obs.height) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    
    if (dino.isJumping) {
        dino.velocity -= dino.gravity;
        dino.y -= dino.velocity;
        if (dino.y >= groundY) {
            dino.y = groundY;
            dino.isJumping = false;
            dino.velocity = 0;
        }
    } else {
        if (dino.y < groundY) {
            dino.y += dino.gravity;
        }
    }
    
    updateObstacles();
    
    if (detectCollision()) {
        alert('Game Over!');
        obstacles = [];
        dino.y = groundY; // 공룡을 바닥으로 되돌리기
        dino.isJumping = false;
        dino.velocity = 0;
    }
    
    drawDino();
    drawObstacles();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !dino.isJumping && dino.y >= groundY) {
        dino.isJumping = true;
        dino.velocity = dino.jumpHeight; // 점프 높이 조정
    }
});

dinoImage.onload = () => {
    gameLoop();
};
