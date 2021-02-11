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

var Bullet = new Phaser.Class({

	Extends: Phaser.GameObjects.Image,

	initialize:

	// Bullet Constructor
	function Bullet (scene)
	{
		Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
		this.speed = 1;
		this.born = 0;
		this.direction = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.setSize(12, 12, true);
	},

	// Fires a bullet from the player to the reticle
	fire: function (shooter, target)
	{
		this.setPosition(shooter.x, shooter.y); // Initial position
		this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

		// Calculate X and y velocity of bullet to moves it from shooter to target
		if (target.y >= this.y)
		{
			this.xSpeed = this.speed*Math.sin(this.direction);
			this.ySpeed = this.speed*Math.cos(this.direction);
		}
		else
		{
			this.xSpeed = -this.speed*Math.sin(this.direction);
			this.ySpeed = -this.speed*Math.cos(this.direction);
		}

		this.rotation = shooter.rotation; // angle bullet with shooters rotation
		this.born = 0; // Time since new bullet spawned
	},

	// Updates the position of the bullet each cycle
	update: function (time, delta)
	{
		this.x += this.xSpeed * delta;
		this.y += this.ySpeed * delta;
		this.born += delta;
		if (this.born > 1800)
		{
			this.setActive(false);
			this.setVisible(false);
		}
	}

});

class MyScene extends Phaser.Scene {
    
    constructor(player, healthpoints, reticle, moveKeys, playerBullets, enemyBullets, time) {
        super();
        
        this.bouncy = null;
		this.player= null;
		this.healthpoints= null;
		this.reticle= null;
		this.moveKeys= null;
		this.playerBullets= null;
		this.enemyBullets= null;
		this.time= 0;
		

    }
	
	//Begin new variables:


    //end new vars
	
	
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
		this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
		this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

