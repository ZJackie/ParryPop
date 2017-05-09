var toggle = false; //used to handle godmode toggle
var hadesFire = 0; //hades phase 3 fire rate
var shotsFiredText;

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

    player.bossAlive = true;
    player.dead = 0;
    player.isDead = false;
    player.stun = false;
    player.ultimate = 0;
    player.isUlted = false;
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
    player.godmode = false;
    player.shotsFired = 0;
    var style = { font: "32px Arial", fill: "#FFF", align: "center" };
    shotsFiredText = game.add.text(game.width - 250, 0, "Shots Fired: " + player.shotsFired, style);
    shotsFiredText.fixedToCamera = true;

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
    cerberus_fire_storm = game.add.audio('cerberus_fire_storm');
    cerberus_damaged = game.add.audio('cerberus_damaged');

    //Level 2
    water_tower = game.add.audio('water_tower');
    whale_hurt = game.add.audio('whale_hurt');
    whale_1 = game.add.audio('whale_1');
    whale_2 = game.add.audio('whale_2');
    whale_shoot = game.add.audio('whale_shoot');
    jelly_zap = game.add.audio('jelly_zap');
    jelly_death = game.add.audio('jelly_death');

    //Level 3
    void_tower_attack = game.add.audio('void_tower_attack');
    hades_attack = game.add.audio('hades_attack');
    hades_tp = game.add.audio('hades_tp');
    hades_damaged = game.add.audio('hades_damaged');
    void_spawn = game.add.audio('void_spawn');
    bomb_explosion = game.add.audio('bomb_explosion');

    //Pandora Sounds
    pandora_damaged = game.add.audio('pandora_damaged');
    pandora_sword = game.add.audio('pandora_sword');
    pandora_shoot = game.add.audio('pandora_shoot');

    //General Sounds
    slime_hurt = game.add.audio('slime_hurt');
    slime_hurt_2 = game.add.audio('slime_hurt_2');
    slime_1 = game.add.audio('slime_1');
    slime_2 = game.add.audio('slime_2');
    slime_3 = game.add.audio('slime_3');

    tower_damaged = game.add.audio('tower_damaged');
    tower_block = game.add.audio('tower_block');
    boss_block = game.add.audio('boss_block');
}

//spawns all slimes and towers for the current level
function initEnemies(slimeName, towerName, numSlimes, numTowers) {
    enemies = game.add.group();
    //enemies.enableBody = true;

    spawnSlimes(numSlimes, slimeName);
    spawnTowers(numTowers, towerName);

}

