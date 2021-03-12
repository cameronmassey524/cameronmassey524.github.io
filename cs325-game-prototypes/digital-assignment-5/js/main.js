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

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
/*         matter: {
            gravity: { y: 300 },
            debug: true
        } */
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var ball;


var key_w;
var key_a;
var key_s;
var key_d;
var key_q;
var key_e;
var key_r;

var mouse;



var weapon_type = 0; //0 for rocket, 1 for beam, 2 for cannon.
var ammo_rocket;
var ammo_beam;
var ammo_cannon;
var next_action = 0;
var weapon_text = "";

var Rail = new Phaser.Class({

	Extends: Phaser.GameObjects.Image,

	initialize:

	// Rail Constructor
	function Rail (scene)
	{
		Phaser.GameObjects.Image.call(this, scene, 0, 0, 'rail');
		this.speed = 10;
		this.born = 0;
		this.direction = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.setSize(12, 12, true);
		this.setScale(3);
		this.scaleX = 10;
	},

	// Fires a rail from the player to the reticle
	fire: function (shooter, target, time)
	{
		if (next_action > time)
		{
			return;
		}
		next_action = time + 1333; //cannon/railgun  has 1.333 sec delay after firing
		
		this.setPosition(shooter.x, shooter.y); // Initial position
		this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

		// Calculate X and y velocity of rail to moves it from shooter to target
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

		//this.rotation = shooter.rotation; // angle rail with shooters rotation
		this.angle = this.direction * (180/Math.PI) * -1 + 90;
		this.born = 0; // Time since new rail spawned
	},

	// Updates the position of the rail each cycle
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

var Cell = new Phaser.Class({

	Extends: Phaser.GameObjects.Image,

	initialize:

	// Cell Constructor
	function Cell (scene)
	{
		Phaser.GameObjects.Image.call(this, scene, 0, 0, 'cell');
		this.speed = 3;
		this.born = 0;
		this.direction = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.setSize(12, 12, true);
		this.scaleX = 2;
	},

	// Fires a cell from the player to the reticle
	fire: function (shooter, target, time)
	{
		if (next_action > time)
		{
			return;
		}
		next_action = time + 50;
		
		this.setPosition(shooter.x, shooter.y); // Initial position
		this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

		// Calculate X and y velocity of cell to moves it from shooter to target
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

		//this.rotation = shooter.rotation; // angle cell with shooters rotation
		this.angle = this.direction * (180/Math.PI) * -1 + 90;
		this.born = 0; // Time since new cell spawned
	},

	// Updates the position of the cell each cycle
	update: function (time, delta)
	{
		this.x += this.xSpeed * delta;
		this.y += this.ySpeed * delta;
		this.born += delta;
		if (this.born > 150)
		{
			this.setActive(false);
			this.setVisible(false);
		}
	}

});

var Rocket = new Phaser.Class({

	Extends: Phaser.GameObjects.Image,

	initialize:

	// Rocket Constructor
	function Rocket (scene)
	{
		Phaser.GameObjects.Image.call(this, scene, 0, 0, 'rocket');
		this.speed = 0.6;
		this.born = 0;
		this.direction = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.setSize(12, 12, true);
	},

	// Fires a rocket from the player to the reticle
	fire: function (player, target, time)
	{
		if (next_action > time)
		{
			return;
		}
		next_action = time + 750; //rocket has 0.75 sec delay after firing
		
		this.setPosition(player.x, player.y); // Initial position
		this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

		// Calculate X and y velocity of rocket to moves it from player to target
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

		//this.rotation = player.rotation; // angle rocket with players rotation
		//this.rotation = this.direction;
		this.angle = this.direction * (180/Math.PI) * -1 + 90;
		this.born = 0; // Time since new rocket spawned
	},

	// Updates the position of the rocket each cycle
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



var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/textures/sky.png');
    this.load.image('ground', 'assets/textures/platform.png');
    this.load.image('star', 'assets/textures/star.png');
    this.load.image('bomb', 'assets/textures/bomb.png');
	this.load.image('target', 'assets/demoscene/ball.png');
	this.load.image('rocket', 'assets/sprites/bullets/bullet6.png');
	this.load.image('cell', 'assets/sprites/bullets/cell.png');
	this.load.image('rail', 'assets/sprites/bullets/railspiral.png');
    this.load.spritesheet('dude', 'assets/animations/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
	
	
	this.player = player;
	
	//weapon text
	this.weapon_text = this.add.text(250, 550, "Equip a weapon (Q, E, R)", { font: "24px Arial" });
	
	
	//quakeball stuff
	this.reticle = this.physics.add.sprite(800, 700, 'target');
	this.reticle.setDisplaySize(25, 25).setCollideWorldBounds(true);
	this.reticle.body.setAllowGravity(false);
	
	
	//physics groups for attacks
	this.rockets = this.physics.add.group({ 
	classType: Rocket, 
	runChildUpdate: true ,
	allowGravity: false
	});
	
	this.cells = this.physics.add.group({ 
	classType: Cell, 
	runChildUpdate: true ,
	allowGravity: false
	});
	
	this.rails = this.physics.add.group({ 
	classType: Rail, 
	runChildUpdate: true ,
	allowGravity: false
	});
	
	
	

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

key_w = this.input.keyboard.addKey('W');
key_a = this.input.keyboard.addKey('A');
key_s = this.input.keyboard.addKey('S');
key_d = this.input.keyboard.addKey('D');
key_q = this.input.keyboard.addKey('Q');
key_e = this.input.keyboard.addKey('E');
key_r = this.input.keyboard.addKey('R');

mouse = this.input.activePointer;
this.mouse = mouse;


	//Shoot when mouse clicked
	//this.input.on('pointerdown', function (pointer, time, lastFired) {
/* 	this.input.on('pointerdown', function (pointer, time, lastFired) {
		console.log("Mouse Down");
		//if (this.player.active === false)
		//	return;
	
		if (next_action > this.time.now)
		{
			return;
		}
	
	
		if (weapon_type==0) //if rocket equipped
		{
			// Get rocket from rockets group
			var rocket = this.rockets.get().setActive(true).setVisible(true);

			if (rocket)
			{
				rocket.fire(this.player, this.reticle, this.time.now);
				//this.physics.add.collider(this.ball, rocket, this.ballHitCallback);
			}
		}
		
		else if (weapon_type==1) //if beam equipped
		{
			// Get cell from cells group
			var cell = this.cells.get().setActive(true).setVisible(true);

			if (cell)
			{
				cell.fire(this.player, this.reticle, this.time.now);
				//this.physics.add.collider(this.ball, rocket, this.ballHitCallback);
			}

		}
		
		else if (weapon_type==2) //if cannon/railgun equipped
		{
			// Get rail from rails group
			var rail = this.rails.get().setActive(true).setVisible(true);

			if (rail)
			{
				rail.fire(this.player, this.reticle, this.time.now);
				//this.physics.add.collider(this.ball, rocket, this.ballHitCallback);
			}
		}
		
	}, this); */
	
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
	


this.physics.add.collider(player, platforms);

}

function update ()
{
    if (key_a.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (key_d.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (key_w.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
	
	if (key_q.isDown)
	{
		this.weapon_text.setText("Rockets");
		this.weapon_text.setFill("#F90F00");
		weapon_type = 0;
	}
	if (key_e.isDown)
	{
		this.weapon_text.setText("Energy Beam");
		this.weapon_text.setFill("#00F9EF");
		weapon_type = 1;
	}
	if (key_r.isDown)
	{
		this.weapon_text.setText("Gauss Cannon");
		this.weapon_text.setFill("#10F900");
		weapon_type = 2;
	}
	if (mouse.isDown)
	{
		
			console.log("Mouse Down");
			//if (this.player.active === false)
			//	return;
		
			if (next_action > this.time.now)
			{
				return;
			}
		
		
			if (weapon_type==0) //if rocket equipped
			{
				// Get rocket from rockets group
				var rocket = this.rockets.get().setActive(true).setVisible(true);

				if (rocket)
				{
					rocket.fire(this.player, this.reticle, this.time.now);
					//this.physics.add.collider(this.ball, rocket, this.ballHitCallback);
				}
			}
			
			else if (weapon_type==1) //if beam equipped
			{
				// Get cell from cells group
				var cell = this.cells.get().setActive(true).setVisible(true);

				if (cell)
				{
					cell.fire(this.player, this.reticle, this.time.now);
					//this.physics.add.collider(this.ball, rocket, this.ballHitCallback);
				}

			}
			
			else if (weapon_type==2) //if cannon/railgun equipped
			{
				// Get rail from rails group
				var rail = this.rails.get().setActive(true).setVisible(true);

				if (rail)
				{
					rail.fire(this.player, this.reticle, this.time.now);
					//this.physics.add.collider(this.ball, rocket, this.ballHitCallback);
				}
			}
			
		
	}

}
