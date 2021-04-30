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

/* 

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
        
        this.bouncy = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'logo', 'assets/phaser.png' );
    }
    
    create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        this.bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'logo' );
        
        // Make it bounce off of the world bounds.
        this.bouncy.body.collideWorldBounds = true;
        
        // Make the camera shake when clicking/tapping on it.
        this.bouncy.setInteractive();
        this.bouncy.on( 'pointerdown', function( pointer ) {
            this.scene.cameras.main.shake(500);
            });
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
        text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
    }
}

 */
 

class Tile {
	constructor(x, y, hasGoal, hasToken, scene)
	{
		this.x = x;
		this.y = y;
		this.hasGoal = hasGoal;
		this.hasToken = hasToken;
		this.color;
		//this.xPix = 25*x + 12.5*y;
		//this.yPix = 25*y + 12.5*x;
		this.xPix = 50 + 25*x;
		
		if (this.x%2==0){this.yPix = 50 + 25*y + 6.75;}
		else{this.yPix = 50 + 25*y - 6.75;}
		
		//this.xPix = 200;
		//this.yPix = 150;
		this.hex = scene.add.polygon(this.xPix, this.yPix, 
		[ 
		[this.xPix+25 , this.yPix], 
		[this.xPix+(25.0/2.0) , this.yPix+((Math.sqrt(3.0)*25.0)*0.5)], 
		[this.xPix-(25.0/2.0) , this.yPix+((Math.sqrt(3.0)*25.0)*0.5)], 
		[this.xPix-25 , this.yPix], 
		[this.xPix-(25.0/2.0) , this.yPix-((Math.sqrt(3.0)*25.0)*0.5)], 
		[this.xPix+(25.0/2.0) , this.yPix-((Math.sqrt(3.0)*25.0)*0.5)]
		],
		0x888888,
		1).setInteractive();
		//this.hex.setFillStyle(0x00ff00);
		
		
		this.circle = null;
		
		this.text = scene.add.text(this.xPix*2-37.5, this.yPix*2-25, this.x + "," + this.y, { font: '16px Courier', fill: '#00ff00' });
		
	}
	
}

//Creates a map of hexagonal tiles, 10x10 staggered.
function create_map(scene)
{
	var map = [];
	
	for (var i=0; i<10; ++i)
	{
		for (var j=0; j<10; ++j)
		{
			map.push(new Array(10));
		}
	}
	
	for (var i=0; i<10; ++i)
	{
		for (var j=0; j<10; ++j)
		{
			map[i][j] = new Tile(j, i, 0, 0, scene);
		}
	}
	return map;
}

//This scene will contain the main menu which allows you to choose between a single example puzzle, and the puzzle build/solve modes.
var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
		
		var map = create_map(this);
		
		//var tester = new Tile(1, 1, 0, 0, this)
		//var circle = this.add.circle(200, 150, 25, 0xff0000);
		//circle.setFillStyle(0x0000ff);
		
/* 		for (row in map)
		{
			for (tile in row)
			{
				//
			}
		} */

    }
	

});

//This will contain the example puzzle.
var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {

    }
	

});

//This will contain the build scene which will be followed by a solving scene.
var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'sceneC' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {

    }
	

});

//This will contain the scene for solving the previously built puzzle.
var SceneD = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneD ()
    {
        Phaser.Scene.call(this, { key: 'sceneD' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
		
    }
	

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'game',
    scene: [ SceneA, SceneB, SceneC, SceneD ],
    physics: {
        default: 'matter'
    },
};

var game = new Phaser.Game(config);
