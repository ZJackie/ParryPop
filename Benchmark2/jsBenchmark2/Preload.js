//loading the game assets
Preload = function() {};

Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(0, 0, 'splash');
        this.splash.width = 1200;
        this.splash.height = 800;

        this.load.image('about', 'Benchmark2/assetsBenchmark2/about.png');
        this.load.image('levels', 'Benchmark2/assetsBenchmark2/levels.png');
        this.load.image('controls', 'Benchmark2/assetsBenchmark2/controls.png');
        this.load.image('menu', 'Benchmark2/assetsBenchmark2/menu.png');
        game.load.tilemap('Map', 'Benchmark2/assetsBenchmark2/water.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', 'Benchmark2/assetsBenchmark2/Water.png');
        game.load.spritesheet('player', 'Benchmark2/assetsBenchmark2/player.png', 64, 64);
        game.load.image('bullet', 'Benchmark2/assetsBenchmark2/other_sprites/bullet.png');
        game.load.image('heart', 'Benchmark2/assetsBenchmark2/other_sprites/heart.png');
        game.load.image('waterDrop', 'Benchmark2/assetsBenchmark2/other_sprites/water_droplet.png');
        game.load.spritesheet('blueSlime', 'Benchmark2/assetsBenchmark2/other_sprites/blue_slime.png', 32, 32);
        game.load.spritesheet('bubbleTower', 'Benchmark2/assetsBenchmark2/other_sprites/bubble_tower.png', 64, 64);
        game.load.physics('data', 'Benchmark2/assetsBenchmark2/data.json');
    },

    create: function() {
        setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }
};
