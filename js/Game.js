var player;
var cursors;
var bullets;
var fireRate = 500;
var nextFire = 0;
var bulletspeed = 300;

Game = function() {};

Game.prototype = {

    create: function() {
        var map = game.add.tilemap('Map');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        map.addTilesetImage('Water', 'gameTiles');
        //Create Layers
        var backgroundlayer = map.createLayer('Background');
        backgroundlayer.resizeWorld();
        //P2 Physics Engine
        game.physics.startSystem(Phaser.Physics.P2JS);
        //Draw Rectangle Boundary
        var graphics = game.add.graphics(0, 0);
        graphics.lineStyle(4, 0x031b49, 1);
        graphics.drawRect(250, 250, 1100, 1100);
        //Add my Robot player
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        player.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
        game.physics.p2.enable(player, true);
        player.body.setCircle(30);
        //the camera will follow the player in the world
        game.camera.follow(player);

        //move player with cursor keys
        cursors = game.input.keyboard.addKeys({'W': Phaser.KeyCode.W, 'A': Phaser.KeyCode.A,'S': Phaser.KeyCode.S, 'D': Phaser.KeyCode.D});
        //bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(20, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
  },

    update: function() {
        //player movement
        pointerangle = game.physics.arcade.angleToPointer(player) + game.math.degToRad(-90);
        player.body.rotation = pointerangle;
        player.body.setZeroVelocity();
        if (cursors.W.isDown) {
            if (player.body.y > 275) {
                player.body.moveUp(800);
                player.animations.play('walk',false)
            }
        } else if (cursors.S.isDown) {
            if (player.body.y < 1325) {
                player.body.moveDown(800);
                player.animations.play('walk',false)
            }
        }
        if (cursors.A.isDown) {
            if (player.body.x > 275) {
                player.body.moveLeft(800);
                player.animations.play('walk',false)
            }
        } else if (cursors.D.isDown) {
            if (player.body.x < 1325) {
                player.body.moveRight(800);
                player.animations.play('walk',false)
            }
        }
        if (game.input.activePointer.isDown)
         {
                if (game.time.now > nextFire && bullets.countDead() > 0)
         {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);
        if(bullet){
        bullet.lifespan = 500;
        bullet.reset(player.body.x + 8, player.body.y + 8);
        game.physics.arcade.velocityFromRotation(game.physics.arcade.angleToPointer(player), bulletspeed, bullet.body.velocity);
        }
         }
        }
    },

};
