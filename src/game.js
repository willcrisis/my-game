MyGame.Game = function (game) {
    this.gravity = 300;
    this.platforms = null;
    this.player = null;
    this.cursors = null;
    this.actions = null;
    this.stars = null;
    this.enemies = null;
    this.scoreText = null;
    this.projectiles = null;
    this.projectileModel = null;
    this.enemySpeed = 50;
    this.enemyMaxWalk = 150;
};

MyGame.Game.prototype = {
    create: function () {
        MyGame.score = 0;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.add.sprite(0, 0, 'sky');

        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = this.platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        this.player = this.add.sprite(32, game.world.height - 150, 'dude');
        this.physics.arcade.enable(this.player);
        this.player.body.gravity.y = this.gravity;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.direction = 1;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.actions = this.input.keyboard.addKeys({'control': Phaser.Keyboard.CONTROL});

        this.stars = game.add.group();
        this.stars.enableBody = true;
        for (var i = 0; i < 12; i++) {
            var star = this.stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 6;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.scoreText = game.add.text(16, 16, 'Stars: 0', {fontSize: '32px', fill: '#ddd'});

        var enemyCoordinates = [
            [180, 218],
            [360, game.world.height - 96],
            [520, 368]
        ];
        this.enemies = game.add.group();
        for (var i = 0; i < 3; i++) {
            var enemy = this.enemies.create(enemyCoordinates[i][0], enemyCoordinates[i][1], 'enemy');
            game.physics.arcade.enable(enemy);
            enemy.body.bounce.y = 0.2;
            enemy.body.gravity.y = this.gravity;
            enemy.body.collideWorldBounds = true;
            enemy.animations.add('left', [0, 1], 10, true);
            enemy.animations.add('right', [2, 3], 10, true);
            enemy.walked = 0;
            enemy.direction = -1;
        }

        this.projectiles = game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

        this.projectileModel = this.add.bitmapData(5, 5);
        this.projectileModel.ctx.beginPath();
        this.projectileModel.ctx.rect(0, 0, 5, 5);
        this.projectileModel.ctx.fillStyle = '#ffffff';
        this.projectileModel.ctx.fill();
    },

    update: function () {
        var hitPlatform = this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.stars, this.platforms);
        var enemyInGround = this.physics.arcade.collide(this.enemies, this.platforms);
        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.arcade.overlap(this.player, this.enemies, this.die, null, this);
        this.physics.arcade.overlap(this.projectiles, this.enemies, this.killEnemy, null, this);
        this.physics.arcade.overlap(this.projectiles, this.platforms, this.removeProjectile, null, this);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.direction = -1;
            this.player.animations.play('left');
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.direction = 1;
            this.player.animations.play('right');
        } else {
            this.player.animations.stop();
            if (this.player.direction > 0) {
                this.player.frame = 7;
            } else if (this.player.direction < 0) {
                this.player.frame = 0;
            } else {
                this.player.direction = 4;
            }
        }
        if (this.actions.control.isDown) {
            this.addProjectile(this.projectiles, this.player);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
            this.player.body.velocity.y = -350;
        }

        this.enemies.forEach(function (enemy) {
            enemy.body.velocity.x = 0;
            this.enemyWalk(enemy, enemyInGround);
        }, this);
    },

    enemyWalk: function (enemy, enemyInGround) {
        var direction = enemy.direction < 0 ? 'left' : 'right';
        if (enemyInGround) {
            if (enemy.walked == this.enemyMaxWalk) {
                enemy.walked = 0;
                enemy.direction = enemy.direction * -1;
            } else {
                enemy.body.velocity.x = this.enemySpeed * enemy.direction;
                enemy.animations.play(direction);
                enemy.walked++;
            }
        }
    },

    collectStar: function (player, star) {
        star.kill();
        this.scoreText.text = 'Stars: ' + ++MyGame.score;
        if (!this.stars.countLiving()) {
            this.endGame();
        }
    },

    die: function (player) {
        player.kill();
        this.gameOver();
    },

    gameOver: function () {
        MyGame.text = 'Game over. Your score: ' + MyGame.score;
        this.game.state.start('main');
    },

    endGame: function() {
        MyGame.text = 'You caught all the stars.';
        this.game.state.start('main');
    },

    addProjectile: function () {
        if (this.projectiles.countLiving() !== 0) {
            return;
        }

        var projectile;
        if (this.player.direction > 0) {
            projectile = this.projectiles.getFirstDead(true, this.player.body.x + 32, this.player.body.y + 32, this.projectileModel);
        } else {
            projectile = this.projectiles.getFirstDead(true, this.player.body.x, this.player.body.y + 32, this.projectileModel);
        }

        this.physics.arcade.enable(projectile);
        projectile.checkWorldBounds = true;
        projectile.body.velocity.x = 500 * this.player.direction;
        projectile.events.onOutOfBounds.add(this.removeProjectile, this);
    },

    killEnemy: function (projectile, enemy) {
        this.removeProjectile(projectile);
        enemy.kill();
    },

    removeProjectile: function (projectile) {
        projectile.kill();
    }
};