//loading the game assets
Preload = function() {};

Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(0, 0, 'splash');
        this.splash.width = 1200;
        this.splash.height = 800;

        this.load.image('about', 'assets/UI/about.png');
        this.load.image('levels', 'assets/UI/levels.png');
        this.load.image('controls', 'assets/UI/controls.png');
        this.load.image('menu', 'assets/UI/menu.png');
        game.load.spritesheet('player', 'assets/player.png', 64, 64);
        game.load.image('bullet', 'assets/other_sprites/bullet.png');
        game.load.image('heart', 'assets/other_sprites/heart.png');
        game.load.image('healthbar', 'assets/other_sprites/healthbar.png');
        game.load.image('ultimatebar', 'assets/other_sprites/ultimatebar.png');
        game.load.image('ultimatebarInvert', 'assets/other_sprites/ultimatebarinvert.png');
        game.load.physics('data', 'assets/data.json');
        //level 1
        game.load.tilemap('cerberusMap', 'assets/Levels/Lava.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('cerberusGameTiles', 'assets/Levels/Fire.png');
        game.load.spritesheet('redSlime', 'assets/other_sprites/red_slime.png', 32, 32);
        game.load.spritesheet('fireballTower', 'assets/other_sprites/fireball_tower.png', 64, 64);
        game.load.image('fireBullet', 'assets/other_sprites/fireBullet.png');


        //level 2 
        game.load.tilemap('persephoneMap', 'assets/Levels/water.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('persephoneGameTiles', 'assets/Levels/Water.png');
        game.load.image('waterDrop', 'assets/other_sprites/water_droplet.png');
        game.load.spritesheet('blueSlime', 'assets/other_sprites/blue_slime.png', 32, 32);
        game.load.spritesheet('bubbleTower', 'assets/other_sprites/bubble_tower.png', 64, 64);
        game.load.image('bubblebullet', 'assets/other_sprites/bubbleBullet.png');
        //level 3

    },
    create: function() {
        setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }
};
