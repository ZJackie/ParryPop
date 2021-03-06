var toggle = false; //toggle for cheats 

function initPlayer() {
    //Adds player sprite
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    //init player animations
    player.animations.add('idle', [0, 1, 2, 3, 4], 10, true);
    player.animations.add('walk', [5, 6, 7, 8, 9], 10, false);
    player.animations.add('attack', [10, 11, 12, 13, 14], 10, false);
    player.animations.add('attackwalk', [15, 16, 17, 18, 19], 10, false);
    player.animations.add('shoot', [20, 21, 22, 23, 24], 10, false);
    player.animations.add('shootwalk', [25, 26, 27, 28, 29], 10, false);
    player.animations.add('death', [30, 31, 32, 33, 34], 10, false);

    player.bossAlive = true; //boolean for boss
    player.dead = 0; //player death count
    player.ultimate = 0; //player ultimate charge
    //init player ultimate bar
    player.ultimateBar = game.add.sprite(3, 30, 'ultimatebar');
    player.ultimateBar.height = 20;
    player.ultimateBar.width = (player.ultimate / 10) * 100;
    player.ultimateBar.fixedToCamera = true;
    //init player ultimate bar fill
    ultimateBarInvert = game.add.sprite(3, 30, 'ultimatebarInvert');
    ultimateBarInvert.height = 20;
    ultimateBarInvert.width = 100;
    ultimateBarInvert.fixedToCamera = true;
    player.ultimateBar.bringToTop();
    player.tentaclecount = 0; //indicates number of tentacles for Level 2 Boss
    player.godmode = false;
    //enables player physics
    game.physics.p2.enable(player, true);
    player.body.setCircle(20);
    player.health = 10;
    player.body.setCollisionGroup(playerCollisionGroup);
    //the camera will follow the player in the world
    game.camera.follow(player);
}

