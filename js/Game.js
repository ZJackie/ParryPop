var player;
var cursors;
var bullets;
var fireRate = 500;
var nextFire = 0;
var swingRate = 3000;
var swung = false;
var nextSwing = 0;
var bulletspeed = 2000;
var enemies;
var spinInt = 0;
var swordhitbox = new p2.Circle(1.5)
var playerCollisionGroup;
var enemyCollisionGroup;
var borderCollisionGroup;
var swordCollisionGroup;
var bulletCollisionGroup;
var enemybulletCollisionGroup 
var hearts;
var invulnerability;
var shield;

Game = function() {};

Game.prototype = {

    create: function() {
        invulnerability = false;
        //disable right click menu
        game.canvas.oncontextmenu = function(e) {
            e.preventDefault();
        }

        var map = game.add.tilemap('Map');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        map.addTilesetImage('Water', 'gameTiles');
        //Create Layers
        var backgroundlayer = map.createLayer('Background');
        backgroundlayer.resizeWorld();
        //P2 Physics Engine
        game.physics.startSystem(Phaser.Physics.P2JS);

        //Collision Groups
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;
        playerCollisionGroup = game.physics.p2.createCollisionGroup();
        enemyCollisionGroup = game.physics.p2.createCollisionGroup();
        borderCollisionGroup = game.physics.p2.createCollisionGroup();
        swordCollisionGroup = game.physics.p2.createCollisionGroup();
        bulletCollisionGroup = game.physics.p2.createCollisionGroup();
        enemybulletCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        //enemies
        initEnemies();

        //Add my Robot player
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        player.animations.add('idle', [0, 1, 2, 3, 4], 10, true);
        player.animations.add('walk', [5, 6, 7, 8, 9], 10, false);
        player.animations.add('attack', [10, 11, 12, 13, 14], 10, false);
        player.animations.add('attackwalk', [15, 16, 17, 18, 19], 10, false);
        player.animations.add('shoot', [20, 21, 22, 23, 24], 10, false);
        player.animations.add('shootwalk', [25, 26, 27, 28, 29], 10, false);
        player.animations.add('death', [30, 31, 32, 33, 34], 10, false);

        player.dead = 0;

        game.physics.p2.enable(player, true);
        player.body.setCircle(20);
        player.health = 10;
        player.body.setCollisionGroup(playerCollisionGroup);
        //the camera will follow the player in the world
        game.camera.follow(player);

        //border
        border = game.add.sprite(0, 0, null);
        game.physics.p2.enable(border);
        border.body.clearShapes();
        border.body.loadPolygon('data', 'Border');
        border.body.setCollisionGroup(borderCollisionGroup);
        border.body.collides([enemyCollisionGroup, playerCollisionGroup, bulletCollisionGroup, enemybulletCollisionGroup]);

        player.body.collides([borderCollisionGroup,enemybulletCollisionGroup]);
        player.body.collides(enemyCollisionGroup);
        player.body.collides(bulletCollisionGroup);

        //move player with cursor keys
        cursors = game.input.keyboard.addKeys({
            'W': Phaser.KeyCode.W,
            'A': Phaser.KeyCode.A,
            'S': Phaser.KeyCode.S,
            'D': Phaser.KeyCode.D
        });
        //bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.P2JS;
        bullets.createMultiple(20, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);

        hearts = game.add.group();

        for (var i = 0; i < player.health; i++) {
            var heart = hearts.create(i * 30, 0, 'heart');
            heart.fixedToCamera = true;
        }
    },

    update: function() {
        if(player.dead == 0)
        {
        //player movement
        pointerangle = game.physics.arcade.angleToPointer(player) + game.math.degToRad(-90);
        player.body.rotation = pointerangle;
        player.body.setZeroVelocity();
        if (cursors.W.isDown) {
            player.body.moveUp(300);
            if (game.input.mousePointer.leftButton.isDown) {
                player.animations.play('shootwalk', false);
            } else if (game.input.mousePointer.rightButton.isDown) {
                player.animations.play('attackwalk', false);
            } else {
                player.animations.play('walk', false);
            }
        } else if (cursors.S.isDown) {
            player.body.moveDown(300);
            if (game.input.mousePointer.leftButton.isDown) {
                player.animations.play('shootwalk', false);
            } else if (game.input.mousePointer.rightButton.isDown) {
                player.animations.play('attackwalk', false);
            } else {
                player.animations.play('walk', false);
            }
        }
        if (cursors.A.isDown) {
            player.body.moveLeft(300);
            if (game.input.mousePointer.leftButton.isDown) {
                player.animations.play('shootwalk', false);
            } else if (game.input.mousePointer.rightButton.isDown) {
                player.animations.play('attackwalk', false);
            } else {
                player.animations.play('walk', false);
            }
        } else if (cursors.D.isDown) {
            player.body.moveRight(300);
            if (game.input.mousePointer.leftButton.isDown) {
                player.animations.play('shootwalk', false);
            } else if (game.input.mousePointer.rightButton.isDown) {
                player.animations.play('attackwalk', false);
            } else {
                player.animations.play('walk', false);
            }
        }
        if (game.input.mousePointer.leftButton.isDown) {
            if (game.time.now > nextFire && bullets.countDead() > 0) {
                nextFire = game.time.now + fireRate;
                var point1 = new Phaser.Point(player.body.x, player.body.y);
                var point2 = new Phaser.Point(player.body.x + 13, player.body.y - 40);
                point2.rotate(point1.x, point1.y, pointerangle + game.math.degToRad(180), false);
                var bullet = bullets.getFirstExists(false);
                if (bullet) {
                    game.physics.p2.enable(bullet, true);
                    bullet.body.fixedRotation = true;
                    bullet.lifespan = 2000;
                    bullet.reset(point2.x, point2.y);
                    bullet.rotation = pointerangle;
                    bullet.body.velocity.x = bulletspeed * Math.cos(pointerangle + game.math.degToRad(-270));
                    bullet.body.velocity.y = bulletspeed * Math.sin(pointerangle + game.math.degToRad(-270));
                    bullet.body.mass = 0.1;
                    bullet.body.setCircle(10)
                    bullet.body.setCollisionGroup(bulletCollisionGroup);
                    bullet.body.collides([enemyCollisionGroup, borderCollisionGroup, swordCollisionGroup,enemybulletCollisionGroup])
                    player.animations.play('shoot', false);
                    //bullet.body.collides(enemyCollisionGroup, killEnemies, this);
                    //game.physics.arcade.velocityFromRotation(game.physics.arcade.angleToPointer(player), bulletspeed, bullet.body.velocity);
                }
            }
        }
        if (game.input.mousePointer.rightButton.isDown) {
            if (game.time.now > nextSwing) {
                nextSwing = game.time.now + swingRate;
                if (swung == false) {
                    shield = 2;
                    player.body.addShape(swordhitbox, 0, 20);
                    player.body.setCollisionGroup(swordCollisionGroup, swordhitbox)
                    swung = true;
                    player.animations.play('attack', true)
                }
            }
        } else {
            player.animations.play('walk', true)
            if (game.time.now > nextSwing - 500) {
                if (swung == true) {
                    shield = 0;
                    player.body.removeShape(swordhitbox);
                    swung = false;
                }
            }
        }
        //handle enemies
        handleEnemies();
      }
        if(enemies.length == 0){
            setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
        }


        if (player.health <= 0 && player.dead == 0) {
            player.animations.play('death');
            player.body.clearShapes();
            player.dead = 1;

            setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }

    },

};

