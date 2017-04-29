//loading the game assets
Preload = function() {};

Preload.prototype = {
    preload: function() {
        game.splash = game.add.sprite(0, 0, 'splash');
        game.splash.width = 1200;
        game.splash.height = 800;

        game.load.audio('bg_music', 'Benchmark3/assets/music/parry_pop_sonata.wav');

        //Menus
        game.load.image('about', 'Benchmark3/assets/UI/about.png');
        game.load.image('levels', 'Benchmark3/assets/UI/levels.png');
        game.load.image('controls', 'Benchmark3/assets/UI/controls.png');
        game.load.image('menu', 'Benchmark3/assets/UI/menu.png');
        game.load.image('pauseMenu', 'Benchmark3/assets/UI/pausemenu.png');
        game.load.image('controlsMenu', 'Benchmark3/assets/UI/controlsmenu.png');
        game.load.image('levelCompleteMenu', 'Benchmark3/assets/UI/levelcomplete.png');
        game.load.image('gameCompleteMenu', 'Benchmark3/assets/UI/gamecomplete.png');

        //Player
        game.load.spritesheet('player', 'Benchmark3/assets/player.png', 64, 64);
        game.load.image('bullet', 'Benchmark3/assets/other_sprites/bullet.png');
        game.load.image('heart', 'Benchmark3/assets/other_sprites/heart.png');
        game.load.image('healthbar', 'Benchmark3/assets/other_sprites/healthbar.png');
        game.load.image('ultimatebar', 'Benchmark3/assets/other_sprites/ultimatebar.png');
        game.load.image('ultimatebarInvert', 'Benchmark3/assets/other_sprites/ultimatebarinvert.png');
        game.load.physics('data', 'Benchmark3/assets/data.json');
        
        //level 1
        game.load.tilemap('cerberusMap', 'Benchmark3/assets/Levels/Lava.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('cerberusGameTiles', 'Benchmark3/assets/Levels/Fire.png');
        game.load.spritesheet('cerberus', 'Benchmark3/assets/other_sprites/cerberus.png', 128, 128);
        game.load.spritesheet('redSlime', 'Benchmark3/assets/other_sprites/red_slime.png', 32, 32);
        game.load.spritesheet('fireballTower', 'Benchmark3/assets/other_sprites/fireball_tower.png', 64, 64);
        game.load.image('fireBullet', 'Benchmark3/assets/other_sprites/fireBullet.png');

        //level 2 
        game.load.tilemap('persephoneMap', 'Benchmark3/assets/Levels/water.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('persephoneGameTiles', 'Benchmark3/assets/Levels/Water.png');
        game.load.image('waterDrop', 'Benchmark3/assets/other_sprites/water_droplet.png');
        game.load.spritesheet('blueSlime', 'Benchmark3/assets/other_sprites/blue_slime.png', 32, 32);
        game.load.spritesheet('bubbleTower', 'Benchmark3/assets/other_sprites/bubble_tower.png', 64, 64);
        game.load.image('bubblebullet', 'Benchmark3/assets/other_sprites/bubbleBullet.png');
        game.load.spritesheet('persephone', 'Benchmark3/assets/other_sprites/whale.png', 128, 128);
        game.load.spritesheet('tentacles', 'Benchmark3/assets/other_sprites/tentacle.png', 32, 32);

        //level 3
        game.load.tilemap('hadesMap', 'Benchmark3/assets/Levels/Darkness.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('hadesGameTiles', 'Benchmark3/assets/Levels/Darkness.png');
        game.load.spritesheet('hades', 'Benchmark3/assets/other_sprites/hades.png', 64, 64);
        game.load.spritesheet('voidTower', 'Benchmark3/assets/other_sprites/void_tower.png', 64, 64);
        game.load.spritesheet('glitchSlime', 'Benchmark3/assets/other_sprites/glitch_slime.png', 32, 32);
        game.load.image('voidBullet', 'Benchmark3/assets/other_sprites/voidBullet.png');

        //Sounds
        game.load.audio('button', 'Benchmark3/assets/sounds/button.wav');
        game.load.audio('pandora_damaged', 'Benchmark3/assets/sounds/pandora_damaged.wav');
        game.load.audio('pandora_sword', 'Benchmark3/assets/sounds/pandora_sword_1.wav');
        game.load.audio('pandora_shoot', 'Benchmark3/assets/sounds/projectile_2.wav');
        game.load.audio('fire_tower', 'Benchmark3/assets/sounds/fire_tower.wav');
        game.load.audio('fire_tower_2', 'Benchmark3/assets/sounds/fire_tower_2.wav');
        game.load.audio('water_tower', 'Benchmark3/assets/sounds/water_tower.wav');
        game.load.audio('slime_1', 'Benchmark3/assets/sounds/slime_1.wav');
        game.load.audio('slime_2', 'Benchmark3/assets/sounds/slime_2.wav');
        game.load.audio('slime_3', 'Benchmark3/assets/sounds/slime_3.wav');
        game.load.audio('slime_hurt', 'Benchmark3/assets/sounds/slime_hurt.wav');
        game.load.audio('tower_block', 'Benchmark3/assets/sounds/tower_block.wav');
        game.load.audio('whale_hurt', 'Benchmark3/assets/sounds/whale_hurt.wav');
        game.load.audio('whale_1', 'Benchmark3/assets/sounds/whale_1.wav');
        game.load.audio('whale_2', 'Benchmark3/assets/sounds/whale_2.wav');
        game.load.audio('whale_shoot', 'Benchmark3/assets/sounds/whale_shoot.wav');
        game.load.audio('tower_damaged', 'Benchmark3/assets/sounds/tower_damaged.wav');
        game.load.audio('cerberus_fire_storm', 'Benchmark3/assets/sounds/cerberus_fire_storm.wav');
        game.load.audio('void_tower_attack', 'Benchmark3/assets/sounds/void_tower_attack.wav');
    },
    create: function() {
        music = game.add.audio('bg_music');
        music.loop = true;
        music.volume = 0.5;
        music.play();
        setTimeout(function() {
            game.state.start('MainMenu');
        }, 2000);
    }
};
