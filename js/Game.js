var player;
var cursors;

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

        player.animations.add('idle', [0, 1, 2, 3, 4], 10, true);
        player.animations.add('down', [5, 6, 7, 8, 9], 10, true);
        player.animations.add('up', [10, 11, 12, 13, 14], 10, true);
        player.animations.add('right', [15, 16, 17, 18, 19], 10, true);
        player.animations.add('left', [20, 21, 22, 23, 24], 10, true);
        game.physics.p2.enable(player, true);

        //the camera will follow the player in the world
        game.camera.follow(player);

        //move player with cursor keys
        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {
        //player movement
        player.body.setZeroVelocity();
        if (cursors.up.isDown) {
            if (player.body.y > 275) {
                player.body.moveUp(800);
            }
        } else if (cursors.down.isDown) {
            if (player.body.y < 1325) {
                player.body.moveDown(800);
            }
        }
        if (cursors.left.isDown) {
            if (player.body.x > 275) {
                player.body.moveLeft(800);
            }
        } else if (cursors.right.isDown) {
            if (player.body.x < 1325) {
                player.body.moveRight(800);
            }
        }
    }

};
