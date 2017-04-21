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