About = function() {};

About.prototype = {
    create: function() {
        this.splash = this.add.sprite(0, 0, 'about');
        this.splash.width = 1200;
        this.splash.height = 800;

    },
    update: function() {
        game.input.onDown.add(function(pointer, event) {
            if (this.game.state.current == "About") {
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
