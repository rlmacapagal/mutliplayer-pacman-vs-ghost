//require("./MovingDirection.js");
import MovingDirection from 'src/MovingDirection.js';

 export default class Pacman
{
    constructor(x, y, tileSize, velocity, tileMap)
    {
        this.x = x; //coordinates ni pac
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap; // so that pacman is aware of the map

        this.currentMovingDirection = null;
        this.requestedMovingDirection = null;

        this.pacmanAnimationTimerDefault = 10;
        this.pacmanAnimationTimer = null;

        document.addEventListener("keydown", this.keydown)

        this.pacmanRotation = this.Rotation.right;
        this.wakaSound = new Audio('../sounds/waka.wav');

        this.powerDotSound = new Audio("../sounds/power_Dot.wav");
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
        this.timers = [];

        this.eatGhostSound = new Audio("../sounds/eat_ghost.wav");

        this.loadPacmanImages();
    }

    Rotation = { right:0, down:1, left:2, up:3 };

    keydown = (event) =>
    {   //up
        if(event.keyCode == 38)
        {
            if(this.currentMovingDirection == MovingDirection.down)
                this.currentMovingDirection = MovingDirection.up;
            this.requestedMovingDirection = MovingDirection.up;
        }
        //down
        if(event.keyCode == 40)
        {
            if(this.currentMovingDirection == MovingDirection.up)
                this.currentMovingDirection = MovingDirection.down;
            this.requestedMovingDirection = MovingDirection.down;
        }
        //left
        if(event.keyCode == 37)
        {
            if(this.currentMovingDirection == MovingDirection.right)
                this.currentMovingDirection = MovingDirection.left;
            this.requestedMovingDirection = MovingDirection.left;
        }
        //right
        if(event.keyCode == 39)
        {
            if(this.currentMovingDirection == MovingDirection.left)
                this.currentMovingDirection = MovingDirection.right;
            this.requestedMovingDirection = MovingDirection.right;
        }
    };

    draw(ctx, enemies)
    {
        this.move(); // for moving pacman
        this.animate();
        this.eatDot();
        this.eatPowerDot();
        this.eatGhost(enemies);

        const size = this.tileSize / 2;

        ctx.save();
        ctx.translate(this.x + size, this.y + size);
        ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
        ctx.drawImage(
          this.pacmanImages[this.pacmanImageIndex],
          -size,
          -size,
          this.tileSize,
          this.tileSize
        );

        ctx.restore();

        //ctx.drawImage(this.pacmanImages[this.pacmanImageIndex], this.x, this.y, this.tileSize, this.tileSize);
    }

    loadPacmanImages()
    {
        const pacmanImage1 = new Image();
        pacmanImage1.src = "../images/pac0.png";

        const pacmanImage2 = new Image();
        pacmanImage2.src = "../images/pac1.png";

        const pacmanImage3= new Image();
        pacmanImage3.src = "../images/pac2.png";

        const pacmanImage4= new Image();
        pacmanImage4.src = "../images/pac1.png";

        this.pacmanImages = [pacmanImage1, pacmanImage2, pacmanImage3, pacmanImage4];

        this.pacmanImageIndex = 0;
    }

    move()
    {
        if(this.currentMovingDirection !== this.requestedMovingDirection)//useful during start
        {
            if(Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) // check pacman current position is an integer
            {
                if(!this.tileMap.didCollide(this.x, this.y, this.requestedMovingDirection)) //if hindi bumangga
                this.currentMovingDirection = this.requestedMovingDirection; // current direction pede maging requested
            }
        }

        if(this.tileMap.didCollide(this.x, this.y, this.currentMovingDirection))// check kung bumangga
        {
            this.pacmanAnimationTimer = null;
            this.pacmanImageIndex = 1;// pag bumangga sara bibig
            return;// pag bumangga, exit na
        }

        else if(this.currentMovingDirection != null && this.pacmanAnimationTimer == null) // if pacman is moving at maganimate pa lang
        {
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
        }

        switch(this.currentMovingDirection)
        {
            case MovingDirection.up:
                 this.y -= this.velocity;
                 this.pacmanRotation = this.Rotation.up;

            break;

            case MovingDirection.down: 
                    this.y += this.velocity;
                    this.pacmanRotation = this.Rotation.down;
            break;

            case MovingDirection.left:
                 this.x -= this.velocity;
                 this.pacmanRotation = this.Rotation.left;
            break;

            case MovingDirection.right: 
                this.x += this.velocity;
                this.pacmanRotation = this.Rotation.right;
            break;



        }
    }

    animate()
    {
        if(this.pacmanAnimationTimer == null)
        {
            return;
        }
        this.pacmanAnimationTimer--;
        if(this.pacmanAnimationTimer == 0)
        {
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
            this.pacmanImageIndex++;
            if(this.pacmanImageIndex == this.pacmanImages.length)
                this.pacmanImageIndex = 0;
        }
            
    }

    eatDot()
    {
        if(this.tileMap.eatDot(this.x, this.y))
        {
            this.wakaSound.play();
        }

    }

    eatPowerDot()
    {
        if(this.tileMap.eatPowerDot(this.x, this.y))// pag nakakain ng powerdot tugtug
        {
           this.powerDotSound.play();    
           this.powerDotActive = true;
           this.powerDotAboutToExpire = false;
           this.timers.forEach((timer) => clearTimeout(timer)); //clear timers
           this.timers = [];
           
           let powerDotTimer = setTimeout(() =>
            {
                this.powerDotActive = false;
                this.powerDotAboutToExpire = false;

            } , 1000 * 6);// 6 seconds

            this.timers.push(powerDotTimer);

            let powerDotAboutToExpireTimer = setTimeout(() =>
            {
               
                this.powerDotAboutToExpire = true;

            } , 1000 * 3);// 3 seconds

            this.timers.push(powerDotAboutToExpireTimer);



        }
    }

    eatGhost(enemies)
    {
        if(this.powerDotActive)
        {
            const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
            collideEnemies.forEach((enemy) => 
            {    
                enemies.splice(enemies.indexOf(enemy), 1);// tanggal ung enemy na tinitignan ni foreach 
                this.eatGhostSound.play();
            });
        }
    }



}
