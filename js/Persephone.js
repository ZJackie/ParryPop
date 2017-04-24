function spawnPersephone() {
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;

    var persephone = enemies.create(game.world.centerX + (-500 + Math.random() * 1000), game.world.centerY + (-500 + Math.random() * 1000), 'persephone');
    var arr = [];
    for (var j = 0; j < 4; j++) {
        arr.push(j);
    }
    persephone.mass = 20;
    persephone.maxhealth = 20;
    persephone.health = 20;

    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (persephone.health / persephone.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    persephone.shield = false;
    persephone.healthbar = healthbar;
    persephone.animations.add('persephoneidle', arr, 12, true);
    persephone.currentRadius = persephone.width;
    game.physics.p2.enable(persephone, true);
    persephone.body.setCircle(60);
    persephone.body.setCollisionGroup(enemyCollisionGroup);
    persephone.body.collides(swordCollisionGroup, smackEnemies, this);
    persephone.body.collides(playerCollisionGroup, takeDamage, this);
    persephone.body.collides(bulletCollisionGroup, killEnemies, this);
    persephone.body.collides(borderCollisionGroup);
    persephone.body.collides(playerCollisionGroup);
    persephone.enemyType = "persephone";
    persephone.rate = 0.5;
    persephone.body.static = true;

    //bullets
    persephone.bullets = game.add.group();
    persephone.bullets.enableBody = true;
    persephone.bullets.physicsBodyType = Phaser.Physics.P2JS;
    persephone.bullets.createMultiple(5, 'bubblebullet');
    persephone.bullets.setAll('checkWorldBounds', true);
    persephone.bullets.setAll('outOfBoundsKill', true);
    persephone.bullets.setAll('anchor.x', 0.5);
    persephone.bullets.setAll('anchor.y', 0.5);

    //attacks
    persephone.ramAttack = false;
    persephone.invulnerability = false;
    persephone.phase1 = false;
    persephone.phase2 = false;
    persephone.phase3 = false;
}

function handlePersephone(enemy) {
    enemy.animations.play('persephoneidle');
    var random = Math.random() * 5
    if (random < 2) {
        whale_2.play();
    }
    if (enemy.shield == false) {
        enemy.currentRadius = enemy.currentRadius - enemy.rate;
        enemy.body.setCircle(enemy.currentRadius);
        enemy.body.setCollisionGroup(enemyCollisionGroup);
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
    } else {
        enemy.currentRadius = enemy.width;
        enemy.body.isVulnerable = false;
    }

    enemy.body.rotation = game.physics.arcade.angleBetween(enemy, player) + game.math.degToRad(-90);;
    game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 50);
    if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 200) {
        if (enemy.ramAttack == false) {
            currentrotation = enemy.body.rotation;
            enemy.ramAttack = true;
        } else {
            enemy.body.velocity.x = 500 * Math.cos(currentrotation);
            enemy.body.velocity.y = 500 * Math.sin(currentrotation);
            angle = game.physics.arcade.angleBetween(enemy, player);
            var bubblebullet = enemy.bullets.getFirstExists(false);
            if (bubblebullet) {
                whale_shoot.play();
                game.physics.p2.enable(bubblebullet, true);
                bubblebullet.enemyType = "enemyBullet";
                bubblebullet.body.fixedRotation = true;
                bubblebullet.lifespan = 2000;
                bubblebullet.reset(enemy.x, enemy.y);
                bubblebullet.rotation = angle + game.math.degToRad(-90);;
                bubblebullet.body.velocity.x = 400 * Math.cos(angle);
                bubblebullet.body.velocity.y = 400 * Math.sin(angle);
                bubblebullet.isVulnerable = true;
                bubblebullet.body.setCircle(10)
                bubblebullet.body.setCollisionGroup(enemybulletCollisionGroup);
                bubblebullet.body.collides([borderCollisionGroup])
                bubblebullet.body.collides(swordCollisionGroup, parryBullets, this);
                bubblebullet.body.collides(playerCollisionGroup, takeBulletDamage, this);
                bubblebullet.body.collides(bulletCollisionGroup, destroyBullets, this);
            }
        }
    } else {
        game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 300);
        enemy.ramAttack = false;
    }
    if (enemy.phase1 == false && enemy.health < 15) {
        spawnTowers(8, 'bubbleTower');
        enemy.phase1 = true;
    }
    if (enemy.phase2 == false && enemy.health < 10) {
        spawnSlimes(8, 'blueSlime');
        enemy.phase2 = true;
    }
    if (enemy.phase3 == false && enemy.health < 5) {
        spawnTenctales(6);
        player.tentaclecount = 6;
        enemy.shield = true;
        enemy.phase3 = true;
    }
    if (player.tentaclecount == 0) {
        enemy.shield = false;
    } else if (enemy.enemyType == "tentacles") {
        enemy.animations.play('tentacleidle');
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
    }
}
