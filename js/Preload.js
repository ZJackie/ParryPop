//loading the game assets
Preload = function() {};

Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(0,0,'splash');
        this.splash.width = 1200;
        this.splash.height = 900;

        this.load.image('about', 'assets/about.png');
        this.load.image('levels', 'assets/levels.png');
        this.load.image('controls', 'assets/controls.png');
        this.load.image('menu', 'assets/menu.png');
        game.load.tilemap('Map', 'assets/water.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', 'assets/Water.png');
        game.load.spritesheet('player', 'assets/player.png', 32, 32);
    },

    create: function() {
        this.state.start('MainMenu');
    }
};