function spawnCerberus() {
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;
    var cerberus = enemies.create(game.world.centerX, game.world.centerY, 'cerberus');

    cerberus.mass = 200;
    cerberus.maxhealth = 20;
    cerberus.health = 20;

    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (cerberus.health / cerberus.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    cerberus.healthbar = healthbar;

    //animations
    var arr = [];
    for (var j = 0; j < 6; j++) {
        arr.push(j);
    }
    cerberus.animations.add('cerberusidle', arr, 12, true);
    cerberus.currentRadius = cerberus.width;
    game.physics.p2.enable(cerberus, true);
    cerberus.body.setCircle(60);
    cerberus.body.setCollisionGroup(enemyCollisionGroup);
    cerberus.body.collides(swordCollisionGroup, smackEnemies, this);
    cerberus.body.collides(playerCollisionGroup, takeDamage, this);
    cerberus.body.collides(bulletCollisionGroup, killEnemies, this);
    cerberus.body.collides(borderCollisionGroup);
    cerberus.body.collides(playerCollisionGroup);
    cerberus.enemyType = "cerberus";
    cerberus.rate = 0.5;
    cerberus.body.static = true;

    //bullets
    cerberus.bullets = game.add.group();
    cerberus.bullets.enableBody = true;
    cerberus.bullets.physicsBodyType = Phaser.Physics.P2JS;
    cerberus.bullets.createMultiple(5, 'fireBullet');
    cerberus.bullets.setAll('checkWorldBounds', true);
    cerberus.bullets.setAll('outOfBoundsKill', true);
    cerberus.bullets.setAll('anchor.x', 0.5);
    cerberus.bullets.setAll('anchor.y', 0.5);

    //attacks
    cerberus.phase1 = false;
    cerberus.phase2 = false;
    cerberus.phase3 = false;
}

function spawnPersephone() {
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;
    var persephone = enemies.create(game.world.centerX + (-500 + Math.random() * 1000),
        game.world.centerY + (-500 + Math.random() * 1000), 'persephone');

    persephone.mass = 20;
    persephone.maxhealth = 20;
    persephone.health = 20;

    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (persephone.health / persephone.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    persephone.shield = false;
    persephone.healthbar = healthbar;

    //aniamtions
    var arr = [];
    for (var j = 0; j < 4; j++) {
        arr.push(j);
    }
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

function spawnHades() {
    hades_damaged.play();
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;
    var hades = enemies.create(game.world.centerX, game.world.centerY, 'hades');
    hades.mass = 20;
    hades.maxhealth = 20;
    hades.health = 20;

    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (hades.health / hades.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    hades.shield = false;
    hades.healthbar = healthbar;

    //animations
    var arr = [];
    for (var j = 0; j < 3; j++) {
        arr.push(j);
    }
    hades.animations.add('hadesidle', arr, 12, true);
    arr = [];
    for (var j = 0; j < 12; j++) {
        arr.push(j);
    }
    hades.animations.add('hades_tp', arr, 12, true);

    hades.currentRadius = hades.width;
    game.physics.p2.enable(hades, true);
    hades.body.setCircle(60);
    hades.body.setCollisionGroup(enemyCollisionGroup);
    hades.body.collides(swordCollisionGroup, smackEnemies, this);
    hades.body.collides(playerCollisionGroup, takeDamage, this);
    hades.body.collides(bulletCollisionGroup, killEnemies, this);
    hades.body.collides(borderCollisionGroup);
    hades.body.collides(playerCollisionGroup);
    hades.enemyType = "hades";
    hades.rate = 0.4;
    hades.body.static = true;

    //bullets
    hades.bullets = game.add.group();
    hades.bullets.enableBody = true;
    hades.bullets.physicsBodyType = Phaser.Physics.P2JS;
    hades.bullets.createMultiple(25, 'voidBullet');
    hades.bullets.setAll('checkWorldBounds', true);
    hades.bullets.setAll('outOfBoundsKill', true);
    hades.bullets.setAll('anchor.x', 0.5);
    hades.bullets.setAll('anchor.y', 0.5);

    //attacks
    hades.nextTp = 0;
    hades.tpRate = 4500;
    hades.invulnerability = false;
    hades.phase1 = false;
    hades.phase2 = false;
    hades.phase3 = false;
}

//Damages enemies, kills them if they have been damaged to 0 health
//body1 is the body being damaged
//body2 is the body used to do damage
function killEnemies(body1, body2) {
    //destroys bullet
    body2.sprite.kill();
    //damages enemies if they are vulnerable and destroys them
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
                switch (this.game.state.current) {
                    case "Level1":
                        slime_hurt.play();
                        break;
                    case "Level2":
                        slime_hurt.play();
                        break;
                    case "Level3":
                        slime_hurt_2.play();
                        break;
                    default:
                }
            }
            if (body1.sprite.enemyType == "jellyfish") {
                jelly_death.play();
            }
            if (body1.sprite.enemyType == "bomb") {
                bomb_explosion.play();
            }
            if (body1.sprite.enemyType == "tentacles") {
                player.tentaclecount--;
            }
            //once bosses are deadm init level complete screen
            if (body1.sprite.enemyType == "persephone") {
                player.bossAlive = false;
                body1.sprite.healthbar.kill();
                game.time.events.add(1500, function() {
                    initLevelCompleteMenu();
                }, this);
            }
            if (body1.sprite.enemyType == "cerberus") {
                player.bossAlive = false;
                body1.sprite.healthbar.kill();
                game.time.events.add(1500, function() {
                    initLevelCompleteMenu();
                }, this);
            }
            if (body1.sprite.enemyType == "hades") {
                player.bossAlive = false;
                body1.sprite.healthbar.kill();
                game.time.events.add(1500, function() {
                    initGameCompleteMenu();
                }, this);
            }
            body1.sprite.destroy();
            //else just damage them if they have >1 health left and play damage sound
        } else {
            body1.sprite.health--;
            if (body1.sprite.enemyType == "tower") {
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 50;
                tower_damaged.play();
            } else if (body1.sprite.enemyType == "persephone") {
                whale_hurt.play();
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            } else if (body1.sprite.enemyType == "cerberus") {
                cerberus_damaged.play();
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            } else if (body1.sprite.enemyType == "hades") {
                hades_damaged.play();
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            }
        }
    } else {
        //sounds for when enemies block
        var currentGameState = this.game.state.current;
        if (body1.sprite.enemyType == "slime") {
            switch (currentGameState) {
                case "Level1":
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
        if (body1.sprite.enemyType == "cerberus" || body1.sprite.enemyType == "persephone" || body1.sprite.enemyType == "hades") {
            boss_block.play();
        }
    }
}

//damage enemies with player sword (body2)
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

//handler for slime movement
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

//handles all enemy movements and actions
function handleEnemies() {
    enemies.forEach(function(enemy) {
        //handle slime movements and actions
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
            //handle tower actions
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
                if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 500) {
                    fireEnemyBullet(enemy);
                }
            }

            //handle all boss fights
        } else if (enemy.enemyType == "jellyfish") {
            enemy.animations.play('jellyfishIdle');
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
            if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 200) {
                game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 250);
            }
        } else if (enemy.enemyType == "bomb") {
            enemy.animations.play('bombIdle');
            enemy.currentRadius = enemy.currentRadius - enemy.rate;
            enemy.body.setCircle(enemy.currentRadius);
            enemy.body.setCollisionGroup(enemyCollisionGroup);
            var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 3;
            var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
            if (enemy.currentRadius <= lowerBound) {
                enemy.currentRadius = enemy.width;
            }

            if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
                enemy.body.isVulnerable = true;
            } else {
                enemy.body.isVulnerable = false;
            }
            if (enemy.detonate == true) {
                game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 500);
            } else if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 200) {
                game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 500);
            }
            if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 50) {
                game.time.events.add(300, function() {
                    enemy.destroy();
                    explode();
                }, this);
                enemy.animations.play('bombExplode');
                bomb_explosion.play();
            }
        } else if (enemy.enemyType == "cerberus") {
            handleCerberus(enemy);
        } else if (enemy.enemyType == "persephone" || enemy.enemyType == "tentacles") {
            handlePersephone(enemy);
        } else if (enemy.enemyType == "hades") {
            handleHades(enemy);
        }
    }, this);
}

