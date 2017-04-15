MyGame.Player = function(game) {
    return game.add.sprite(32, game.world.height - 150, 'dude');
};

MyGame.Player.prototype = {
    create: function() {
        this.physics.arcade.enable(MyGame.player);
        MyGame.player.body.bounce.y = 0.2;
        MyGame.player.body.gravity.y = 300;
        MyGame.player.body.collideWorldBounds = true;
        MyGame.player.animations.add('left', [0, 1, 2, 3], 10, true);
        MyGame.player.animations.add('right', [5, 6, 7, 8], 10, true);
    }
};