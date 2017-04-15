var MyGame = {
    score: 0,
    text: ''
};

MyGame.Boot = function (game) {
};

MyGame.Boot.prototype = {
    preload: function () {
    },

    create: function () {
        // alinha o canvas no centro
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // redimensionar o canvas de acordo com a area disponivel
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.setScreenSize(true);
        this.scale.setMaximum();
        this.scale.refresh();

        // inicia o pré carregamento de assets
        this.state.start('preloader');
    }
};