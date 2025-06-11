//CONSTANTS,#10
//#1
const levels = [tilemap`level0`, tilemap`level4`, tilemap`level5`]
//#9
const dash_length = 30
const fly_projectile_speed = 50
const fly_projectile_turnrate = 20
const camera_shake_amount = 3
const hero_velocity = 100
//GLOBALS
let levelNumber = 0
let enemiesleft: Sprite[] = []
let enemiesright: Sprite[] = []
let snail = sprites.create(assets.image`Helpful snail`, 0)
info.setLife(3)
//CLASSES,#11,#12,#13

namespace SpriteKind {
    export const Obstacle = SpriteKind.create()
    export const MrsEgan = SpriteKind.create()
    export const coin = SpriteKind.create()
    export const heart = SpriteKind.create()
}

class Hero extends sprites.ExtendableSprite {

    
    herohitPoints: number = 3
    hit(points: number): void {
        
        timer.throttle("action", 1000, function() {
           this.herohitPoints -= points  
           info.setLife(this.herohitPoints)
        })
       

        if (this.herohitPoints <= 0) {
            this.destroy(effects.confetti, 250)
            game.gameOver(false)
        }
}
    constructor(image: Image, kind: number) {
        super(image, kind)
        this.herohitPoints = 3
    }

}
class EnemySprite extends sprites.ExtendableSprite {

    hitPoints: number
    skin: number
    
    hit(points: number): void {
        this.hitPoints -= points

        if (this.hitPoints <= 0) {
            this.destroy(effects.confetti, 250)
        }
    }

    constructor(image: Image, kind: number) {
        super(image, kind)
        this.hitPoints = 2
    }


}
class MrsEganType extends sprites.ExtendableSprite {

    hitPoints: number

    hit(points: number): void {
        timer.throttle("action", 1000, function () {
        this.hitPoints -= points
        })
        if (this.hitPoints <= 0) {
            this.destroy(effects.confetti, 250)
            tiles.setTileAt(tiles.getTileLocation(14, 1), sprites.swamp.swampTile9)
        }
    }

    constructor(image: Image, kind: number) {
        super(image, kind)
        this.hitPoints = 5
    }


}

//FUNCTIONS
//#4,#7
function dash() {
    if (mySprite.vx < 0 || mySprite.vx > 0) {
        if (mySprite.vx < 0) {
            animation.runImageAnimation(mySprite, assets.animation`Dane walk dash`, 60, false)
            mySprite.setPosition(mySprite.x -= dash_length, mySprite.y)
            
        }
        if (mySprite.vx > 0) {
            mySprite.setPosition(mySprite.x += dash_length, mySprite.y)
            animation.runImageAnimation(mySprite, assets.animation`Dane walk dash right`, 60, false)
        }
        
    }
}
//#3,#14
function newCowboyLeft(x: number, y:number) {
    let enemySprite: EnemySprite =
        new EnemySprite(assets.image`Cowboy lizard`, SpriteKind.Enemy)
    enemySprite.hitPoints = 3
    tiles.placeOnTile(enemySprite, tiles.getTileLocation(x, y))
    enemiesleft.push(enemySprite)
}

function newCowboyRight(x: number, y: number) {
    let enemySprite: EnemySprite =
        new EnemySprite(assets.image`Cowboy lizard facing right`, SpriteKind.Enemy)
    enemySprite.hitPoints = 3
    tiles.placeOnTile(enemySprite, tiles.getTileLocation(x, y))
    enemiesright.push(enemySprite)
}

function accessory_items() {
    
    let ph = tiles.getTilesByType(sprites.dungeon.chestOpen)
for (let i = 0; i < ph.length; i++) {
    let coin = sprites.create(assets.image`coin`, SpriteKind.coin)
    coin.setPosition(ph[i].x, ph[i].y)

}
}

function newMrseagentrueform() {
    let bigbad: MrsEganType =
        new MrsEganType(assets.image`Mrs Egan True Form`, SpriteKind.MrsEgan)
        bigbad.hitPoints = 5
        bigbad.follow(mySprite, 50, 50)
        tiles.placeOnTile(bigbad, tiles.getTileLocation(11, 4))
        animation.runImageAnimation(bigbad, assets.animation`Mrs Egan Running Down`, 120, true)
        game.onUpdate(function() {
        
        })
       
}




