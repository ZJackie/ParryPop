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
                this.game.state.start('MainMenu');
            }
        });
    }
};