//spawns towers with default health of 3
function spawnTowers(NumberOfTowers, towerName, health = 3) {
    //creates towers that spawn at random locations
    for (var i = 0; i < NumberOfTowers; i++) {
        var towers = enemies.create(game.world.centerX + (-500 + Math.random() * 1000),
            game.world.centerY + (-500 + Math.random() * 1000), towerName);

        var arr = [];
        for (var j = 0; j < 17; j++) {
            arr.push(j);
        }
        towers.maxhealth = 3;
        towers.health = health;
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
        //handle tower bullets
        towers.bullets = game.add.group();
        towers.bullets.enableBody = true;
        towers.bullets.physicsBodyType = Phaser.Physics.P2JS;
        //Different levels will have different towers, and bullets
        switch (towerName) {
            case 'bubbleTower':
                towers.bullets.createMultiple(5, 'bubblebullet');
                break;
            case 'fireballTower':
                towers.bullets.createMultiple(5, 'fireBullet');
                break;
            case 'voidTower':
                towers.bullets.createMultiple(8, 'voidBullet');
                break;
            default:
        }

        towers.bullets.setAll('checkWorldBounds', true);
        towers.bullets.setAll('outOfBoundsKill', true);
        towers.bullets.setAll('anchor.x', 0.5);
        towers.bullets.setAll('anchor.y', 0.5);

        towers.enemyType = "tower";
        towers.rate = Math.random() * 0.4 + 0.15;
    }
}

//spawns slimes at random locations
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
        slime.rate = Math.random() * 0.4 + 0.1;
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

//spawns bombs at random locations
function spawnJellyfish(NumberOfJellyfish, Jellyfish) {
    for (var i = 0; i < NumberOfJellyfish; i++) {
        location1 = Math.random() * 1000;
        location2 = Math.random() * 1000;
        while (location1 > 400 && location1 < 600) {
            location1 = Math.random() * 1000;
        }
        while (location2 > 400 && location1 < 600) {
            location1 = Math.random() * 1000;
        }
        var jellyfish = enemies.create(game.world.centerX + (-500 + location1), game.world.centerY + (-500 + location2), Jellyfish);
        var arr = [];
        for (var j = 0; j < 3; j++) {
            arr.push(j);
        }
        jellyfish.mass = 5;
        jellyfish.health = 1;
        jellyfish.animations.add('jellyfishIdle', arr, 12, true);
        jellyfish.currentRadius = jellyfish.width;
        game.physics.p2.enable(jellyfish, true);
        //jellyfish.body.static = true;
        jellyfish.body.setCircle(30);
        jellyfish.body.setCollisionGroup(enemyCollisionGroup);
        jellyfish.body.collides(swordCollisionGroup, smackEnemies, this);
        jellyfish.body.collides(playerCollisionGroup, takeDamage, this);
        jellyfish.body.collides(bulletCollisionGroup, killEnemies, this);
        jellyfish.body.collides(borderCollisionGroup);
        jellyfish.body.collides([enemyCollisionGroup, playerCollisionGroup]);
        jellyfish.enemyType = "jellyfish";
        jellyfish.rate = Math.random() * 0.4 + 0.1;
        var num = Math.random();
        if (num < 0.25) {
            jellyfish.body.moveUp(200);
        } else if (num >= 0.25 && num <= 0.50) {
            jellyfish.body.moveDown(200);
        } else if (num >= 0.5 && num <= 0.75) {
            jellyfish.body.moveLeft(200);
        } else {
            jellyfish.body.moveRight(200);
        }
        //slime.body.static = true;
    }
}