function initEnemies() {
    enemies = game.add.group();
    //enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.P2JS;

    for(var i = 0; i < 15; i++){
        var slime = enemies.create(game.world.centerX + (-500 + Math.random()*1000), game.world.centerY+ (-500 + Math.random()*1000), 'blueSlime');
        var arr = [];
        for (var j = 0; j < 22; j++) {
            arr.push(j);
        }
        slime.mass = 5;
        slime.health = 1;
        slime.animations.add('blueSlimeIdle', arr, 12, true);
        slime.currentRadius = slime.width;
        game.physics.p2.enable(slime, true);
        slime.body.setCircle(30);
        slime.body.setCollisionGroup(enemyCollisionGroup);
        slime.body.collides(swordCollisionGroup, smackEnemies, this);
        slime.body.collides(playerCollisionGroup, takeDamage, this);
        slime.body.collides(bulletCollisionGroup, killEnemies, this);
        slime.body.collides(borderCollisionGroup, bounce, this);
        slime.body.collides([enemyCollisionGroup, playerCollisionGroup]);
        slime.enemyType = "slime";
        slime.rate = Math.random()*0.4 + 0.1
        var num = Math.random();
            if(num < 0.25){
                slime.body.moveUp(500);
            }
            else if(num >= 0.25 && num <= 0.50){
                slime.body.moveDown(500);
            }
            else if(num >= 0.5 && num <= 0.75){
                slime.body.moveLeft(500);
            }
            else{
                slime.body.moveRight(500);
            }
        //slime.body.static = true;
    }

    for(var i = 0; i < 5; i++){
        var towers = enemies.create(game.world.centerX + (-500 + Math.random()*1000), game.world.centerY+ (-500 + Math.random()*1000), 'bubbleTower');
        var arr = [];
        for (var j = 0; j < 17; j++) {
            arr.push(j);
        }
        towers.health = 3;
        healthbar = game.add.sprite(towers.x - 25,towers.y - 50,'healthbar');
        healthbar.height = 10;
        healthbar.width = (towers.health / 3) * 50;
        towers.healthbar = healthbar;
        towers.enemyType = "tower";
        towers.animations.add('bubbleToweridle', arr, 12, true);
        towers.currentRadius = towers.width;
        game.physics.p2.enable(towers, true);
        towers.body.static = true;
        towers.body.setCircle(50);
        towers.body.setCollisionGroup(enemyCollisionGroup);
        towers.body.collides(swordCollisionGroup, smackEnemies, this);
        towers.body.collides(playerCollisionGroup, takeDamage, this);
        towers.body.collides(bulletCollisionGroup, killEnemies, this);
        towers.body.collides([enemyCollisionGroup, borderCollisionGroup, playerCollisionGroup]);

        towers.bullets = game.add.group();
        towers.bullets.enableBody = true;
        towers.bullets.physicsBodyType = Phaser.Physics.P2JS;
        towers.bullets.createMultiple(5, 'bubblebullet');
        towers.bullets.setAll('checkWorldBounds', true);
        towers.bullets.setAll('outOfBoundsKill', true);
        towers.bullets.setAll('anchor.x', 0.5);
        towers.bullets.setAll('anchor.y', 0.5);

        towers.enemyType = "tower";
        towers.rate = Math.random()*0.4 + 0.1
    }

}

