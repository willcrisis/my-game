MyGame.Preloader = function (game) {
    this.background = null;
};

MyGame.Preloader.prototype = {
    preload: function() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('play-button', 'assets/play-button.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.spritesheet('enemy', 'assets/baddie.png', 32, 32);
    },

    create: function() {
        this.state.start('main');
    }
};