function spawnHades(){
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.P2JS;

    var hades = enemies.create(game.world.centerX, game.world.centerY, 'hades');
    var arr = [];
    for (var j = 0; j < 3; j++) {
        arr.push(j);
    }
    hades.mass = 20;
    hades.maxhealth = 20;
    hades.health = 20;

    healthbar = game.add.sprite(300, 30, 'healthbar');
    healthbar.height = 10;
    healthbar.width = (hades.health / hades.maxhealth) * 500;
    healthbar.fixedToCamera = true;
    hades.shield = false;
    hades.healthbar = healthbar;
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