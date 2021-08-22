(function() {
    const edd = document.getElementById('fileEdd');
    const rock1 = document.getElementById('rock1');
    const obstacle1 = document.getElementById('obstacle1');
    const filed = document.getElementById('filed');
    const scoreElem = document.getElementById('score');
    const thankYou = document.getElementById('thankYou');

    const JUMP_TIME_MS = 300;
    const UPDATE_TIME_MS = 10;

    let _updateInterval;
    let _updatePointsInterval;
    let score = 0;

    let rock1Moving = false;
    let obstacle1Moving = false;
    let filedMoving = false;

    function start() {
        _updateInterval = setInterval(() => {
            update();
        }, UPDATE_TIME_MS);
        score = 0;
        startScoreCounter();
    }
    
    async function update() {
        
        if(detectCollision(rock1) || detectCollision(obstacle1)) {
            gameOver();
        }

        if(detectCollision(filed)) {
            alert('filed!');
        }
        
        
        if(!rock1Moving) {
            rock1Moving = true;
            moveObject(rock1);
        } else {
            checkMovingElements(rock1);
        }
        if(!obstacle1Moving) {
            obstacle1Moving = true;
            const random = getRandomNumber(15, 18);
            await sleep(random * 100);
            moveObject(obstacle1);
        } else {
            checkMovingElements(obstacle1);
        }
        if(!filedMoving) {
            
            filedMoving = true;
            const random2 = getRandomNumber(33, 39);
            await sleep(random2 * 100);
            moveObject(filed);
        } else {
            checkMovingElements(filed);
        }
    }

    function detectCollision(obstacle) {
        const eddPosition = {
            x: parseInt(window.getComputedStyle(edd).getPropertyValue('left')),
            y: parseInt(window.getComputedStyle(edd).getPropertyValue('top')),
            width: parseInt(window.getComputedStyle(edd).getPropertyValue('width')),
            height: parseInt(window.getComputedStyle(edd).getPropertyValue('height')),
        };
        const obstaclePosition = {
            x: parseInt(window.getComputedStyle(obstacle).getPropertyValue('left')),
            y: parseInt(window.getComputedStyle(obstacle).getPropertyValue('top')),
            width: parseInt(window.getComputedStyle(obstacle).getPropertyValue('width')),
        };
        const eddStartPositionY = parseInt(getComputedStyle(document.documentElement)
                                .getPropertyValue('--edd-start-position-y'));
        const jumpDistance = parseInt(getComputedStyle(document.documentElement)
                                .getPropertyValue('--jump-distance-half'));

        // Although following comparission could be used, it will look like it is buggy because it doesn´t render fast enough.
        if(obstaclePosition.x > eddPosition.x && obstaclePosition.x < (eddPosition.x + eddPosition.width) && eddPosition.y > (eddStartPositionY - jumpDistance - 10)) {
        // So I had to make up numbers
        // if(obstaclePosition.x > eddPosition.x && obstaclePosition.x < (eddPosition.x +10) && eddPosition.y > (eddStartPositionY - jumpDistance - 10)) {
            return true;
        }
        return false;
    }

    function gameOver() {
        if(_updatePointsInterval) {
            clearInterval(_updatePointsInterval);
        }
        if(_updateInterval) {
            clearInterval(_updateInterval);
        }

        const restart = prompt('Game over! Your score was', score);
        start();
        console.log('Game over')
    }

    function startScoreCounter() {
        _updatePointsInterval = setInterval(() => {
            score += 50;
        }, 1000);
    }

    function checkMovingElements(gameObject) {
        if(gameObject.classList.contains('gameObjectMoving')) {
            
            const obstaclePosition = {
                x: parseInt(window.getComputedStyle(gameObject).getPropertyValue('left')),
                width: parseInt(window.getComputedStyle(gameObject).getPropertyValue('width')),
            };
            if(obstaclePosition.x + obstaclePosition.width < -50) {
                gameObject.classList.remove('gameObjectMoving');
                switch (gameObject.id) {
                    case 'rock1':
                        rock1Moving = false;
                        break;
                    case 'obstacle1':
                        obstacle1Moving = false;
                        break;
                    case 'filed':
                        filedMoving = false;
                        break;
                    default:
                        break;
                }
            }
            return;
        }
    }

    function moveObject(gameObject) {
        
        // document.documentElement.style
        //     .setProperty('--rock1-start-position-x', (getRandomNumber(580, 680)) + 'px');

        // document.documentElement.style
        //     .setProperty('--obstacle1-start-position-x', (getRandomNumber(580, 680)) + 'px');
            
        let movementSpeed = getComputedStyle(document.documentElement)
                .getPropertyValue('--movement-time');
        movementSpeed = movementSpeed.replace('s', '');
        
        gameObject.classList.add('gameObjectMoving');
    }

    function sleep(time) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), time);
        });
    }

    function jump() {
        if(!edd.classList.contains('jump')) {
            edd.classList.add('jump');
            setTimeout(() => {
                edd.classList.remove('jump');
            }, JUMP_TIME_MS);
        }
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    document.addEventListener('keydown', (e) => {
        if(e.key === ' ' || e.key === 'ArrowUp') {
            jump();
        }
    });

    start();
    
})();
