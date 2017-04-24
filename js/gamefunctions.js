function initPlayer() {
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
    player.ultimate = 0;
    player.ultimateBar = game.add.sprite(3, 30, 'ultimatebar');
    player.ultimateBar.height = 20;
    player.ultimateBar.width = (player.ultimate / 10) * 100;
    player.ultimateBar.fixedToCamera = true;
    ultimateBarInvert = game.add.sprite(3, 30, 'ultimatebarInvert');
    ultimateBarInvert.height = 20;
    ultimateBarInvert.width = 100;
    ultimateBarInvert.fixedToCamera = true;
    player.ultimateBar.bringToTop();
    player.tentaclecount = 0;

    game.physics.p2.enable(player, true);
    player.body.setCircle(20);
    player.health = 10;
    player.body.setCollisionGroup(playerCollisionGroup);
    //the camera will follow the player in the world
    game.camera.follow(player);
}

function initAudio() {
    //Level 1
    fire_tower = game.add.audio('fire_tower');
    fire_tower_2 = game.add.audio('fire_tower_2');
    //Level 2
    water_tower = game.add.audio('water_tower');
    whale_hurt = game.add.audio('whale_hurt');
    whale_1 = game.add.audio('whale_1');
    whale_2 = game.add.audio('whale_2');
    whale_shoot = game.add.audio('whale_shoot');
    //Level 3

    //Pandora Sounds
    pandora_damaged = game.add.audio('pandora_damaged');
    pandora_sword = game.add.audio('pandora_sword');
    pandora_shoot = game.add.audio('pandora_shoot');

    //General Sounds
    slime_hurt = game.add.audio('slime_hurt');
    slime_1 = game.add.audio('slime_1');
    slime_2 = game.add.audio('slime_2');
    slime_3 = game.add.audio('slime_3');

    tower_damaged = game.add.audio('tower_damaged');
    tower_block = game.add.audio('tower_block');
}

function initEnemies(slimeName, towerName, numSlimes, numTowers) {
    enemies = game.add.group();
    //enemies.enableBody = true;
    spawnSlimes(numSlimes, slimeName);
    spawnTowers(numTowers, towerName);

}

function killEnemies(body1, body2) {
    body2.sprite.kill();
    if (body1.isVulnerable == true) {
        if (player.ultimate < 10) {
            player.ultimate++;
            player.ultimateBar.width = (player.ultimate / 10) * 100;
        }
        if (body1.sprite.health == 1) {
            body1.clearShapes();
            if (body1.sprite.enemyType == "tower") {
                body1.sprite.healthbar.kill();
                tower_damaged.play();
            }
            if (body1.sprite.enemyType == "slime") {
                slime_hurt.play();
            }
            if (body1.sprite.enemyType == "tentacles") {
                player.tentaclecount--;
            }
            if (body1.sprite.enemyType == "persephone") {
                player.bossAlive = false;
                body1.sprite.healthbar.kill();
            }
            body1.sprite.destroy();
        } else {
            body1.sprite.health--;
            if (body1.sprite.enemyType == "tower") {
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 50;
                tower_damaged.play();
            } else if (body1.sprite.enemyType == "persephone") {
                whale_hurt.play();
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            }
        }
    } else {
        var currentGameState = this.game.state.current;
        if (body1.sprite.enemyType == "slime") {
            switch (currentGameState) {
                case "Game":
                    slime_1.play();
                    break;
                case "Level2":
                    slime_2.play();

                    break;
                case "Level3":
                    slime_3.play();
                    break;
                default:
            }
        }
        if (body1.sprite.enemyType == "tower") {
            tower_block.play();
        }
    }
}

function smackEnemies(body1, body2) {
    if (shield > 0) {
        if (body1.isVulnerable == true) {
            if (player.ultimate < 10) {
                player.ultimate++;
                player.ultimateBar.width = (player.ultimate / 10) * 100;
            }
            if (body1.sprite.health == 1) {
                body1.clearShapes();
                body1.sprite.destroy();
                slime_hurt.play();
            } else {
                body1.sprite.health--;
            }
        }
        shield--;
    } else {
        player.body.removeShape(swordhitbox);
        swung = false;
    }
}

function bounce(body1, body2) {
    var num = Math.random();
    if (num < 0.25) {
        body1.moveUp(500);
    } else if (num >= 0.25 && num <= 0.50) {
        body1.moveDown(500);
    } else if (num >= 0.5 && num <= 0.75) {
        body1.moveLeft(500);
    } else {
        body1.moveRight(500);
    }
}

function handleEnemies() {
    handleEnemyMovements();
}

