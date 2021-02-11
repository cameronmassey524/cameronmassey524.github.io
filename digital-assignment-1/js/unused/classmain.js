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

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
        
        this.bouncy = null;
    }
	
	//Begin new variables:
	player: null,
	healthpoints: null,
	reticle: null,
	moveKeys: null,
	playerBullets: null,
	enemyBullets: null,
	time: 0,
	//End new vars
    
    preload() {
		// Load in images and sprites
		this.load.spritesheet('player_handgun', 'assets/sprites/player_handgun.png',
			{ frameWidth: 66, frameHeight: 60 }
		); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
		this.load.image('bullet', 'assets/sprites/bullets/bullet6.png');
		this.load.image('target', 'assets/demoscene/ball.png');
		this.load.image('background', 'assets/skies/underwater1.png');
    }
    
    create() {
		// Set world bounds
		this.physics.world.setBounds(0, 0, 1600, 1200);

		// Add 2 groups for Bullet objects
		playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
		enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

		// Add background player, enemy, reticle, healthpoint sprites
		var background = this.add.image(800, 600, 'background');
		player = this.physics.add.sprite(800, 600, 'player_handgun');
		enemy = this.physics.add.sprite(300, 600, 'player_handgun');
		reticle = this.physics.add.sprite(800, 700, 'target');
		hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
		hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
		hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);

		// Set image/sprite properties
		background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
		player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
		enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
		reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
		hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
		hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
		hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

		// Set sprite variables
		player.health = 3;
		enemy.health = 3;
		enemy.lastFired = 0;

		// Set camera properties
		this.cameras.main.zoom = 0.5;
		this.cameras.main.startFollow(player);

		// Creates object for input with WASD kets
		moveKeys = this.input.keyboard.addKeys({
			'up': Phaser.Input.Keyboard.KeyCodes.W,
			'down': Phaser.Input.Keyboard.KeyCodes.S,
			'left': Phaser.Input.Keyboard.KeyCodes.A,
			'right': Phaser.Input.Keyboard.KeyCodes.D
		});

		// Enables movement of player with WASD keys
		this.input.keyboard.on('keydown_W', function (event) {
			player.setAccelerationY(-800);
		});
		this.input.keyboard.on('keydown_S', function (event) {
			player.setAccelerationY(800);
		});
		this.input.keyboard.on('keydown_A', function (event) {
			player.setAccelerationX(-800);
		});
		this.input.keyboard.on('keydown_D', function (event) {
			player.setAccelerationX(800);
		});

		// Stops player acceleration on uppress of WASD keys
		this.input.keyboard.on('keyup_W', function (event) {
			if (moveKeys['down'].isUp)
				player.setAccelerationY(0);
		});
		this.input.keyboard.on('keyup_S', function (event) {
			if (moveKeys['up'].isUp)
				player.setAccelerationY(0);
		});
		this.input.keyboard.on('keyup_A', function (event) {
			if (moveKeys['right'].isUp)
				player.setAccelerationX(0);
		});
		this.input.keyboard.on('keyup_D', function (event) {
			if (moveKeys['left'].isUp)
				player.setAccelerationX(0);
		});

		// Fires bullet from player on left click of mouse
		this.input.on('pointerdown', function (pointer, time, lastFired) {
			if (player.active === false)
				return;

			// Get bullet from bullets group
			var bullet = playerBullets.get().setActive(true).setVisible(true);

			if (bullet)
			{
				bullet.fire(player, reticle);
				this.physics.add.collider(enemy, bullet, enemyHitCallback);
			}
		}, this);

		// Pointer lock will only work after mousedown
		game.canvas.addEventListener('mousedown', function () {
			game.input.mouse.requestPointerLock();
		});

		// Exit pointer lock when Q or escape (by default) is pressed.
		this.input.keyboard.on('keydown_Q', function (event) {
			if (game.input.mouse.locked)
				game.input.mouse.releasePointerLock();
		}, 0, this);

		// Move reticle upon locked pointer move
		this.input.on('pointermove', function (pointer) {
			if (this.input.mouse.locked)
			{
				reticle.x += pointer.movementX;
				reticle.y += pointer.movementY;
			}
		}, this);

	}
    
    update() {
	    // Rotates player to face towards reticle
		player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

		// Rotates enemy to face towards player
		enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

		//Make reticle move with player
		reticle.body.velocity.x = player.body.velocity.x;
		reticle.body.velocity.y = player.body.velocity.y;

		// Constrain velocity of player
		constrainVelocity(player, 500);

		// Constrain position of constrainReticle
		constrainReticle(reticle);

		// Make enemy fire
		enemyFire(enemy, player, time, this);
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
});
