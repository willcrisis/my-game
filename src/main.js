MyGame.Main = function(game) {
    this.text = null;
};

MyGame.Main.prototype = {
    create: function() {
        this.add.button(206, 254, 'play-button', this.startGame, this);

        this.text = this.add.text(200, 200, MyGame.text, {fontSize: '32px', fill: '#FFF'});
    },

    startGame: function() {
        this.game.state.start('game');
    }
};