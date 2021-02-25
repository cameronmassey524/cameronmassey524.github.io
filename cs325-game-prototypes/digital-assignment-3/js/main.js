import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

		var player;
		var hitboxes;
		var ball;
		var hitter;
		var stars;
		var platforms;
		var cursors;
		var score = 0;
		var scoreText;
		var btns = {};
		var hitType;
		var hitactive = 0;
		//var facing = 1; //0 for left, 1 for right
		
		
class MyScene extends Phaser.Scene {
    
	constructor() {
        super();
        
    }
    
	ball_hit(ball)
	{
		ball.setVelocityX(100);
		ball.setVelocityY(150);
	}
	
    preload() {
		this.load.spritesheet('brawler', 'assets/animations/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
		this.load.spritesheet('hitboxes', 'assets/animations/hitboxes48x48.png', { frameWidth: 48, frameHeight: 48 });
		this.load.image('grid', 'assets/textures/grid-ps2.png');
		
		//from firstgame part 9
		this.load.image('sky', 'assets/textures/sky.png');
		this.load.image('ground', 'assets/textures/platform.png');
		this.load.image('star', 'assets/textures/star.png');
		this.load.image('bomb', 'assets/textures/bomb.png');
    }
    
    create()
	{

		
		//build world and colliders
		this.add.image(400, 300, 'sky');

		platforms = this.physics.add.staticGroup();
		
		hitboxes = this.physics.add.group({immovable:true, allowGravity:false});

		platforms.create(400, 568, 'ground').setScale(2).refreshBody();

		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');

		player = this.physics.add.sprite(100, 450, 'brawler');
		
		hitter = this.physics.add.sprite(100, 450, 'hitter');
		hitboxes.add(hitter);
		//hitter = this.add.sprite(100, 450, 'hitter');
		//hitboxes.create(100,450,'hitter');
		
		ball = this.physics.add.sprite(175, 450, "bomb");
		ball.setScale(3);
		
		
		player.setBounce(0.2);
		//player.setBounce(0.2);
		
		
		player.setCollideWorldBounds(true);
		this.physics.add.collider(player, platforms);
		//this.physics.add.collider(player, ball);
		
		ball.setCollideWorldBounds(true);
		this.physics.add.collider(ball, platforms);
		this.physics.add.collider(true, ball, hitter, this.ball_hit(ball));
		
		
		

        // Animation set
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 5, 6, 7, 8 ] }),
            frameRate: 8,
            repeat: -1
        });
		
        this.anims.create({
            key: 'hit_idle',
            frames: this.anims.generateFrameNumbers('hitboxes', { frames: [ 5, 6, 7, 8 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'kick',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 10, 11, 12, 13, 10 ] }),
            frameRate: 8,
            repeat: 0,
            repeatDelay: 2000
        });
		
        this.anims.create({
            key: 'hit_kick',
            frames: this.anims.generateFrameNumbers('hitboxes', { frames: [ 10, 11, 12, 13, 10 ] }),
            frameRate: 8,
            repeat: 0,
            repeatDelay: 2000
        });

        this.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 15, 16, 17, 18, 17, 15 ] }),
            frameRate: 8,
            repeat: 0,
            repeatDelay: 2000
        });
		
         this.anims.create({
            key: 'hit_punch',
            frames: this.anims.generateFrameNumbers('hitboxes', { frames: [ 15, 16, 17, 18, 17, 15 ] }),
            frameRate: 8,
            repeat: 0,
            repeatDelay: 2000
        }); 

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23 ] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'jumpkick',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23, 25, 23, 22, 21 ] }),
            frameRate: 8,
            repeat: 0
        });
		
        this.anims.create({
            key: 'hit_jumpkick',
            frames: this.anims.generateFrameNumbers('hitboxes', { frames: [ 20, 21, 22, 23, 25, 23, 22, 21 ] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'win',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 30, 31 ] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 2000
        });

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [ 35, 36, 37 ] }),
            frameRate: 8,
        });

        const keys = [ 'walk', 'idle', 'kick', 'punch', 'jump', 'jumpkick', 'win', 'die' ];
		
		cursors = this.input.keyboard.createCursorKeys();

/*         const cody = this.add.sprite(600, 370);
        cody.setScale(2);
        cody.play('walk'); */
		
		
		//this.physics.add.collider(stars, platforms);

		//this.physics.add.overlap(player, stars, collectStar, null, this);
		
 		var btn_kick = this.input.keyboard.addKey('Z');
		var btn_punch = this.input.keyboard.addKey('X');
		var btn_jump = this.input.keyboard.addKey('C');
		btns["kick"] = btn_kick;
		btns["punch"] = btn_punch;
		btns["jump"] = btn_jump;
		
/* 		if (cursors.left.isDown)
		{
			player.play('walk', true);
		} */
		
        btn_kick.on('down', function () {
			if (player.body.touching.down)
			{
				player.play('kick', false);
				hitter.play("hit_kick", false);
			}
			else
			{
				player.play('jumpkick', false);
				hitter.play('hit_jumpkick', false);
				
			}
            //current.setText('Playing: ' + keys[c]);
        }); 
		
        btn_punch.on('down', function () {

            player.play('punch', false);
			hitter.play('hit_punch', false);
            //current.setText('Playing: ' + keys[c]);
        }); 
		
        btn_jump.on('down', function () {

            player.play('jump', false);
            //current.setText('Playing: ' + keys[c]);
        }); 

    }

    
    
    update() {
		
		hitter.x = player.x; //hitter always same location as player.
		hitter.y = player.y;
		
		
		
		if (cursors.left.isDown)
		{
			player.setVelocityX(-160);
			
			player.flipX = false;
			hitter.flipX = false;

			//player.anims.play('walk', true);
		}
		else if (cursors.right.isDown)
		{
			player.setVelocityX(160);
			
			player.flipX = true;
			hitter.flipX = true;

			//player.anims.play('walk', true);
		}
		else
		{
			player.setVelocityX(0);

			//player.anims.play('idle', true);
		}

		//if (cursors.up.isDown && player.body.touching.down)
		if (this.input.keyboard.checkDown(btns["jump"]) && player.body.touching.down)
		{
			player.setVelocityY(-330);
			
			//player.anims.play('jump');
		}
		
		if (this.input.keyboard.checkDown(btns["kick"]) && player.body.touching.down)
		{
			//player.setVelocityX(0);
			
			//player.anims.play('kick', true);
			
		}
		
		if (this.input.keyboard.checkDown(btns["kick"]) && !(player.body.touching.down))
		{
			//player.setVelocityX(0);
			
			//player.anims.play('jumpkick', true);
			
		}
		
		if (this.input.keyboard.checkDown(btns["punch"]) && player.body.touching.down)
		{
			//player.setVelocityX(0);
			
			//player.anims.play('punch', true);
			
		}		
		
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
	pixelArt: true,
    scene: MyScene,
    physics: { 
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
});
