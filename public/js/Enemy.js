export default class Enemy
{
    constructor(x, y, tileSize, velocity, tileMap)
    {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;

        this.loadImages();

        this.scaredAboutToExpireTimerDefault = 10;
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;


    }
    draw(ctx , pacman)
    {
        this.setImage(ctx, pacman);
        
    }

    collideWith(pacman)
    {
        const size = this.tileSize / 2; // pag nangalahati ng bangga
        if(this.x < pacman.x + size && this.x + size > pacman.x && this.y < pacman.y + size && this.y + size > pacman.y)//check tigkalahati ng pacman at kalaban
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    setImage(ctx, pacman)
    {
        if(pacman.powerDotActive)
        {
            this.setImageWhenPowerDotIsActive(pacman);
        }

        else
        {
            this.image = this.normalGhost;
        }
        ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
    }

    setImageWhenPowerDotIsActive(pacman)
    {
        if(pacman.powerDotAboutToExpire)
        {
            this.scaredAboutToExpireTimer--;
            if(this.scaredAboutToExpireTimer === 0)
            {
                this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
                if(this.image === this.scaredGhost)
                {
                    this.image = this.scaredGhost2;
                }
                else
                {
                    this.image = this.scaredGhost;
                }
            }
        }
        else
        {
            this.image = this.scaredGhost;
        }
    }



    loadImages()
    {
        this.normalGhost = new Image();
        this.normalGhost.src = '../images/ghost.png';

        this.scaredGhost = new Image();
        this.scaredGhost.src = '../images/scaredGhost.png';

        this.scaredGhost2 = new Image();
        this.scaredGhost2.src = '../images/scaredGhost2.png';

        this.image = this.normalGhost;
        


    }


}