//spawns bombs
function spawnbomb(NumberOfbomb, bombName) {
    for (var i = 0; i < NumberOfbomb; i++) {
        location1 = Math.random() * 1000
        location2 = Math.random() * 1000
        while (location1 > 300 && location1 < 700) {
            location1 = Math.random() * 1000
        }
        while (location2 > 300 && location1 < 700) {
            location1 = Math.random() * 1000
        }
        var bomb = enemies.create(game.world.centerX + (-500 + location1), game.world.centerY + (-500 + location2), bombName);
        bomb.health = 1;
        bomb.detonate = false;
        var arr = [];
        for (var j = 9; j < 17; j++) {
            arr.push(j);
        }
        bomb.animations.add('bombExplode', arr, 12, true);
        arr = [];
        for (var j = 0; j < 8; j++) {
            arr.push(j);
        }
        bomb.animations.add('bombIdle', arr, 12, true);
        bomb.currentRadius = bomb.width;
        game.physics.p2.enable(bomb, true);
        bomb.body.setCircle(30);
        bomb.body.setCollisionGroup(enemyCollisionGroup);
        bomb.body.collides(swordCollisionGroup, smackEnemies, this);
        bomb.body.collides(playerCollisionGroup, takeDamage, this);
        bomb.body.collides(bulletCollisionGroup, killEnemies, this);
        bomb.body.collides(borderCollisionGroup);
        bomb.body.collides([enemyCollisionGroup, playerCollisionGroup]);
        bomb.body.static = true;
        bomb.enemyType = "bomb";
        bomb.rate = Math.random() * 0.2 + 0.05
    }
}

//spawns tentacles for 3rd persephone boss phase
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
        tentacles.rate = Math.random() * 0.4 + 0.2;
    }
}

