Help = function() {};

Help.prototype = {
    create: function() {
        this.splash = this.add.sprite(0, 0, 'controls');
        this.splash.width = 1200;
        this.splash.height = 900;

    },
    update: function() {
        game.input.onDown.add(function(pointer, event) {
            if (this.game.state.current == "Help") {
                var tileworldX = pointer.worldX - (pointer.worldX);
                var tileworldY = pointer.worldY - (pointer.worldY);
                var tileX = Math.floor(pointer.worldX);
                var tileY = Math.floor(pointer.worldY);
                if (tileX < 126 && tileX > 12 && tileY < 70 && tileY > 16) {
                    this.game.state.start('MainMenu');
                }
            }
        });
    }
};
