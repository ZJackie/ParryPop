//loading the game assets
Preload = function() {};

Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(0, 0, 'splash');
        this.splash.width = 1200;
        this.splash.height = 800;

        this.load.image('about', 'assets/UI/about.png');
        this.load.image('levels', 'assets/UI/levels.png');
        this.load.image('controls', 'assets/UI/controls.png');
        this.load.image('menu', 'assets/UI/menu.png');
        game.load.spritesheet('player', 'assets/player.png', 64, 64);
        game.load.image('bullet', 'assets/other_sprites/bullet.png');
        game.load.image('heart', 'assets/other_sprites/heart.png');
        game.load.image('healthbar', 'assets/other_sprites/healthbar.png');
        game.load.image('ultimatebar', 'assets/other_sprites/ultimatebar.png');
        game.load.image('ultimatebarInvert', 'assets/other_sprites/ultimatebarinvert.png');
        game.load.physics('data', 'assets/data.json');
        //level 1
        game.load.tilemap('cerberusMap', 'assets/Levels/Lava.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('cerberusGameTiles', 'assets/Levels/Fire.png');
        game.load.spritesheet('cerberus', 'assets/other_sprites/cerberus.png', 128, 128);
        game.load.spritesheet('redSlime', 'assets/other_sprites/red_slime.png', 32, 32);
        game.load.spritesheet('fireballTower', 'assets/other_sprites/fireball_tower.png', 64, 64);
        game.load.image('fireBullet', 'assets/other_sprites/fireBullet.png');

        //level 2 
        game.load.tilemap('persephoneMap', 'assets/Levels/water.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('persephoneGameTiles', 'assets/Levels/Water.png');
        game.load.image('waterDrop', 'assets/other_sprites/water_droplet.png');
        game.load.spritesheet('blueSlime', 'assets/other_sprites/blue_slime.png', 32, 32);
        game.load.spritesheet('bubbleTower', 'assets/other_sprites/bubble_tower.png', 64, 64);
        game.load.image('bubblebullet', 'assets/other_sprites/bubbleBullet.png');
        game.load.spritesheet('persephone', 'assets/other_sprites/whale.png', 128, 128);
        game.load.spritesheet('tentacles', 'assets/other_sprites/tentacle.png', 32, 32);

        //level 3
        game.load.spritesheet('hades', 'assets/other_sprites/hades.png', 64,64);
        game.load.spritesheet('voidTower', 'assets/other_sprites/void_tower.png', 64, 64);
        game.load.spritesheet('glitchSlime', 'assets/other_sprites/glitch_slime.png', 32, 32);
        game.load.image('voidBullet', 'assets/other_sprites/voidBullet.png');

        //Sounds
        game.load.audio('button', 'assets/sounds/button.wav');
        game.load.audio('pandora_damaged', 'assets/sounds/pandora_damaged.wav');
        game.load.audio('pandora_sword', 'assets/sounds/pandora_sword_1.wav');
        game.load.audio('pandora_shoot', 'assets/sounds/projectile_2.wav');
        game.load.audio('fire_tower', 'assets/sounds/fire_tower.wav');
        game.load.audio('fire_tower_2', 'assets/sounds/fire_tower_2.wav');
        game.load.audio('water_tower', 'assets/sounds/water_tower.wav');
        game.load.audio('slime_1', 'assets/sounds/slime_1.wav');
        game.load.audio('slime_2', 'assets/sounds/slime_2.wav');
        game.load.audio('slime_3', 'assets/sounds/slime_3.wav');
        game.load.audio('slime_hurt', 'assets/sounds/slime_hurt.wav');
        game.load.audio('tower_block', 'assets/sounds/tower_block.wav');
        game.load.audio('whale_hurt', 'assets/sounds/whale_hurt.wav');
        game.load.audio('whale_1', 'assets/sounds/whale_1.wav');
        game.load.audio('whale_2', 'assets/sounds/whale_2.wav');
        game.load.audio('whale_shoot', 'assets/sounds/whale_shoot.wav');
        game.load.audio('tower_damaged', 'assets/sounds/tower_damaged.wav');
        game.load.audio('cerberus_fire_storm', 'assets/sounds/cerberus_fire_storm.wav');
        game.load.audio('void_tower_attack', 'assets/sounds/void_tower_attack.wav');
    },
    create: function() {
        setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }
};