		// Add background player, enemy, reticle, healthpoint sprites
		var background = this.add.image(800, 600, 'background');
		this.player = this.physics.add.sprite(800, 600, 'player_handgun');
		this.enemy = this.physics.add.sprite(300, 600, 'player_handgun');
		this.reticle = this.physics.add.sprite(800, 700, 'target');
		this.hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
		this.hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
		this.hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);

		// Set image/sprite properties
		background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
		this.player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
		this.enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
		this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
		this.hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
		this.hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
		this.hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

		// Set sprite variables
		this.player.health = 3;
		this.enemy.health = 3;
		this.enemy.lastFired = 0;

		// Set camera properties
		this.cameras.main.zoom = 0.5;
		this.cameras.main.startFollow(this.player);

		// Creates object for input with WASD kets
		this.moveKeys = this.input.keyboard.addKeys({
			'up': Phaser.Input.Keyboard.KeyCodes.W,
			'down': Phaser.Input.Keyboard.KeyCodes.S,
			'left': Phaser.Input.Keyboard.KeyCodes.A,
			'right': Phaser.Input.Keyboard.KeyCodes.D
		});

		// Enables movement of player with WASD keys
		this.input.keyboard.on('keydown_W', function (event) {
			console.log("W Pressed");
			this.player.setAccelerationY(-800);
		});
		this.input.keyboard.on('keydown_S', function (event) {
			this.player.setAccelerationY(800);
		});
		this.input.keyboard.on('keydown_A', function (event) {
			this.player.setAccelerationX(-800);
		});
		this.input.keyboard.on('keydown_D', function (event) {
			this.player.setAccelerationX(800);
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
			//console.log("Mouse Down");
			if (this.player.active === false)
				return;

			// Get bullet from bullets group
			var bullet = this.playerBullets.get().setActive(true).setVisible(true);

			if (bullet)
			{
				bullet.fire(this.player, this.reticle);
				this.physics.add.collider(this.enemy, bullet, this.enemyHitCallback);
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
				this.reticle.x += pointer.movementX;
				this.reticle.y += pointer.movementY;
			}
		}, this);

	}
  
	enemyHitCallback(enemyHit, bulletHit)
	{
		// Reduce health of enemy
		if (bulletHit.active === true && enemyHit.active === true)
		{
			enemyHit.health = enemyHit.health - 1;
			console.log("Enemy hp: ", enemyHit.health);

			// Kill enemy if health <= 0
			if (enemyHit.health <= 0)
			{
			   enemyHit.setActive(false).setVisible(false);
			}

			// Destroy bullet
			bulletHit.setActive(false).setVisible(false);
		}
	}

	playerHitCallback(playerHit, bulletHit)
	{
		// Reduce health of player
		if (bulletHit.active === true && playerHit.active === true)
		{
			playerHit.health = playerHit.health - 1;
			console.log("Player hp: ", playerHit.health);

			// Kill hp sprites and kill player if health <= 0
			if (playerHit.health == 2)
			{
				hp3.destroy();
			}
			else if (playerHit.health == 1)
			{
				hp2.destroy();
			}
			else
			{
				hp1.destroy();
				// Game over state should execute here
			}

			// Destroy bullet
			bulletHit.setActive(false).setVisible(false);
		}
	}

	enemyFire(enemy, player, time, gameObject)
	{
		if (enemy.active === false)
		{
			return;
		}

		if ((time - enemy.lastFired) > 1000)
		{
			enemy.lastFired = time;

			// Get bullet from bullets group
			var bullet = enemyBullets.get().setActive(true).setVisible(true);

			if (bullet)
			{
				bullet.fire(enemy, player);
				// Add collider between bullet and player
				gameObject.physics.add.collider(player, bullet, playerHitCallback);
			}
		}
	}

	// Ensures sprite speed doesnt exceed maxVelocity while update is called
	constrainVelocity(sprite, maxVelocity)
	{
		if (!sprite || !sprite.body)
		  return;

		var angle, currVelocitySqr, vx, vy;
		vx = sprite.body.velocity.x;
		vy = sprite.body.velocity.y;
		currVelocitySqr = vx * vx + vy * vy;

		if (currVelocitySqr > maxVelocity * maxVelocity)
		{
			angle = Math.atan2(vy, vx);
			vx = Math.cos(angle) * maxVelocity;
			vy = Math.sin(angle) * maxVelocity;
			sprite.body.velocity.x = vx;
			sprite.body.velocity.y = vy;
		}
	}

	// Ensures reticle does not move offscreen
	constrainReticle(reticle)
	{
		var distX = this.reticle.x-this.player.x; // X distance between player & reticle
		var distY = this.reticle.y-this.player.y; // Y distance between player & reticle

		// Ensures reticle cannot be moved offscreen (player follow)
		if (distX > 800)
			reticle.x = this.player.x+800;
		else if (distX < -800)
			reticle.x = this.player.x-800;

		if (distY > 600)
			reticle.y = this.player.y+600;
		else if (distY < -600)
			reticle.y = this.player.y-600;
	}
  
    update() {
	    // Rotates player to face towards reticle
		this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

		// Rotates enemy to face towards player
		this.enemy.rotation = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

		//Make reticle move with player
		this.reticle.body.velocity.x = this.player.body.velocity.x;
		this.reticle.body.velocity.y = this.player.body.velocity.y;

		// Constrain velocity of player
		this.constrainVelocity(this.player, 650);

		// Constrain position of constrainReticle
		this.constrainReticle(this.reticle);

		// Make enemy fire
		this.enemyFire(this.enemy, this.player, this.time, this);
		
		this.player.setAccelerationX(0);
		this.player.setAccelerationY(0);
		this.reticle.setAccelerationX(0);
		this.reticle.setAccelerationY(0);

		if (this.moveKeys.up.isDown)
		{
			this.player.setAccelerationY(-7000);
			this.reticle.setAccelerationY(-7000);
		}
		else if (this.moveKeys.down.isDown)
		{
			this.player.setAccelerationY(7000);
			this.reticle.setAccelerationY(7000);
		}
		
		if (this.moveKeys.left.isDown)
		{
			this.player.setAccelerationX(-7000);
			this.reticle.setAccelerationX(-7000);
		}
		else if (this.moveKeys.right.isDown)
		{
			this.player.setAccelerationX(7000);
			this.reticle.setAccelerationX(7000);
		}
		
/* 		if (this.moveKeys.up.isDown)
		{
			this.player.y-=3;
			this.reticle.y-=3;
		}
		else if (this.moveKeys.down.isDown)
		{
			this.player.y+=3;
			this.reticle.y+=3;
		}
		
		if (this.moveKeys.left.isDown)
		{
			this.player.x-=3;
			this.reticle.x-=3;
		}
		else if (this.moveKeys.right.isDown)
		{
			this.player.x+=3;
			this.reticle.x+=3;
		} */
		
		
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
