var player;
var cursors;
var bullets;
var fireRate = 500;
var nextFire = 0;
var swingRate = 1000;
var swung = false;
var nextSwing = 0;
var bulletspeed = 300;
var enemies;
var spinInt = 0;

Game = function() {};

Game.prototype = {

    create: function() {
        //disable right click menu
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        var map = game.add.tilemap('Map');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        map.addTilesetImage('Water', 'gameTiles');
        //Create Layers
        var backgroundlayer = map.createLayer('Background');
        backgroundlayer.resizeWorld();
        //P2 Physics Engine
        game.physics.startSystem(Phaser.Physics.P2JS);

        //Add my Robot player
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        player.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
        player.animations.add('attack', [5, 6, 7, 8, 9], 10, true);
        player.animations.add('shoot', [10, 11, 12, 13, 14], 10, true);
        game.physics.p2.enable(player, true);
        player.body.setCircle(20);
        //the camera will follow the player in the world
        game.camera.follow(player);

        //border
        border = game.add.sprite(0,0,null);
        game.physics.p2.enable(border);
        border.body.clearShapes();
        border.body.loadPolygon('data', 'Border');

        //move player with cursor keys
        cursors = game.input.keyboard.addKeys({'W': Phaser.KeyCode.W, 'A': Phaser.KeyCode.A,'S': Phaser.KeyCode.S, 'D': Phaser.KeyCode.D});
        //bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(20, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        
        //enemies
        initEnemies();
  },

    update: function() {
        //player movement
        pointerangle = game.physics.arcade.angleToPointer(player) + game.math.degToRad(-90);
        player.body.rotation = pointerangle;
        player.body.setZeroVelocity();
        if (cursors.W.isDown) {
                player.body.moveUp(300);
                player.animations.play('walk',false)
        } else if (cursors.S.isDown) {
                player.body.moveDown(300);
                player.animations.play('walk',false)
        }
        if (cursors.A.isDown) {
                player.body.moveLeft(300);
                player.animations.play('walk',false)
        } else if (cursors.D.isDown) {
                player.body.moveRight(300);
                player.animations.play('walk',false)
        }
        if (game.input.mousePointer.leftButton.isDown)
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
        if(game.input.mousePointer.rightButton.isDown){
              if (game.time.now > nextSwing){
                nextSwing = game.time.now + swingRate;
                if(swung == false){
                player.body.addCircle(15,0,20);
                swung = true;
                player.animations.play('attack',true)
                }
              }
    }
        else{
            player.animations.play('walk',true)
            if(swung == true){
            player.body.clearShapes();
            player.body.setCircle(20);
            swung = false;
    }
        }
        //handle enemies
        handleEnemies();
    },

};

function initEnemies(){
    enemies = game.add.group();
    //enemies.enableBody = true;

    for(var i = 0; i < 10; i++){
        var slime = enemies.create(game.world.centerX + (-500 + Math.random()*1000), game.world.centerY+ (-500 + Math.random()*1000), 'blueSlime');
        var arr = [];
        for(var j = 0; j < 22; j++){
            arr.push(j);
        }
        slime.animations.add('blueSlimeIdle', arr, 12, true);
        slime.currentRadius = slime.width;
           game.physics.p2.enable(slime, true);
        slime.body.setCircle(30);
    }
}

function handleEnemies(){
    handleEnemyMovements();
}

function handleEnemyMovements(){
    enemies.forEach(function(enemy){
        enemy.animations.play('blueSlimeIdle');
        enemy.currentRadius = enemy.currentRadius - 0.2;
        enemy.body.setCircle(enemy.currentRadius);
        if(enemy.currentRadius <= (enemy.width/2 - enemy.width * 0.1)){
            enemy.currentRadius = enemy.width;
        }
        
    }, this);
}