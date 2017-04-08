Levels = function() {};

Levels.prototype = {
    create: function() {
        this.splash = this.add.sprite(0, 0, 'levels');
        this.splash.width = 1200;
        this.splash.height = 900;
        game.input.onDown.add(function(pointer, event) {
            var tileworldX = pointer.worldX - (pointer.worldX);
            var tileworldY = pointer.worldY - (pointer.worldY);
            var tileX = Math.floor(pointer.worldX);
            var tileY = Math.floor(pointer.worldY);
            console.log(tileX + " " + tileY);
            if (this.game.state.current == "Levels") {
                //Play
                if (tileX < 630 && tileX > 442 && tileY < 509 && tileY > 347) {
                    this.game.state.start('Game');
                }
                //About
                if (tileX < 850 && tileX > 682 && tileY < 509 && tileY > 350) {
                    console.log("Level 2");
                }
                //Help
                if (tileX < 1090 && tileX > 903 && tileY < 510 && tileY > 350) {
                    console.log("Level 3");
                }
            }
        });
    },
};