function handleEnemyMovements() {
    enemies.forEach(function(enemy) {
        if (enemy.enemyType == "slime") {
            enemy.animations.play('slimeIdle');
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
            if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 80) {
                game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 200);
            }
        } else if (enemy.enemyType == "tower") {
            enemy.animations.play('toweridle', 10);
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
            if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 500) {
                fireEnemyBullet(enemy);
            }
        } else if (enemy.enemyType == "persephone") {
            handlePersephone(enemy);
        }
    }, this);
}


function spawnTowers(NumberOfTowers, towerName) {
    for (var i = 0; i < NumberOfTowers; i++) {
        var towers = enemies.create(game.world.centerX + (-500 + Math.random() * 1000), game.world.centerY + (-500 + Math.random() * 1000), towerName);
        var arr = [];
        for (var j = 0; j < 17; j++) {
            arr.push(j);
        }
        towers.maxhealth = 3;
        towers.health = 3;
        healthbar = game.add.sprite(towers.x - 25, towers.y - 50, 'healthbar');
        healthbar.height = 10;
        healthbar.width = (towers.health / towers.maxhealth) * 50;
        towers.healthbar = healthbar;
        towers.enemyType = "tower";
        towers.animations.add('toweridle', arr, 12, true);
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
        switch (towerName) {
            case 'bubbleTower':
                towers.bullets.createMultiple(5, 'bubblebullet');
                break;
            case 'fireballTower':
                towers.bullets.createMultiple(5, 'fireBullet');
                break;
            default:
        }

        towers.bullets.setAll('checkWorldBounds', true);
        towers.bullets.setAll('outOfBoundsKill', true);
        towers.bullets.setAll('anchor.x', 0.5);
        towers.bullets.setAll('anchor.y', 0.5);

        towers.enemyType = "tower";
        towers.rate = Math.random() * 0.4 + 0.1
    }
}

function spawnSlimes(NumberOfSlimes, slimeName) {
    for (var i = 0; i < NumberOfSlimes; i++) {
        var slime = enemies.create(game.world.centerX + (-500 + Math.random() * 1000), game.world.centerY + (-500 + Math.random() * 1000), slimeName);
        var arr = [];
        for (var j = 0; j < 22; j++) {
            arr.push(j);
        }
        slime.mass = 5;
        slime.health = 1;
        slime.animations.add('slimeIdle', arr, 12, true);
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
        slime.rate = Math.random() * 0.4 + 0.1
        var num = Math.random();
        if (num < 0.25) {
            slime.body.moveUp(500);
        } else if (num >= 0.25 && num <= 0.50) {
            slime.body.moveDown(500);
        } else if (num >= 0.5 && num <= 0.75) {
            slime.body.moveLeft(500);
        } else {
            slime.body.moveRight(500);
        }
        //slime.body.static = true;
    }
}

function spawnTenctales(NumberOfTentacles) {
    for (var i = 0; i < NumberOfTentacles; i++) {
        var tentacles = enemies.create(game.world.centerX + (-500 + Math.random() * 1000), game.world.centerY + (-500 + Math.random() * 1000), 'tentacles');
        var arr = [];
        for (var j = 0; j < 3; j++) {
            arr.push(j);
        }
        tentacles.maxhealth = 1;
        tentacles.health = 1
        tentacles.enemyType = "tentacles";
        tentacles.animations.add('tentacleidle', arr, 12, true);
        tentacles.currentRadius = tentacles.width;
        game.physics.p2.enable(tentacles, true);
        tentacles.body.static = true;
        tentacles.body.setCircle(50);
        tentacles.body.setCollisionGroup(enemyCollisionGroup);
        tentacles.body.collides(swordCollisionGroup, smackEnemies, this);
        tentacles.body.collides(playerCollisionGroup, takeDamage, this);
        tentacles.body.collides(bulletCollisionGroup, killEnemies, this);
        tentacles.body.collides([enemyCollisionGroup, borderCollisionGroup, playerCollisionGroup]);

        tentacles.rate = Math.random() * 0.4 + 0.1
    }
}

function fireEnemyBullet(enemy) {
    angle = Math.random() * Math.PI * 2;
    var enemyBullet = enemy.bullets.getFirstExists(false);
    var currentGameState = this.game.state.current;
    if (enemyBullet) {
        var random = Math.random();
        switch (currentGameState) {
            case "Game":
                if (random > 0.5) {
                    fire_tower.play();
                } else {
                    fire_tower_2.play();
                }
                break;
            case "Level2":
                water_tower.play();
                break;
            case "Level3":
                break;
            default:
        }
        game.physics.p2.enable(enemyBullet, true);
        enemyBullet.enemyType = "enemyBullet";
        enemyBullet.body.fixedRotation = true;
        enemyBullet.lifespan = 2000;
        enemyBullet.reset(enemy.x, enemy.y);
        enemyBullet.rotation = angle;
        enemyBullet.body.velocity.x = 250 * Math.cos(angle + game.math.degToRad(-270));
        enemyBullet.body.velocity.y = 250 * Math.sin(angle + game.math.degToRad(-270));
        enemyBullet.isVulnerable = true;
        enemyBullet.body.setCircle(10);
        enemyBullet.body.setCollisionGroup(enemybulletCollisionGroup);
        enemyBullet.body.collides([borderCollisionGroup]);
        enemyBullet.body.collides(swordCollisionGroup, parryBullets, this);
        enemyBullet.body.collides(playerCollisionGroup, takeBulletDamage, this);
        enemyBullet.body.collides(bulletCollisionGroup, destroyBullets, this);
    }

}