function killEnemies(body1, body2) {
    body2.sprite.kill();
    if (body1.isVulnerable == true) {
        if(body1.sprite.health == 1){
        body1.clearShapes();
        if(body1.sprite.enemyType == "tower"){
        body1.sprite.healthbar.kill();
        }
        body1.sprite.destroy();
        }
        else{
            body1.sprite.health --;
            body1.sprite.healthbar.width = (body1.sprite.health / 3) * 50;
        }
    }
}

function smackEnemies(body1, body2) {
    if (shield > 0) {
        if (body1.isVulnerable == true) {
        if(body1.sprite.health == 1){
        body1.clearShapes();
        body1.sprite.destroy();}
        else{
            body1.sprite.health --;
        }
    }
        shield--;
    } else {
        player.body.removeShape(swordhitbox);
        swung = false;
    }
}

function bounce(body1, body2){
        var num = Math.random();
            if(num < 0.25){
                body1.moveUp(500);
            }
            else if(num >= 0.25 && num <= 0.50){
                body1.moveDown(500);
            }
            else if(num >= 0.5 && num <= 0.75){
                body1.moveLeft(500);
            }
            else{
                body1.moveRight(500);
            }
}

function handleEnemies(){
    handleEnemyMovements();
}

function handleEnemyMovements() {
    enemies.forEach(function(enemy) {
        if(enemy.enemyType == "slime"){
        enemy.animations.play('blueSlimeIdle');
        enemy.currentRadius = enemy.currentRadius - enemy.rate;
        enemy.body.setCircle(enemy.currentRadius);
        enemy.body.setCollisionGroup(enemyCollisionGroup);
        enemy.body.collides([enemyCollisionGroup, swordCollisionGroup, borderCollisionGroup]);
        var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 5;
        var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
        if (enemy.currentRadius <= lowerBound) {
            enemy.currentRadius = enemy.width;
        }

        if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
            enemy.body.isVulnerable = true;
        } else {
            enemy.body.isVulnerable = false;
        }
            if(game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 80){
            game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 200);}
        }
        else if(enemy.enemyType == "tower"){
             enemy.animations.play('bubbleToweridle', 10);
             enemy.currentRadius = enemy.currentRadius - enemy.rate;
             enemy.body.setCircle(enemy.currentRadius);
             enemy.body.setCollisionGroup(enemyCollisionGroup);
             enemy.body.collides([enemyCollisionGroup, swordCollisionGroup, borderCollisionGroup]);
             var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 5;
             var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
        if (enemy.currentRadius <= lowerBound) {
            enemy.currentRadius = enemy.width;
        }

        if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
            enemy.body.isVulnerable = true;
        } else {
            enemy.body.isVulnerable = false;
        }
         if(game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 500){
         fireBubbleBullet(enemy);
         }
          }
    }, this);
}

