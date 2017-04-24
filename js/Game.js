//LEVEL 1
var cursors;
var bullets;
var fireRate = 500;
var nextFire = 0;
var swingRate = 3000;
var swung = false;
var nextSwing = 0;
var bulletspeed = 2000;
var enemies;
var spinInt = 0;
var swordhitbox = new p2.Circle(1.5)
var playerCollisionGroup;
var enemyCollisionGroup;
var borderCollisionGroup;
var swordCollisionGroup;
var bulletCollisionGroup;
var enemybulletCollisionGroup 
var hearts;
var invulnerability;
var shield;

Game = function() {};

Game.prototype = {

    create: function() {
        initAudio();
        invulnerability = false;
        //disable right click menu
        game.canvas.oncontextmenu = function(e) {
            e.preventDefault();
        }

        var map = game.add.tilemap('cerberusMap');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        map.addTilesetImage('Lava', 'cerberusGameTiles');
        //Create Layers
        var backgroundlayer = map.createLayer('Background');
        backgroundlayer.resizeWorld();
        //P2 Physics Engine
        game.physics.startSystem(Phaser.Physics.P2JS);

        //Collision Groups
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;
        playerCollisionGroup = game.physics.p2.createCollisionGroup();
        enemyCollisionGroup = game.physics.p2.createCollisionGroup();
        borderCollisionGroup = game.physics.p2.createCollisionGroup();
        swordCollisionGroup = game.physics.p2.createCollisionGroup();
        bulletCollisionGroup = game.physics.p2.createCollisionGroup();
        enemybulletCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        //enemies
        initEnemies('redSlime','fireballTower');
        initPlayer();

        //border
        border = game.add.sprite(0, 0, null);
        game.physics.p2.enable(border);
        border.body.clearShapes();
        border.body.loadPolygon('data', 'Border');
        border.body.setCollisionGroup(borderCollisionGroup);
        border.body.collides([enemyCollisionGroup, playerCollisionGroup, bulletCollisionGroup, enemybulletCollisionGroup]);

        player.body.collides([borderCollisionGroup,enemybulletCollisionGroup]);
        player.body.collides(enemyCollisionGroup);
        player.body.collides(bulletCollisionGroup);

        //move player with cursor keys
        cursors = game.input.keyboard.addKeys({
            'W': Phaser.KeyCode.W,
            'A': Phaser.KeyCode.A,
            'S': Phaser.KeyCode.S,
            'D': Phaser.KeyCode.D,
            'R': Phaser.KeyCode.R,
            'I': Phaser.KeyCode.I,
        });
        //bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.P2JS;
        bullets.createMultiple(20, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);

        hearts = game.add.group();

        for (var i = 0; i < player.health; i++) {
            var heart = hearts.create(i * 30, 0, 'heart');
            heart.fixedToCamera = true;
        }
    },

    update: function() {
        handleUpdate();
    },

};

