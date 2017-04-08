About = function() {};

About.prototype = {
    create: function() {
        this.splash = this.add.sprite(0, 0, 'about');
        this.splash.width = 1200;
        this.splash.height = 900;

    },
    update: function() {
        game.input.onDown.add(function(pointer, event) {
            if (this.game.state.current == "About") {
                this.game.state.start('MainMenu');
            }
        });
    }
};
