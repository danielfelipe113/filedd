<template>
  <div id="gameBoard">
    <div id="score">
      Score: {{ score }}
    </div>
    <div id="thankYou" v-if="showThankYouMessage">
      Thank you!
    </div>
    <div id="fileEdd" ref="edd"></div>
    <div id="rock1" ref="rock1"></div>
    <div id="obstacle1" ref="obstacle1"></div>
    <div id="filed" ref="filed"></div>
</div>
</template>

<script>
export default {
  name: 'Game',
  data() {
    return {
      JUMP_TIME_MS: 300,
      UPDATE_TIME_MS: 10,

      updateInterval: null,
      updatePointsInterval: null,
      eddAnimationInterval: null,
      score: 0,

      rock1Moving: false,
      obstacle1Moving: false,
      filedMoving: false,
      gameEnded: false,
      showThankYouMessage: false
    }
  },
  mounted() {
    window.addEventListener('keydown', function (e) {
      if(e.key === ' ' || e.key === 'ArrowUp') {
        this.jump();
      }
    }.bind(this));
  
    this.start();
  },
  methods: {
    start() {
      this.eddAnimationInterval = setInterval(() => {
        this.$refs.edd.style.backgroundImage = 'url(' + require('../img/edd1.png') + ')';
        setTimeout(() => {
          this.$refs.edd.style.backgroundImage = 'url(' + require('../img/edd2.png') + ')';
        }, 400);
      }, 800);
      // return
      this.updateInterval = setInterval(() => {
        this.update();
      }, this.UPDATE_TIME_MS);
      this.score = 0;
      this.startScoreCounter();
    },
    async update() {
      if(
        this.detectCollision(this.$refs.rock1) 
        // ||
        // this.detectCollision(this.$refs.obstacle1)
      ) {
        this.gameOver();
      }

      if(this.detectCollision(this.$refs.filed)) {
        this.showThankYouMessage = true;
        this.score += 5;
        setTimeout(() => {
          this.showThankYouMessage = false;
        }, 1500);
      }
        
      if(!this.rock1Moving) {
          this.rock1Moving = true;
          const random = this.getRandomNumber(5, 25);
          await this.sleep(random * 100);
          this.moveObject(this.$refs.rock1);
      } else {
          this.checkMovingElements(this.$refs.rock1);
      }
      // if(!this.obstacle1Moving) {
      //     this.obstacle1Moving = true;
      //     const random = this.getRandomNumber(15, 18);
      //     await this.sleep(random * 100);
      //     this.moveObject(this.$refs.obstacle1);
      // } else {
      //     this.checkMovingElements(this.$refs.obstacle1);
      // }
      if(!this.filedMoving) {
          this.filedMoving = true;
          const random2 = this.getRandomNumber(33, 39);
          await this.sleep(random2 * 100);
          this.moveObject(this.$refs.filed);
      } else {
          this.checkMovingElements(this.$refs.filed);
      }
    },
    detectCollision(obstacle) {
      const eddPosition = {
        x: parseInt(window.getComputedStyle(this.$refs.edd).getPropertyValue('left')),
        y: parseInt(window.getComputedStyle(this.$refs.edd).getPropertyValue('top')),
        width: parseInt(window.getComputedStyle(this.$refs.edd).getPropertyValue('width')),
        height: parseInt(window.getComputedStyle(this.$refs.edd).getPropertyValue('height')),
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
    },
    gameOver() {
        if(this.updatePointsInterval) {
            clearInterval(this.updatePointsInterval);
        }
        if(this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if(this.eddAnimationInterval) {
          clearInterval(this.eddAnimationInterval);
        }
        const finalScore = Number(this.score);
        const gameOverInterval = setInterval(() => {
          this.$refs.filed.classList.remove('gameObjectMoving');
          this.$refs.rock1.classList.remove('gameObjectMoving');
          // this.$refs.obstacle1.classList.remove('gameObjectMoving');
          this.rock1Moving = false;
          this.filedMoving = false;
          this.obstacle1Moving = false;
          this.gameEnded = true;
          this.showThankYouMessage = false;
          this.score = 0;
        }, 500);

        const clearGameOverInterval = setTimeout(() => {
          clearInterval(gameOverInterval);
        }, 5000);
        
        this.$swal.fire({
          title: 'Game Over!',
          text: "Your score was " + finalScore,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Restart',
          allowOutsideClick: false,
          allowEscapeKey: false,
          // allowEnterKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.gameEnded = false;
            clearInterval(gameOverInterval);
            clearTimeout(clearGameOverInterval);
            this.start();
          }
        });
    },
    startScoreCounter() {
        this.updatePointsInterval = setInterval(() => {
            this.score += 50;
        }, 1000);
    },
    checkMovingElements(gameObject) {
        if(gameObject.classList.contains('gameObjectMoving')) {
            
            const obstaclePosition = {
                x: parseInt(window.getComputedStyle(gameObject).getPropertyValue('left')),
                width: parseInt(window.getComputedStyle(gameObject).getPropertyValue('width')),
            };
            if(obstaclePosition.x + obstaclePosition.width < -50) {
                gameObject.classList.remove('gameObjectMoving');
                switch (gameObject.id) {
                    case 'rock1':
                        this.rock1Moving = false;
                        break;
                    case 'obstacle1':
                        this.obstacle1Moving = false;
                        break;
                    case 'filed':
                        this.filedMoving = false;
                        break;
                    default:
                        break;
                }
            }
            return;
        }
    },
    moveObject(gameObject) {
        
        // document.documentElement.style
        //     .setProperty('--rock1-start-position-x', (getRandomNumber(580, 680)) + 'px');

        // document.documentElement.style
        //     .setProperty('--obstacle1-start-position-x', (getRandomNumber(580, 680)) + 'px');
            
        let movementSpeed = getComputedStyle(document.documentElement)
                .getPropertyValue('--movement-time');
        movementSpeed = movementSpeed.replace('s', '');
        
        gameObject.classList.add('gameObjectMoving');
    },
    sleep(time) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), time);
        });
    },
    jump() {
        if(!this.$refs.edd.classList.contains('jump')) {
            this.$refs.edd.classList.add('jump');
            setTimeout(() => {
                this.$refs.edd.classList.remove('jump');
            }, this.JUMP_TIME_MS);
        }
    },
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