function fireBubbleBullet(enemy){
                angle = Math.random()*Math.PI*2;
                var bubblebullet = enemy.bullets.getFirstExists(false);
                if(bubblebullet){
                game.physics.p2.enable(bubblebullet, true);
                bubblebullet.enemyType = "enemyBullet";
                bubblebullet.body.fixedRotation = true;
                bubblebullet.lifespan = 2000;
                bubblebullet.reset(enemy.x, enemy.y);
                bubblebullet.rotation = angle;
                bubblebullet.body.velocity.x = 250 * Math.cos(angle + game.math.degToRad(-270));
                bubblebullet.body.velocity.y = 250 * Math.sin(angle + game.math.degToRad(-270));
                bubblebullet.isVulnerable = true;
                bubblebullet.body.setCircle(10)
                bubblebullet.body.setCollisionGroup(enemybulletCollisionGroup);
                bubblebullet.body.collides([borderCollisionGroup])
                bubblebullet.body.collides(swordCollisionGroup, parryBullets, this);
                bubblebullet.body.collides(playerCollisionGroup, takeBulletDamage, this);
                bubblebullet.body.collides(bulletCollisionGroup, destroyBullets, this);
                }

}
function destroyBullets(body1, body2){
    body1.clearShapes();
    body1.sprite.kill();
    body2.clearShapes();
    body2.sprite.kill();
}
function parryBullets(body1, body2) {
    if (shield > 0) {
        body1.clearShapes();
        body1.sprite.kill();
        shield--;
    }
    else {
        player.body.removeShape(swordhitbox);
        swung = false;
    }
}

function takeDamage(body1,body2) {
    // decrement health, handle heart graphic in update
    if(player.health > 0){
        if(invulnerability == false){
        hearts.children[player.health - 1].kill();
        player.health--;
        invulnerability = true;
        game.time.events.add(500, removeInvulnerability, this);
        }
    }

    function removeInvulnerability() {
        invulnerability = false;
    }
}

function takeBulletDamage(body1,body2) {
    body1.sprite.kill()
    // decrement health, handle heart graphic in update
    if(player.health > 0){
        if(invulnerability == false){
        hearts.children[player.health - 1].kill();
        player.health--;
        invulnerability = true;
        game.time.events.add(500, removeInvulnerability, this);
        }
    }

    function removeInvulnerability() {
        invulnerability = false;
    }
}