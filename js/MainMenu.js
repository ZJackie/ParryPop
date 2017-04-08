MainMenu = function() {};

MainMenu.prototype = {
    create: function() {
        this.splash = this.add.sprite(0, 0, 'menu');
        this.splash.width = 1200;
        this.splash.height = 900;
        game.input.onDown.add(function(pointer, event) {
            var tileworldX = pointer.worldX - (pointer.worldX);
            var tileworldY = pointer.worldY - (pointer.worldY);
            var tileX = Math.floor(pointer.worldX);
            var tileY = Math.floor(pointer.worldY);
            if (this.game.state.current == "MainMenu") {
                //Play
                if (tileX < 800 && tileX > 600 && tileY < 400 && tileY > 140) {
                    this.game.state.start('Levels');
                }
                //About
                if (tileX < 1060 && tileX > 880 && tileY < 420 && tileY > 240) {
                    this.game.state.start('About');
                }
                //Help
                if (tileX < 931 && tileX > 785 && tileY < 585 && tileY > 446) {
                    this.game.state.start('Help');
                }
            }
        });
    },
};
