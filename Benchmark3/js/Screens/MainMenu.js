MainMenu = function() {};

MainMenu.prototype = {
    create: function() {
        button = game.add.audio('button');
        this.splash = this.add.sprite(0, 0, 'menu');
        this.splash.width = 1200;
        this.splash.height = 800;
        game.input.onDown.add(function(pointer, event) {
            var tileworldX = pointer.worldX - (pointer.worldX);
            var tileworldY = pointer.worldY - (pointer.worldY);
            var tileX = Math.floor(pointer.worldX);
            var tileY = Math.floor(pointer.worldY);
            if (this.game.state.current == "MainMenu") {
                //Play
                if (tileX < 800 && tileX > 600 && tileY < 400 && tileY > 140) {
                    button.play();
                    this.game.state.start('Levels');
                }
                //About
                if (tileX < 1060 && tileX > 880 && tileY < 420 && tileY > 240) {
                    button.play();
                    this.game.state.start('Help');
                }
                //Help
                if (tileX < 931 && tileX > 785 && tileY < 585 && tileY > 395) {
                    button.play();
                    this.game.state.start('About');
                }
            }
        });
    },
};
