//Initial White Boot Screen
Boot = function() {};

Boot.prototype = {
    preload: function() {
      this.load.image('splash', 'Benchmark2/assetsBenchmark2/splash.png');
    },
    create: function() {
        this.game.stage.backgroundColor = '#fff';
        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVeritcally = true;


        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('Preload');
    }

};