//init all game audio
function initAudio() {
    //Level 1
    fire_tower = game.add.audio('fire_tower');
    fire_tower_2 = game.add.audio('fire_tower_2');
    cerberus_fire_storm = game.add.audio('cerberus_fire_storm');

    //Level 2
    water_tower = game.add.audio('water_tower');
    whale_hurt = game.add.audio('whale_hurt');
    whale_1 = game.add.audio('whale_1');
    whale_2 = game.add.audio('whale_2');
    whale_shoot = game.add.audio('whale_shoot');

    //Level 3
    void_tower_attack = game.add.audio('void_tower_attack');

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

//init enemies - different depeneding on Level
function initEnemies(slimeName, towerName, numSlimes, numTowers) {
    enemies = game.add.group();
    //enemies.enableBody = true;

    spawnSlimes(numSlimes, slimeName);
    spawnTowers(numTowers, towerName);

}

//Spawns level 1 Boss
function spawnCerberus() {
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;
    //creates ceberus
    var cerberus = enemies.create(game.world.centerX, game.world.centerY, 'cerberus');
    var arr = [];
    //inits cerberus animations
    for (var j = 0; j < 6; j++) {
        arr.push(j);
    }
    cerberus.mass = 20;
    cerberus.maxhealth = 20;
    cerberus.health = 20;
    //adds ceberus' health bar
    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (cerberus.health / cerberus.maxhealth) * 500;
    healthbar.fixedToCamera = true;

    cerberus.healthbar = healthbar;
    cerberus.animations.add('cerberusidle', arr, 12, true);
    cerberus.currentRadius = cerberus.width;
    //sets cerberus' hit box
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

//Spawns Level 2 Boss
function spawnPersephone() {
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;
    //spawns Persephone at a random position
    var persephone = enemies.create(game.world.centerX + (-500 + Math.random() * 1000), game.world.centerY + (-500 + Math.random() * 1000), 'persephone');
    var arr = [];
    for (var j = 0; j < 4; j++) {
        arr.push(j);
    }
    persephone.mass = 20;
    persephone.maxhealth = 20;
    persephone.health = 20;
    //inits Persephone's health bar
    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (persephone.health / persephone.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    persephone.shield = false;
    persephone.healthbar = healthbar;
    persephone.animations.add('persephoneidle', arr, 12, true);
    persephone.currentRadius = persephone.width;
    game.physics.p2.enable(persephone, true);
    //Sets hitbox
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

//Spawns Level 3 Boss
function spawnHades() {
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;
    //Spawns Hades in the map center
    var hades = enemies.create(game.world.centerX, game.world.centerY, 'hades');
    var arr = [];
    //inits list to hold animations
    for (var j = 0; j < 3; j++) {
        arr.push(j);
    }

    hades.mass = 20;
    hades.maxhealth = 20;
    hades.health = 20;
    //inits Hades' health bar
    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (hades.health / hades.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    hades.shield = false;
    hades.healthbar = healthbar;
    //adds animations
    hades.animations.add('hadesidle', arr, 12, true);
    arr = [];
    for (var j = 3; j < 6; j++) {
        arr.push(j);
    }
    hades.animations.add('hades_open', arr, 12, true);
    arr = [];
    for (var j = 7; j < 20; j++) {
        arr.push(j);
    }
    hades.animations.add('hades_tp', arr, 12, true);
    hades.currentRadius = hades.width;
    game.physics.p2.enable(hades, true);
    //sets hitbox
    hades.body.setCircle(60);
    hades.body.setCollisionGroup(enemyCollisionGroup);
    hades.body.collides(swordCollisionGroup, smackEnemies, this);
    hades.body.collides(playerCollisionGroup, takeDamage, this);
    hades.body.collides(bulletCollisionGroup, killEnemies, this);
    hades.body.collides(borderCollisionGroup);
    hades.body.collides(playerCollisionGroup);
    hades.enemyType = "hades";
    hades.rate = 0.5;
    hades.body.static = true;

    //bullets
    hades.bullets = game.add.group();
    hades.bullets.enableBody = true;
    hades.bullets.physicsBodyType = Phaser.Physics.P2JS;
    hades.bullets.createMultiple(5, 'voidbullet');
    hades.bullets.setAll('checkWorldBounds', true);
    hades.bullets.setAll('outOfBoundsKill', true);
    hades.bullets.setAll('anchor.x', 0.5);
    hades.bullets.setAll('anchor.y', 0.5);

    //attacks
    hades.ramAttack = false;
    hades.invulnerability = false;
    hades.phase1 = false;
    hades.phase2 = false;
    hades.phase3 = false;
}

//Called when enemies are damaged, body1=body to be damaged,body2=bullet sprite
function killEnemies(body1, body2) {
    body2.sprite.kill(); //removes bullet
    //only run if body to be damaged is damageable
    if (body1.isVulnerable == true) {
        //gain ultimate on a successful hit
        if (player.ultimate < 10) {
            player.ultimate++;
            player.ultimateBar.width = (player.ultimate / 10) * 100;
        }
        //if body1 is at 1 health, then this attack should remove them
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
            //If body1 is a boss with 1 health, complete the level
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
            if (body1.sprite.enemy == "hades") {
                player.bossAlive = false;
                body1.sprite.healthbar.kill();
                game.time.events.add(1500, function() {
                    initGameCompleteMenu();
                }, this);
            }
            body1.sprite.destroy(); //destroys the body1 sprite
        } else { //else if body1 has more than 1 health, simply damage them
            body1.sprite.health--;
            if (body1.sprite.enemyType == "tower") {
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 50;
                tower_damaged.play();//tower damaged sound
            } else if (body1.sprite.enemyType == "persephone") {
                //persephone hurt sound
                whale_hurt.play();
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            } else if (body1.sprite.enemyType == "cerberus") {
                //cerberus hurt sound
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            } else if (body1.sprite.enemyType == "hades") {
                //hades hurt sound
                body1.sprite.healthbar.width = (body1.sprite.health / body1.sprite.maxhealth) * 500;
            }
        }
    } else {
        //play a different sound for slimes depending on game level
        var currentGameState = this.game.state.current;
        if (body1.sprite.enemyType == "slime") {
            switch (currentGameState) {
                case "Game":
                    slime_1.play(); //level1 slime damaged sound
                    break;
                case "Level2":
                    slime_2.play(); //level2 slime damaged sound
                    break;
                case "Level3":
                    slime_3.play(); //level3 slime damaged sound
                    break;
                default:
            }
        }
        if (body1.sprite.enemyType == "tower") {
            tower_block.play(); //tower damaged sound
        }
    }
}

//damages enemies with the sword. body1=body to be damaged, body2=sword
function smackEnemies(body1, body2) {
    //only able to inflict damage if player sheild is > 0 
    if (shield > 0) {
        //gain ultimate on successful hit
        if (body1.isVulnerable == true) {
            if (player.ultimate < 10) {
                player.ultimate++;
                player.ultimateBar.width = (player.ultimate / 10) * 100;
            }
            //destroys body1 if health is = 1
            if (body1.sprite.health == 1) {
                body1.clearShapes();
                body1.sprite.destroy();
                slime_hurt.play();
            //else body1 sprite loses 1 health
            } else {
                body1.sprite.health--;
            }
        }
        shield--; //lose shield on successful hit
    } else {
        player.body.removeShape(swordhitbox);
        swung = false; 
    }
}

//sets for the bounciness for slimes, body1=slime, body2=this
function bounce(body1, body2) {
    //random bounce set
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

//handles all enemy movements
function handleEnemies() {
    handleEnemyMovements();
}

function handleEnemyMovements() {
    enemies.forEach(function(enemy) {
        //handles movements for slimes
        if (enemy.enemyType == "slime") {
            enemy.animations.play('slimeIdle');
            //sets the rate at which a slime circle decreases
            enemy.currentRadius = enemy.currentRadius - enemy.rate;
            enemy.body.setCircle(enemy.currentRadius);
            enemy.body.setCollisionGroup(enemyCollisionGroup);
            var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 5;
            var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
            if (enemy.currentRadius <= lowerBound) {
                enemy.currentRadius = enemy.width;
            }
            //at the lowest bound, a slime will be vulnerable
            if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
                enemy.body.isVulnerable = true;
            } else {
                enemy.body.isVulnerable = false;
            }
            //slimes will chase the player if they are < 80 px away from the player
            if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 80) {
                game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 200);
            }
            //handle tower actions
        } else if (enemy.enemyType == "tower") {
            enemy.animations.play('toweridle', 10);
            //sets tower shield decrease rate
            enemy.currentRadius = enemy.currentRadius - enemy.rate;
            enemy.body.setCircle(enemy.currentRadius);
            enemy.body.setCollisionGroup(enemyCollisionGroup);
            var lowerBound = enemy.width / 2 - enemy.width * 0.1 + 5;
            var upperBound = enemy.width / 2 + enemy.width * 0.1 + 5;
            if (enemy.currentRadius <= lowerBound) {
                enemy.currentRadius = enemy.width;
            }
            //at the lowest bound, a tower will be vulnerable
            if (enemy.currentRadius >= lowerBound && enemy.currentRadius <= upperBound) {
                enemy.body.isVulnerable = true;
            } else {
                enemy.body.isVulnerable = false;
                //fires bullets when players are < 500px away
                if (game.physics.arcade.distanceToXY(enemy, player.body.x, player.body.y) < 500) {
                    fireEnemyBullet(enemy);
                }
            }
            //set boss handles
        } else if (enemy.enemyType == "cerberus") {
            handleCerberus(enemy);
        } else if (enemy.enemyType == "persephone" || enemy.enemyType == "tentacles") {
            handlePersephone(enemy);
        } else if (enemy.enemyType == "hades") {
            handleHades(enemy);
        }
    }, this);
}

//spawn towers - different depending on level
function spawnTowers(NumberOfTowers, towerName) {
    //creates towers
    for (var i = 0; i < NumberOfTowers; i++) {
        var towers = enemies.create(game.world.centerX + (-500 + Math.random() * 1000), game.world.centerY + (-500 + Math.random() * 1000), towerName);
        var arr = [];
        for (var j = 0; j < 17; j++) {
            arr.push(j);
        }
        towers.maxhealth = 3; //a tower has a max health of 3
        towers.health = 3;
        //init tower health bar
        healthbar = game.add.sprite(towers.x - 25, towers.y - 50, 'healthbar');
        healthbar.height = 10;
        healthbar.width = (towers.health / towers.maxhealth) * 50;
        towers.healthbar = healthbar;
        towers.enemyType = "tower";
        towers.animations.add('toweridle', arr, 12, true);
        towers.currentRadius = towers.width;
        game.physics.p2.enable(towers, true);
        towers.body.static = true;
        //set tower hitbox
        towers.body.setCircle(50);
        towers.body.setCollisionGroup(enemyCollisionGroup);
        towers.body.collides(swordCollisionGroup, smackEnemies, this);
        towers.body.collides(playerCollisionGroup, takeDamage, this);
        towers.body.collides(bulletCollisionGroup, killEnemies, this);
        towers.body.collides([enemyCollisionGroup, borderCollisionGroup, playerCollisionGroup]);

        towers.bullets = game.add.group();
        towers.bullets.enableBody = true;
        towers.bullets.physicsBodyType = Phaser.Physics.P2JS;
        //init tower bullets depending on type of tower (level)
        switch (towerName) {
            case 'bubbleTower':
                towers.bullets.createMultiple(5, 'bubblebullet');
                break;
            case 'fireballTower':
                towers.bullets.createMultiple(5, 'fireBullet');
                break;
            case 'voidTower':
                towers.bullets.createMultiple(5, 'voidBullet');
                break;
            default:
        }
        //set bullet physics
        towers.bullets.setAll('checkWorldBounds', true);
        towers.bullets.setAll('outOfBoundsKill', true);
        towers.bullets.setAll('anchor.x', 0.5);
        towers.bullets.setAll('anchor.y', 0.5);

        towers.enemyType = "tower";
        //set a random rate for towers for shield decrease
        towers.rate = Math.random() * 0.4 + 0.1;
    }
}

//
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
        tentacles.rate = Math.random() * 0.4 + 0.1;
    }
}

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
        if (!toggle) {
            if (cursors.I.isDown) {
                toggle = !toggle;
                player.godmode = !player.godmode;
                console.log(player.godmode);
                game.time.events.add(1000, function() { toggle = !toggle; }, this);
            }
        }
        if (cursors.K.isDown) {
            enemies.forEach(function(enemy) {
                if (enemy.enemyType == 'tower') {
                    enemy.body.clearShapes();
                    enemy.healthbar.width = 0;
                    enemy.destroy;
                }
                if (enemy.enemyType != "persephone" && enemy.enemyType != "cerberus" && enemy.enemyType != "hades") {
                    enemy.body.clearShapes();
                    enemy.destroy();
                }
            });
        }
        if (cursors.ONE.isDown) {
            this.game.state.start('Level1');
        }
        if (cursors.TWO.isDown) {
            this.game.state.start('Level2');
        }
        if (cursors.THREE.isDown) {
            this.game.state.start('Level3');
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
                    bullet.body.setCircle(10);
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
        if (enemies.length == 0 && player.bossAlive != false) {
            spawnCerberus();
            resetHealth();
        }
    } else if (level == "Level2") {
        if (enemies.length == 0 && player.bossAlive != false) {
            spawnPersephone();
            whale_1.play();
            resetHealth();
        }
    } else if (level == "Level3") {
        if (enemies.length == 0 && player.bossAlive != false) {
            console.log(enemies.length);
            spawnHades();
            resetHealth();
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

function handleCerberus(enemy) {
    enemy.animations.play('cerberusidle');
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
    enemy.body.rotation = game.physics.arcade.angleBetween(enemy, player) + game.math.degToRad(-90);
    var chance = Math.random();
    if (chance > 0.5) {
        angle = game.physics.arcade.angleBetween(enemy, player) + Math.random();
    } else {
        angle = game.physics.arcade.angleBetween(enemy, player) - Math.random();
    }
    //    enemy.body.velocity.x = 500 * Math.cos(angle);
    //     enemy.body.velocity.y = 500 * Math.sin(angle);
    var bubblebullet = enemy.bullets.getFirstExists(false);
    if (bubblebullet) {
        fire_tower_2.play();
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
    if (enemy.phase1 == false && enemy.health < 15) {
        //writeText("Cerberus has spawned 5 Red Slimes!");
        spawnSlimes(5, 'redSlime');
        enemy.phase1 = true;
    }
    if (enemy.phase2 == false && enemy.health < 10) {
        //writeText("Cerberus unleashes his flames!");
        cerberus_fire_storm.play();
        enemy.bullets.createMultiple(15, 'fireBullet');
        enemy.phase2 = true;
    }
    if (enemy.phase3 == false && enemy.health < 5) {
        //writeText("Cerberus is enraged!");
        game.physics.arcade.moveToXY(enemy, player.body.x, player.body.y, 200);
    }
}

function handlePersephone(enemy) {
    if (enemy.enemyType == "persephone") {
        enemy.animations.play('persephoneidle');
        var random = Math.random() * 5;
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
            //writeText("Persephone has spawned 8 Bubble Towers!");
            spawnTowers(8, 'bubbleTower');
            enemy.phase1 = true;
        }
        if (enemy.phase2 == false && enemy.health < 10) {
            //writeText("Persephone has spawned 8 Blue Slimes!");
            spawnSlimes(8, 'blueSlime');
            enemy.phase2 = true;
        }
        if (enemy.phase3 == false && enemy.health < 5) {
            //writeText("Kill all 6 Tentacles to bring down Persephone's Shield!");
            spawnTenctales(6);
            player.tentaclecount = 6;
            enemy.shield = true;
            enemy.phase3 = true;
        }
        if (player.tentaclecount == 0) {
            enemy.shield = false;
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

function handleHades(enemy) {

}

function initPauseMenu() {
    window.onkeydown = function(event) {
        if (player.bossAlive) {
            if (this.game.state.current == "Level1" || this.game.state.current == "Level2" || this.game.state.current == "Level3") {
                if (event.keyCode == 27) {
                    if (!game.paused) {
                        game.time.events.add(100, function() {
                            game.paused = !game.paused;
                        }, this);
                        pauseMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'pauseMenu');
                        game.camera.follow(pauseMenu);
                        pauseMenu.anchor.setTo(.5, .5);
                        pauseMenu.inputEnabled = true;
                        game.input.onDown.add(pauseMenuHandler, this);
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

function initControlsMenu() {
    controlsMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'controlsMenu');
    controlsMenu.anchor.setTo(.5, .5);
    controlsMenu.inputEnabled = true;
    game.input.onDown.add(controlsMenuHandler, this);
}

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

function gameCompleteMenuHandler() {
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

//writes text for boss phases
function writeText(text) {

}