function destroyBullets(body1, body2) {
    if (player.ultimate < 10) {
        player.ultimate++;
        player.ultimateBar.width = (player.ultimate / 10) * 100;
    }
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
    } else {
        player.body.removeShape(swordhitbox);
        swung = false;
    }
}

function takeDamage(body1, body2) {
    // decrement health, handle heart graphic in update
    if (player.health > 0) {
        if (invulnerability == false) {
            hearts.children[player.health - 1].kill();
            player.health--;
            pandora_damaged.play();
            invulnerability = true;
            game.time.events.add(500, removeInvulnerability, this);
        }
    }

    function removeInvulnerability() {
        invulnerability = false;
    }
}

function takeBulletDamage(body1, body2) {
    body1.sprite.kill()
        // decrement health, handle heart graphic in update
    if (player.health > 0) {
        if (invulnerability == false) {
            hearts.children[player.health - 1].kill();
            player.health--;
            pandora_damaged.play();
            invulnerability = true;
            game.time.events.add(500, removeInvulnerability, this);
        }
    }

    function removeInvulnerability() {
        invulnerability = false;
    }
}

function ultimateReady() {
    var handle;
    var handle2;
    if (player.ultimate == 10) {
        handle = setInterval(function() {
            ultimateBarInvert.bringToTop();
            if (player.ultimate != 10) {
                clearInterval(handle);
                handle = 0;
            }
        }, 20);
        handle2 = setInterval(function() {
            player.ultimateBar.bringToTop();
            if (player.ultimate != 10) {
                clearInterval(handle2);
                handle2 = 0;
            }
        }, 50);
    }
}

function useUltimate() {
    if (player.ultimate == 10) {
        invulnerability = true;
        player.ultimate = 0;
        player.ultimateBar.width = (player.ultimate / 10) * 100;
        player.body.setCircle(200);
        player.body.setCollisionGroup(playerCollisionGroup);
        game.time.events.add(500, removeInvulnerability, this);
    } else {
        console.log("Not enough energy");
    }

    function removeInvulnerability() {
        player.body.setCircle(20);
        player.body.setCollisionGroup(playerCollisionGroup);
        invulnerability = false;
    }
}

function resetHealth() {
    player.health = 10;
    hearts.removeAll();
    for (var i = 0; i < player.health; i++) {
        var heart = hearts.create(i * 30, 0, 'heart');
        heart.fixedToCamera = true;
    }
}

function handleUpdate() {
    ultimateReady();
    if (player.dead == 0) {
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
        if (cursors.R.isDown) {
            useUltimate();
        }
        //Cheats
        if (cursors.I.isDown) {
            invulnerability = true;
            console.log("Invulnerability is on.")
            game.time.events.add(6000, function() {
                invulnerability = false;
                console.log("Invulnerability is off.")
            }, this);

        }
        if (cursors.K.isDown) {
            enemies.forEach(function(enemy) {
                //enemy.destroy();
            });
        }
        if (game.input.mousePointer.leftButton.isDown) {
            if (game.time.now > nextFire && bullets.countDead() > 0) {
                pandora_shoot.play();
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
                    bullet.body.collides([enemyCollisionGroup, borderCollisionGroup, swordCollisionGroup, enemybulletCollisionGroup])
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
                    pandora_sword.play();
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

}

function endGame(level) {
    if (level == "Level1") {
        if (enemies.length == 0) {
            player.bossAlive = true;
            //spawnboss
        }
        if (player.bossAlive == false) {
            setTimeout(function() {
                game.state.start('MainMenu');
            }, 2000);
        }
    }
    if (level == "Level2") {
        if (enemies.length == 0) {
            spawnPersephone();
            whale_1.play();
            resetHealth();
            player.bossAlive = true;
        }
        if (player.bossAlive == false) {
            setTimeout(function() {
                game.state.start('MainMenu');
            }, 2000);
        }
    }

    if (player.health <= 0 && player.dead == 0) {
        player.animations.play('death');
        player.body.clearShapes();
        player.dead = 1;

        setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }
}
