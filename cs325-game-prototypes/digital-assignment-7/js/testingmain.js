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

var board_size;
var p1_order;
var p2_order;
var turn;
var board;
var pawns;


class Pawn {
	constructor(owner, strength, c, r, scene)
	{
		this.owner = owner;
		this.strength = strength;
		this.circ = 0;
		this.x = 100 + (300/board_size) + c*(600/board_size);
		this.y = r * (600/board_size);
		
		if (this.owner == 0)
		{
			this.circ = scene.add.circle(this.x, this.y, (200/board_size), 0x000000, 0x000000); //invisible, unowned pawn placeholder.
		}
		else if (this.owner == 1)
		{
			this.circ = scene.add.circle(this.x, this.y, (200/board_size), 0xb80000); 
			this.strength = scene.add.text(this.x-8, this.y-16, this.strength, { font: '32px Courier', fill: '#ffffff' });
			
			
		}
		else if (this.owner == 2)
		{
			this.circ = scene.add.circle(this.x, this.y, (200/board_size), 0x0000b8); 
			this.strength = scene.add.text(this.x-8, this.y-16, this.strength, { font: '32px Courier', fill: '#ffffff' });
		}
	}
	
}

class Tile {
  constructor(pawn, x, y) {
	  this.pawn = pawn;
	  //this.owner = 0;
	  this.x = x;
	  this.y = y;
  }

}
class Board {
	constructor(scene, size, p1, p2) {
		this.size = size;
		this.scene = scene;
		this.p1 = p1;
		this.p2 = p2;
		this.mat = new Array();
		
		for (var i=0; i<size; ++i)
		{
			this.mat.push(new Array());
			
			for (var j=0; j<size; ++j)
			{
				this.mat[i].push(0);
				console.log("%d\n", this.mat[i][j]);
			}
		}
		
		
		
		//var color_parity = 1; //1 for light, -1 for dark.
		var this_pawn;
		var this_owner;
		var this_str;
		for (var row=0; row<size; ++row)
		{
			for (var col=0; col<size; ++col)
			{
				if (col == 0)
				{
					this_pawn = new Pawn(1, p1_order[row], col, row, scene);
				}
				else if (col == (size-1))
				{
					this_pawn = new Pawn(2, p2_order[row], col, row, scene);
				}
				else
				{
					this.mat[col][row] = new Pawn(0,0,col,row); //place empty pawn
				}
/* 				if (color_parity > 0) { mat[i][j].color = "0xbababa"; }
				else { mat[i][j].color = "0x5c5c5c"; }
				
 				color_parity *= -1;
				if (size%2==0)&&(row==size-1)
				{
					color_parity *= -1;
				}  */
			}
		}
		
		
		//fill starting pawns
		for (var n=0; n<size; ++n)
		{
			this.mat[0][n].strength = p1_order[n];
			this.mat[0][n].owner = 1;
			this.mat[size-1][n].strength = p2_order[n];
			this.mat[size-1][n].owner = 2;
		}
		
		
		var x_offset =  100 + (300/this.size);
		var y_offset = (300/this.size);
		var diff = (600/this.size);
		var x_pos;
		var y_pos;
		var this_pawn;
		
		for (var row=0; row<this.size; ++row)
		{
			for (var col=0; col<this.size; ++col)
			{
				x_pos = x_offset + col*diff;
				y_pos = y_offset + row*diff;
				
				
			}
		}
		
	
	}
	
	get_tile(x, y)
	{
		return this.mat[x][y];
	}
	
	display(scene)
	{
		var grid = scene.add.grid(400, 300, 600, 600, (600/this.size), (600/this.size), 0xbababa).setAltFillStyle(0x5c5c5c).setOutlineStyle();
	}


	move(pawn_tile, target_tile)
	{
		if (target_tile.owner !=0)
		{
			return;
		}
	}

	select_pawn(pawn_tile)
	{
		if (pawn_tile.owner == 0)
		{
			return;
		}
		
		var x_offset =  100 + (300/this.size);
		var y_offset = (300/this.size);
		var diff = (600/this.size);
		var x_pos;
		var y_pos;
		
		for (var row=0; row<this.size; ++row)
		{
			for (var col=0; col<this.size; ++col)
			{
				x_pos = x_offset + col*diff;
				y_pos = y_offset + row*diff;
				
				if (this.mat[col][row].owner == 1)
				{
					scene.add.circle(x_pos, y_pos, (200/this.size), 0xb80000);
					scene.add.text(x_pos-8, y_pos-16, this.mat[col][row].pawn, { font: '32px Courier', fill: '#ffffff' });
				}
				else if (this.mat[col][row].owner == 2)
				{
					scene.add.circle(x_pos, y_pos, (200/this.size), 0x0000b8);
					scene.add.text(x_pos-8, y_pos-16, this.mat[col][row].pawn, { font: '32px Courier', fill: '#ffffff' });
				}
				
				
			}
		}
		
	}
	
	

}

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
		
	var prompt = this.add.text(10, 10, 'Board size (Max:9, Quick:6):', { font: '32px Courier', fill: '#ffffff' });

	var textEntry = this.add.text(10, 50, '', { font: '32px Courier', fill: '#ffff00' });

	var listener = this.input.keyboard.on('keydown', function (event) {

		if (event.keyCode === 8 && textEntry.text.length > 0)
		{
			textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
		}
		else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
		{
			textEntry.text += event.key;
		}
		else if (event.keyCode === 13)
		{
			board_size = parseInt(textEntry.text);
			textEntry.destroy();
			prompt.destroy();

			game.scene.start('sceneB');
			listener.destroy();

		}
		
	})
        

    }

});

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
	
	
	
	var prompt = this.add.text(10, 10, 'Player 1 starting line (123...N):', { font: '32px Courier', fill: '#ffffff' });

	var textEntry = this.add.text(10, 50, '', { font: '32px Courier', fill: '#ffff00' });

	var listener = this.input.keyboard.on('keydown', function (event) {

		if (event.keyCode === 8 && textEntry.text.length > 0)
		{
			textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
		}
		else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
		{
			textEntry.text += event.key;
		}
		else if (event.keyCode === 13)
		{
			p1_order = textEntry.text;
			textEntry.destroy();
			prompt.destroy();
			console.log(p1_order);
			game.scene.start('sceneC');
			listener.destroy();
			
		}
		
	})
        
    }

});

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
		
	var prompt = this.add.text(10, 10, 'Player 2 starting line (123...N):', { font: '32px Courier', fill: '#ffffff' });

	var textEntry = this.add.text(10, 50, '', { font: '32px Courier', fill: '#ffff00' });

	var listener = this.input.keyboard.on('keydown', function (event) {

		if (event.keyCode === 8 && textEntry.text.length > 0)
		{
			textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
		}
		else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
		{
			textEntry.text += event.key;
		}
		else if (event.keyCode === 13)
		{
			p2_order = textEntry.text;
			textEntry.destroy();
			prompt.destroy();
			console.log(p2_order);
			game.scene.start('sceneD');
			listener.destroy();

		}
		
	})
        
    }

});

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
		
		//pawns = new Container(this);
		
		board = new Board(this, board_size, p1_order, p2_order);
		board.display(this);
        
    }
	
	//update: function ()
	//{
	//	
	//}

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
