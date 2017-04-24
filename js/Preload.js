//loading the game assets
Preload = function() {};

Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(0, 0, 'splash');
        this.splash.width = 1200;
        this.splash.height = 800;

        this.load.image('about', 'assets/about.png');
        this.load.image('levels', 'assets/levels.png');
        this.load.image('controls', 'assets/controls.png');
        this.load.image('menu', 'assets/menu.png');
        game.load.spritesheet('player', 'assets/player.png', 64, 64);
        game.load.image('bullet', 'assets/other_sprites/bullet.png');
        game.load.image('heart', 'assets/other_sprites/heart.png');
        game.load.image('healthbar', 'assets/other_sprites/healthbar.png');
        game.load.physics('data', 'assets/data.json');
        //level 1
        game.load.tilemap('cerberusMap', 'assets/Lava.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('cerberusGameTiles', 'assets/Fire.png');
        game.load.spritesheet('redSlime', 'assets/other_sprites/red_slime.png', 32, 32);
        game.load.spritesheet('fireballTower', 'assets/other_sprites/fireball_tower.png', 64, 64);

        //level 2 
        game.load.tilemap('persephoneMap', 'assets/water.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('persephoneGameTiles', 'assets/Water.png');
        game.load.image('waterDrop', 'assets/other_sprites/water_droplet.png');
        game.load.spritesheet('blueSlime', 'assets/other_sprites/blue_slime.png', 32, 32);
        game.load.spritesheet('bubbleTower', 'assets/other_sprites/bubble_tower.png', 64, 64);
        game.load.image('bubblebullet', 'assets/other_sprites/Projectile1.png');
        //level 3

    },
    create: function() {
        setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }
};