//LEVEL CHANGE FUNCTION
//#5
function levelchange(levelnumber: number) {
//LEVEL 1
    if (levelnumber == 1) {
        accessory_items()
        mySprite.setPosition(80, 220)
        tiles.placeOnTile(snail, tiles.getTileLocation(3, 14))
        snail.sayText("Since when were the cowboys lizards??!!")

        let evilfly= sprites.create(assets.image`Evil Fly`, SpriteKind.Enemy)
        tiles.placeOnTile(evilfly, tiles.getTileLocation(8, 1))


        game.onUpdateInterval(500, function() {

            if (mySprite.tilemapLocation().x >= 110) {
                animation.runImageAnimation(evilfly, assets.animation`Evil fly flying right`, 150, false)
            } else {
                animation.runImageAnimation(evilfly, assets.animation`Evil fly flying left`, 150, false)
            }
            })

    
        let y = 4
        for (let i = 0; i < 3; i++) {
                newCowboyRight(1, y)
                y += 3
        }
        y = 4
        for (let i = 0; i < 3; i++) {
                newCowboyLeft(14, y)
                y += 3
        }
        
        game.onUpdateInterval(1000, function() {
            if (levelNumber == 1) {
            let random = randint(0, 2)

            let projectileleft= sprites.createProjectileFromSprite(assets.image`Lizard Bullet`, enemiesleft[random], -50, 0)
            animation.runImageAnimation(enemiesleft[random], assets.animation`Cowboy lizard shooting`, 100, false)

            let projectileright = sprites.createProjectileFromSprite(assets.image`Lizard Bullet`, enemiesright[random], 50, 0)
            animation.runImageAnimation(enemiesright[random], assets.animation`Cowboy lizard shooting right`, 100, false)

            console.log(levelnumber)

            let projectilefly = sprites.createProjectileFromSprite(assets.image`Evil Fly Projectile`, evilfly, 0, 50)
            projectilefly.follow(mySprite, fly_projectile_speed, fly_projectile_turnrate)
            }
        })
        
    
    
    }


//LEVEL 2
    //#6
    if (levelnumber == 2) {
        accessory_items()
        sprites.destroy(snail)
        tiles.placeOnTile(mySprite, tiles.getTileLocation(1, 14))
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        
        let enemy_smol = sprites.create(assets.image`Mrs Egan Pure Evil Final Monster`, SpriteKind.Enemy)
        tiles.placeOnTile(enemy_smol, tiles.getTileLocation(11, 4))

        scene.setBackgroundColor(15)


        game.onUpdate(function() {
            
        if (mySprite.tileKindAt(TileDirection.Top, sprites.dungeon.darkGroundCenter) || mySprite.tileKindAt(TileDirection.Right, sprites.dungeon.darkGroundCenter) || mySprite.tileKindAt(TileDirection.Left, sprites.dungeon.darkGroundCenter) || mySprite.tileKindAt(TileDirection.Bottom, sprites.dungeon.darkGroundCenter))
        {
          
            timer.after(500, function() {
                
            
            timer.throttle("spawn1", 99999999, function() {
            newMrseagentrueform()
            sprites.destroy(enemy_smol)
          })  
        })
        }
        })


    }
}






//EVENT HANDLERS

//LEVEL CHANGE TRIGGER
//#2
scene.onOverlapTile(SpriteKind.Player, sprites.swamp.swampTile9, function(sprite: Sprite, location: tiles.Location) {
    levelNumber += 1
    levelchange(levelNumber)
    
    tiles.setCurrentTilemap(levels[levelNumber])

   
    if (levelNumber == 3) {
        game.gameOver(true)
    }
})
//WALL SHAKE
scene.onHitWall(SpriteKind.Player, function(sprite: Sprite, location: tiles.Location) {
    
    tiles.setTileAt(location, assets.tile`Broken wall horizontal`)
    scene.cameraShake(camera_shake_amount, 250)
})
//HERO DAMADGED
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function(sprite: Sprite, otherSprite: Sprite) {
    mySprite.hit(1)
    levelNumber == 2
})
sprites.onOverlap(SpriteKind.MrsEgan, SpriteKind.Player, function(sprite: Sprite, otherSprite: Sprite) {
    mySprite.hit(1)
    levelNumber == 2
})
//HERO DAMADGED PROJECTILE
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Player, function(sprite: Sprite, otherSprite: Sprite) {
    sprites.destroy(sprite)
    mySprite.hit(1)
})
//HERO HITS TRAP
scene.onOverlapTile(SpriteKind.Player, assets.tile`trap`, function(sprite: Hero, location: tiles.Location) {
    let fuego = sprites.create(assets.image`fuego`, SpriteKind.Obstacle)
    animation.runImageAnimation(fuego, assets.animation`fire noises`, 40, false)
    tiles.placeOnTile(fuego, location)
    mySprite.hit(1)
    timer.after(100, function() {
        sprites.destroy(fuego)
    })
})
//BOSS TRIGGERS TRAP
scene.onOverlapTile(SpriteKind.MrsEgan, assets.tile`trap`, function (sprite: MrsEganType, location: tiles.Location) {
    let fuego = sprites.create(assets.image`fuego`, SpriteKind.Obstacle)
    animation.runImageAnimation(fuego, assets.animation`fire noises`, 40, false)
    tiles.placeOnTile(fuego, location)
    sprite.hit(1)
    timer.after(100, function () {
        sprites.destroy(fuego)
    })
})

//DASH
controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    dash()
})

//ANIMATIONS
//#8
controller.up.onEvent(ControllerButtonEvent.Pressed, function() {
    
    animation.runImageAnimation(mySprite, assets.animation`Dane walk Backward`, 150, false)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function() {
    animation.runImageAnimation(mySprite, assets.animation`Dane walk forward`, 150, false)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
    animation.runImageAnimation(mySprite, assets.animation`Dane walk left`, 150, false)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function() {
    animation.runImageAnimation(mySprite, assets.animation`Dane walk right`, 150, false)
})

//MAIN
accessory_items()
let mySprite = new Hero(assets.image`myImage`, SpriteKind.Player)
tiles.setCurrentTilemap(levels[levelNumber])
mySprite.setStayInScreen(true)
scene.cameraFollowSprite(mySprite)
mySprite.setPosition(25,95)
controller.moveSprite(mySprite, hero_velocity, hero_velocity)


animation.runImageAnimation(snail,assets.animation`helpful snail idle`,350,true)
snail.setPosition(100, 90)
snail.sayText("You should totaly go in the suspicious purple hole!")

scene.setBackgroundColor(6)