//Handles projectiles that are fired by enemy towers
function fireEnemyBullet(enemy) {
    angle = Math.random() * Math.PI * 2;
    var enemyBullet = enemy.bullets.getFirstExists(false);
    var currentGameState = this.game.state.current;
    if (enemyBullet) {
        var random = Math.random();
        switch (currentGameState) {
            case "Level1":
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
                if (random > 0.5) {
                    void_tower_attack.play();
                }
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

//destroys bullets that the player fires at
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

//called when the user parries bullets
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

//called when the player takes damage from colliding with enemies
function takeDamage(body1, body2) {
    // decrement health, handle heart graphic in update
    if (player.health > 0) {
        if (invulnerability == false && player.godmode == false) {
            hearts.children[player.health - 1].kill();
            player.health--;
            pandora_damaged.play();
            invulnerability = true;
            game.time.events.add(500, removeInvulnerability, this);
        }
        if (body1.sprite.enemyType == "jellyfish" && !player.isUlted) {
            jelly_zap.play();
            body1.sprite.destroy();
            //only stun if not stunned 
            if (player.stun == false) {
                writeText("Stunned!", 3000);
                stunTimer(3000);
                player.stun = true;
                game.time.events.add(3000, removestun, this);
            }
        }
    }

    function removestun() {
        player.stun = false;
    }

    function removeInvulnerability() {
        invulnerability = false;
    }
}

//bombs explode 
function explode() {
    if (invulnerability == false && player.godmode == false) {
        hearts.children[player.health - 1].kill();
        player.health--;
        pandora_damaged.play();
        invulnerability = true;
        if (!player.stun) {
            player.stun = true;
            game.time.events.add(500, function() {
                player.stun = false;
            }, this);
        }
        game.time.events.add(1000, function() {
            invulnerability = false;
        }, this);
    }
}

//called when the player takes damage from other bullets
function takeBulletDamage(body1, body2) {
    body1.sprite.kill()
        // decrement health, handle heart graphic in update
    if (player.health > 0) {
        if (invulnerability == false && player.godmode == false) {
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

//makes the ultimate bar flash, to signal that its ready
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

//allows the player to generate a brief shield that repels enemies
function useUltimate() {
    if (player.ultimate == 10) {
        invulnerability = true;
        player.ultimate = 0;
        player.isUlted = true;
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
        player.isUlted = false;
    }
}

//resets player health, used when the boss spawns
function resetHealth() {
    player.health = 10;
    hearts.removeAll();
    for (var i = 0; i < player.health; i++) {
        var heart = hearts.create(i * 30, 0, 'heart');
        heart.fixedToCamera = true;
    }
}

//function called every update / handles all game actions 
function handleUpdate() {
    ultimateReady();
    if (player.dead == 0) {
        //player movement
        pointerangle = game.physics.arcade.angleToPointer(player) + game.math.degToRad(-90);
        player.body.rotation = pointerangle;
        player.body.setZeroVelocity();
        if (player.stun == false) {
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
        }
        //allows player to use ultimate
        if (cursors.R.isDown) {
            useUltimate();
        }
        //Cheats
        //Godmode
        if (!toggle) {
            if (cursors.I.isDown) {
                toggle = !toggle;
                player.godmode = !player.godmode;
                writeText("Godmode: " + player.godmode, 1000);
                game.time.events.add(1000, function() { toggle = !toggle; }, this);
            }
        }
        //kill-all command
        if (cursors.K.isDown) {
            enemies.forEach(function(enemy) {
                if (enemy.enemyType == 'tower') {
                    enemy.body.clearShapes();
                    enemy.healthbar.width = 0;
                    enemy.destroy;
                }
                if (enemy.enemyType != "tentacles" && enemy.enemyType != "persephone" && enemy.enemyType != "cerberus" && enemy.enemyType != "hades") {
                    enemy.body.clearShapes();
                    enemy.destroy();
                }
            });
        }
        //Level switching
        if (cursors.ONE.isDown) {
            this.game.state.start('Level1');
        }
        if (cursors.TWO.isDown) {
            this.game.state.start('Level2');
        }
        if (cursors.THREE.isDown) {
            this.game.state.start('Level3');
        }
        //player shoots bullet
        if (game.input.mousePointer.leftButton.isDown) {
            if (game.time.now > nextFire && bullets.countDead() > 0) {
                player.shotsFired++;
                shotsFiredText.setText("Shots Fired: " + player.shotsFired);
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
                    bullet.body.setCircle(10);
                    bullet.body.setCollisionGroup(bulletCollisionGroup);
                    bullet.body.collides([enemyCollisionGroup, borderCollisionGroup, swordCollisionGroup, enemybulletCollisionGroup])
                    player.animations.play('shoot', false);
                    //bullet.body.collides(enemyCollisionGroup, killEnemies, this);
                    //game.physics.arcade.velocityFromRotation(game.physics.arcade.angleToPointer(player), bulletspeed, bullet.body.velocity);
                }
            }
        }
        //sword
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

//Handles boss spawning for the end of the level (if all enemies are slain)
function endGame(level) {
    if (level == "Level1") {
        if (enemies.length == 0 && player.bossAlive != false) {
            writeText("Cerberus has awoken!", 3000);
            spawnCerberus();
            resetHealth();
        }
    } else if (level == "Level2") {
        if (enemies.length == 0 && player.bossAlive != false) {
            writeText("Persephone emerges from the deep!", 3000);
            spawnPersephone();
            whale_1.play();
            resetHealth();
        }
    } else if (level == "Level3") {
        if (enemies.length == 0 && player.bossAlive != false) {
            writeText("Hades shall grant you death!", 3000);
            spawnHades();
            resetHealth();
        }
    }

    if (player.health <= 0 && player.dead == 0) {
        player.animations.play('death');
        player.body.clearShapes();
        player.dead = 1;
        player.isDead = true;

        setTimeout(function() {
            initDeathScreen();
        }, 2000);
    }
}

//Cerberus boss fight handler
function handleCerberus(enemy) {
    enemy.animations.play('cerberusidle');
    //decreases circle
    enemy.currentRadius = enemy.currentRadius - enemy.rate;
    enemy.body.setCircle(enemy.currentRadius);
    enemy.body.setCollisionGroup(enemyCollisionGroup);
    //handle circle
    var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 5;
    var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
    //sets circle back to width if <= lower bound
    if (enemy.currentRadius <= lowerBound) {
        enemy.currentRadius = enemy.width;
    }
    if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
        enemy.body.isVulnerable = true;
    } else {
        enemy.body.isVulnerable = false;
    }
    enemy.body.rotation = game.physics.arcade.angleBetween(enemy, player) + game.math.degToRad(-90);
    var chance = Math.random();
    if (chance > 0.5) {
        angle = game.physics.arcade.angleBetween(enemy, player) + Math.random();
    } else {
        angle = game.physics.arcade.angleBetween(enemy, player) - Math.random();
    }
    //Handle cerberus fire projectiles
    var fireBullet = enemy.bullets.getFirstExists(false);
    if (fireBullet) {
        fire_tower_2.play();
        game.physics.p2.enable(fireBullet, true);
        fireBullet.enemyType = "enemyBullet";
        fireBullet.body.fixedRotation = true;
        fireBullet.lifespan = 2000;
        fireBullet.reset(enemy.x, enemy.y);
        fireBullet.rotation = angle + game.math.degToRad(-90);;
        fireBullet.body.velocity.x = 400 * Math.cos(angle);
        fireBullet.body.velocity.y = 400 * Math.sin(angle);
        fireBullet.isVulnerable = true;
        fireBullet.body.setCircle(10)
        fireBullet.body.setCollisionGroup(enemybulletCollisionGroup);
        fireBullet.body.collides([borderCollisionGroup])
        fireBullet.body.collides(swordCollisionGroup, parryBullets, this);
        fireBullet.body.collides(playerCollisionGroup, takeBulletDamage, this);
        fireBullet.body.collides(bulletCollisionGroup, destroyBullets, this);
    }

    //different cerberus boss phases
    if (enemy.phase1 == false && enemy.health < 15) {
        writeText("Cerberus has spawned 5 Red Slimes!", 3000);
        spawnSlimes(5, 'redSlime');
        enemy.phase1 = true;
    }
    if (enemy.phase2 == false && enemy.health < 10) {
        writeText("Cerberus unleashes his flames!", 3000);
        cerberus_fire_storm.play();
        enemy.bullets.createMultiple(15, 'fireBullet');
        enemy.phase2 = true;
    }
    if (enemy.phase3 == false && enemy.health < 5) {
        writeText("Cerberus is enraged!", 3000);
        enemy.phase3 = true;
    }
    if(enemy.phase3 == true && enemy.health < 5) {
        game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 200);
        enemy.body.static = false;
    }
}

//Persephone boss fight handler
function handlePersephone(enemy) {
    if (enemy.enemyType == "persephone") {
        enemy.animations.play('persephoneidle');
        var random = Math.random() * 5;
        if (random < 2) {
            whale_2.play();
        }
        //if no shield, handle circle
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
                //handle persephone's bubble bullets
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

        //different persephone boss phases
        if (enemy.phase1 == false && enemy.health < 15) {
            writeText("Persephone has spawned 4 Bubble Towers and 6 Slimes!", 3000);
            spawnTowers(4, 'bubbleTower');
            spawnSlimes(6, 'blueSlime');
            enemy.phase1 = true;
        }
        if (enemy.phase2 == false && enemy.health < 10) {
            writeText("Persephone has spawned 6 Jellyfish!", 3000);
            spawnJellyfish(6, 'jelly');
            enemy.phase2 = true;
        }
        if (enemy.phase3 == false && enemy.health < 5) {
            writeText("Kill all 6 Tentacles to bring down Persephone's Shield!", 4500);
            spawnTenctales(6);
            player.tentaclecount = 6;
            enemy.shield = true;
            enemy.phase3 = true;
        }
        if (player.tentaclecount == 0 && enemy.phase3 == true) {
            writeText("Persephone's shield is down!", 3000);
            enemy.shield = false;
            player.tentaclecount--; // stops write text from looping
        }
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

//hades boss fight handler
function handleHades(enemy) {
    if (!enemy.phase1 && !enemy.phase2 && !enemy.phase3) {
        enemy.animations.play('hadesidle');
    }
    var randomSound = Math.random() * 20;
    //handle circle
    enemy.currentRadius = enemy.currentRadius - enemy.rate;
    enemy.body.setCircle(enemy.currentRadius);
    enemy.body.setCollisionGroup(enemyCollisionGroup);
    var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 5;
    var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
    //sets circle back to width if <= lower bound
    if (enemy.currentRadius <= lowerBound) {
        enemy.currentRadius = enemy.width;
    }
    if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
        enemy.body.isVulnerable = true;
    } else {
        enemy.body.isVulnerable = false;
    }
    enemy.body.rotation = game.physics.arcade.angleBetween(enemy, player) + game.math.degToRad(-90);

    //handle hades' void bulllets
    var voidBullet = enemy.bullets.getFirstExists(false);
    //fires projectiles in random directions
    if (voidBullet) {
        if (!hades_attack.isPlaying) {
            hades_attack.play();
        }
        angle = Math.random() * Math.PI * 2
        game.physics.p2.enable(voidBullet, true);
        voidBullet.enemyType = "enemyBullet";
        voidBullet.lifespan = 2000;
        voidBullet.reset(enemy.x, enemy.y);
        voidBullet.body.velocity.x = 400 * Math.cos(angle);
        voidBullet.body.velocity.y = 400 * Math.sin(angle);
        voidBullet.isVulnerable = true;
        voidBullet.body.setCircle(10)
        voidBullet.body.setCollisionGroup(enemybulletCollisionGroup);
        voidBullet.body.collides([borderCollisionGroup])
        voidBullet.body.collides(swordCollisionGroup, parryBullets, this);
        voidBullet.body.collides(playerCollisionGroup, takeBulletDamage, this);
        voidBullet.body.collides(bulletCollisionGroup, destroyBullets, this);
    }
    if (enemy.phase1 == false && enemy.health < 15) {
        writeText("Hades begins to teleport around the map!", 3000);
        spawnSlimes(3, 'glitchSlime');
        spawnJellyfish(3, "jelly");
        enemy.phase1 = true;
    }
    if (enemy.phase2 == false && enemy.health < 10) {
        writeText("Hades begins to teleport faster!", 3000);
        spawnSlimes(3, 'glitchSlime');
        spawnJellyfish(3, "jelly");
        enemy.tpRate = 2500;
        enemy.phase2 = true;
    }
    if (enemy.phase3 == false && enemy.health < 5) {
        writeText("Hades unleashes the void!! Enemies will keep spawning!", 4500);
        spawnSlimes(2, 'glitchSlime');
        spawnJellyfish(2, "jelly");
        spawnTowers(3, 'voidTower', 1);
        enemy.tpRate = 1500;
        enemy.phase3 = true;
    }
    //Hades randomly teleports around the map, faster with each phase
    if (enemy.phase1 == true || enemy.phase2 == true || enemy.phase3 == true) {
        if (game.time.now > enemy.nextTp) {
            enemy.nextTp = game.time.now + enemy.tpRate;
            hades_tp.play();
            //control hades tp animation depending on how fast he teleports
            if (enemy.phase1 == true && enemy.phase2 == false && enemy.phase3 == false) {
                enemy.animations.play('hades_tp', 2.44); // 11/4.5
            }
            if (enemy.phase1 == true && enemy.phase2 == true && enemy.phase3 == false) {
                enemy.animations.play('hades_tp', 4.33); // 11/2.5
            }
            if (enemy.phase1 == true && enemy.phase2 == true && enemy.phase3 == true) {
                enemy.animations.play('hades_tp', 7.33); // 11/1.5
            }
            enemy.body.x = (game.world.centerX + (-500 + Math.random() * 1000));
            enemy.body.y = (game.world.centerY + (-500 + Math.random() * 1000));
        }
        if (enemy.phase3 == true && game.time.now > hadesFire) {
            //spawns jelly and slime every 10 seconds
            writeText("Enemies Spawned!", 1000);
            void_spawn.play();
            hadesFire = game.time.now + 10000;
            spawnSlimes(1, 'glitchSlime');
            spawnJellyfish(1, "jelly");
        }
    }
}

//Pause menu once user presses 'ESC'
function initPauseMenu() {
    window.onkeydown = function(event) {
        //No point of having a pause menu if boss is dead or player is dead
        if (player.bossAlive && !player.isDead) {
            if (this.game.state.current == "Level1" || this.game.state.current == "Level2" || this.game.state.current == "Level3") {
                if (event.keyCode == 27) {
                    //switches focus to pause menu
                    if (!game.paused) {
                        game.time.events.add(100, function() {
                            game.paused = !game.paused;
                        }, this);
                        pauseMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'pauseMenu');
                        game.camera.follow(pauseMenu);
                        pauseMenu.anchor.setTo(.5, .5);
                        pauseMenu.inputEnabled = true;
                        game.input.onDown.add(pauseMenuHandler, this);
                        //unpauses the game and destroys all menus along with their handlers
                    } else {
                        game.paused = !game.paused;
                        game.camera.follow(player);
                        pauseMenu.destroy();
                        controlsMenu.destroy();
                        game.input.onDown.remove(pauseMenuHandler, this);
                        game.input.onDown.remove(controlsMenuHandler, this);
                    }
                }
            }
        }
    }
}

//handles pause menu input allowing a user to 
//resume, go to the help screen, or return to menu
function pauseMenuHandler(pointer, event) {
    var tileworldX = pointer.worldX - (pointer.worldX);
    var tileworldY = pointer.worldY - (pointer.worldY);
    var tileX = Math.floor(pointer.worldX);
    var tileY = Math.floor(pointer.worldY);
    //Resume
    if (tileX < 870 && tileX > 720 && tileY < 755 && tileY > 700) {
        game.paused = !game.paused;
        button.play();
        game.camera.follow(player);
        pauseMenu.destroy();
        game.input.onDown.remove(pauseMenuHandler, this);
    }
    //Help
    if (tileX < 870 && tileX > 720 && tileY < 850 && tileY > 805) {
        button.play();
        pauseMenu.destroy();
        game.input.onDown.remove(pauseMenuHandler, this);
        initControlsMenu();
    }
    //Menu
    if (tileX < 870 && tileX > 720 && tileY < 960 && tileY > 905) {
        game.paused = !game.paused;
        button.play();
        this.game.state.start('MainMenu');
    }
}

//controls menu
function initControlsMenu() {
    controlsMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'controlsMenu');
    controlsMenu.anchor.setTo(.5, .5);
    controlsMenu.inputEnabled = true;
    game.input.onDown.add(controlsMenuHandler, this);
}

//handles the controls menu input
function controlsMenuHandler(pointer, event) {
    var tileworldX = pointer.worldX - (pointer.worldX);
    var tileworldY = pointer.worldY - (pointer.worldY);
    var tileX = Math.floor(pointer.worldX);
    var tileY = Math.floor(pointer.worldY);
    //Back
    if (tileX < 600 && tileX > 490 && tileY < 660 && tileY > 606) {
        button.play();
        controlsMenu.destroy();
        game.input.onDown.remove(levelCompleteMenuHandler, this);
        pauseMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'pauseMenu');
        pauseMenu.anchor.setTo(.5, .5);
        pauseMenu.inputEnabled = true;
        game.input.onDown.add(pauseMenuHandler, this);
    }
}

//menu shown once the level is complete
function initLevelCompleteMenu() {
    game.time.events.add(100, function() {
        game.paused = !game.paused;
    }, this);
    levelCompleteMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'levelCompleteMenu');
    game.camera.follow(levelCompleteMenu);
    levelCompleteMenu.anchor.setTo(.5, .5);
    levelCompleteMenu.inputEnabled = true;
    game.input.onDown.add(levelCompleteMenuHandler, this);

}

//handles input for level complete menu allowing advancement to the next level
function levelCompleteMenuHandler(pointer, event) {
    var tileworldX = pointer.worldX - (pointer.worldX);
    var tileworldY = pointer.worldY - (pointer.worldY);
    var tileX = Math.floor(pointer.worldX);
    var tileY = Math.floor(pointer.worldY);
    //Next Level
    if (tileX < 875 && tileX > 726 && tileY < 850 && tileY > 800) {
        game.paused = !game.paused;
        button.play();
        game.input.onDown.remove(levelCompleteMenuHandler, this);
        //Advance to next level
        switch (this.game.state.current) {
            case "Level1":
                button.play();
                this.game.state.start('Level2');
                break;
            case "Level2":
                button.play();
                this.game.state.start('Level3');
                break;
            default:
        }
    }
    //Menu
    if (tileX < 875 && tileX > 726 && tileY < 940 && tileY > 880) {
        game.paused = !game.paused;
        button.play();
        game.input.onDown.remove(levelCompleteMenuHandler, this);
        this.game.state.start('MainMenu');
    }
}

//Menu for completion of level 3 
function initGameCompleteMenu() {
    game.time.events.add(100, function() {
        game.paused = !game.paused;
    }, this);
    gameCompleteMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'gameCompleteMenu');
    game.camera.follow(gameCompleteMenu);
    gameCompleteMenu.anchor.setTo(.5, .5);
    gameCompleteMenu.inputEnabled = true;
    game.input.onDown.add(gameCompleteMenuHandler, this);
}

//handles game completion menu, allowing user to return to main menu
function gameCompleteMenuHandler(pointer, event) {
    var tileworldX = pointer.worldX - (pointer.worldX);
    var tileworldY = pointer.worldY - (pointer.worldY);
    var tileX = Math.floor(pointer.worldX);
    var tileY = Math.floor(pointer.worldY);
    if (tileX < 870 && tileX > 725 && tileY < 890 && tileY > 840) {
        game.paused = !game.paused;
        button.play();
        this.game.state.start('MainMenu');
        game.input.onDown.remove(gameCompleteMenuHandler, this);
    }
}

function initDeathScreen() {
    game.time.events.add(100, function() {
        game.paused = !game.paused;
    }, this);
    deathScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'death_screen');
    game.camera.follow(deathScreen);
    deathScreen.anchor.setTo(.5, .5);
    deathScreen.inputEnabled = true;
    game.input.onDown.add(deathScreenHandler, this);
}

function deathScreenHandler(pointer, event) {
    var tileworldX = pointer.worldX - (pointer.worldX);
    var tileworldY = pointer.worldY - (pointer.worldY);
    var tileX = Math.floor(pointer.worldX);
    var tileY = Math.floor(pointer.worldY);
    //retry
    if (tileX < 860 && tileX > 744 && tileY < 808 && tileY > 764) {
        game.paused = !game.paused;
        button.play();
        game.input.onDown.remove(deathScreenHandler, this);
        switch (this.game.state.current) {
            case "Level1":
                button.play();
                this.game.state.start('Level1');
                break;
            case "Level2":
                button.play();
                this.game.state.start('Level2');
                break;
            case "Level3":
                button.play();
                this.game.state.start('Level3');
                break;
            default:
        }
    }
    //Menu
    if (tileX < 860 && tileX > 744 && tileY < 870 && tileY > 829) {
        game.paused = !game.paused;
        button.play();
        game.input.onDown.remove(deathScreenHandler, this);
        this.game.state.start('MainMenu');
    }
}

//writes text for boss phases, displayed for a certain time
function writeText(text, time) {
    var style = { font: "32px Arial", fill: "#FFF", align: "center" };
    text = game.add.text(player.x, player.y - 100, text, style);
    var interval = setInterval(function() {
        text.x = player.x;
        text.y = player.y - 100;
    }, 15);
    text.anchor.set(0.5);
    game.time.events.add(time, function() {
        clearInterval(interval);
        text.destroy();
    }, this);
}

//displays how long the user is stunned for (time in ms)
function stunTimer(time) {
    var timeDecrement = time / 100; //time in s^-2
    player.stunbar = game.add.sprite(player.x, player.y - 20, 'stunbar');
    player.stunbar.height = 20;
    player.stunbar.width = 100;
    player.stunbar.anchor.set(0.5);
    //keeps focus on bar
    var stuninterval = setInterval(function() {
        if (player.stunbar != null) {
            player.stunbar.x = player.x;
            player.stunbar.y = player.y - 20;
        }
    }, 15);
    //decrements bar
    var stun = setInterval(function() {
        if (player.stunbar != null && !game.paused && player.stunbar.width > 1.45) {
            player.stunbar.width -= 1.45; //100 iterations
        }
    }, timeDecrement);
    //in $time, will clear both intervals and destroys bar
    game.time.events.add(time, function() {
        clearInterval(stun);
        clearInterval(stuninterval);
        player.stunbar.destroy();
    }, this);
}
