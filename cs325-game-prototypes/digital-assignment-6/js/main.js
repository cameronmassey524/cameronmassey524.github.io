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
var selection = 0;
var cursorKeys;
var hud;

//class Pawn {
//}

function factorial(n)
{
	var product = 1;
	for (var i=2; i<=n; ++i)
	{
		product*=i;
	}
	return product;
}

class Hud {
	constructor(scene)
	{
		this.turn = 1;
		this.p1_name = "Player1"
		this.p1_energy = board_size;
		this.p1_health = factorial(board_size);
		this.p2_name = "Player2";
		this.p2_energy = 0;
		this.p2_health = factorial(board_size);
		this.p1_name_label = scene.add.text(10, 10, this.p1_name, { font: '20px Courier', fill: '#ffffff' });
		this.p1_energy_label = scene.add.text(10, 300, ("Energy: \n" + this.p1_energy), { font: '20px Courier', fill: '#ffffff' });
		this.p1_health_label = scene.add.text(10, 500, ("Health: \n" + this.p1_health), { font: '20px Courier', fill: '#ffffff' });
		this.p2_name_label = scene.add.text(710, 10, this.p2_name, { font: '20px Courier', fill: '#ffffff' });
		this.p2_energy_label = scene.add.text(710, 300, ("Energy: \n" + this.p2_energy), { font: '20px Courier', fill: '#ffffff' });
		this.p2_health_label = scene.add.text(710, 500, ("Health: \n" + this.p2_health), { font: '20px Courier', fill: '#ffffff' });
	}
	
	update()
	{
	}
	
	set_p1_energy(x)
	{
		p1_energy = x;
		p1_energy_label.setText(("Energy: " + x));
	}

	set_p1_health(x)
	{
		p1_health = x;
		p1_health_label.setText(("Health: " + x));
	}

	set_p2_energy(x)
	{
		p2_energy = x;
		p2_energy_label.setText(("Energy: " + x));
	}

	set_p2_health(x)
	{
		p2_health = x;
		p2_health_label.setText(("Health: " + x));
	}
	
}

class Tile {
  constructor(col, row, strength, owner, selected) {
	  this.strength = 0;
	  this.owner = 0;
	  this.col = col;
	  this.row = row;
	  this.circ = 0;
	  this.text = 0;
	  this.selected = 0;
  }
  
  deselect()
  {
	  this.selected = 0;
  }
  select()
  {
	  this.selected = 1;
  }
  swap(target)
  {
	  //[[this.col],[target.col]] =[[target.col],[this.col]];
	  //[[this.row],[target.row]] =[[target.row],[this.row]];
	  [[this.strength],[target.strength]] =[[target.strength],[this.strength]];
	  [[this.owner],[target.owner]] =[[target.owner],[this.owner]];
	  [[this.selected],[target.selected]] =[[target.selected],[this.selected]];
	  //[[this], [target]] = [[target], [this]];
	  return target;

  }
  attack(target)
  {
	  [[this.strength],[target.strength]] = [[this.strength-target.strength],[target.strength-this.strength]];
	  
	  if (this.strength <= 0)
	  {
		  this.owner = 0;
		  this.selected = 0;
	  }
	  if (target.strength <= 0)
	  {
		  target.owner = 0;
		  //target.selected = 0;
	  }

  }
  
  act(dir)
  {
	
	var t_col = selection.col; //target column starting point
	var t_row = selection.row; //taget row starting point
	
	switch(dir) // add or subtract 1 to t_col or t_row depending on direction
	{
		case 'r':
			t_col += 1;
			break;
		case 'l':
			t_col -= 1;
			break;
		case 'u':
			t_row -= 1;
			break;
		case 'd':
			t_row += 1;
			break;
	}
	
	var target = board.mat[t_row][t_col];
	if (target.owner==0) //Will move
	{
		console.log(dir + " Move\n");
		selection = selection.swap(target);
	}
	else if (target.owner==selection.owner) //Teammate at destination
	{
		console.log("Blocked by teammate\n");
	}
	else if ( (t_row >= board_size) || (t_col >= board_size) || (t_row<0) || (t_col<0)) //No more board space
	{
		console.log("Blocked by Edge\n");
	}
	else //Attacking opponent's piece
	{
		console.log("Attacking opponent\n");
		selection.attack(target);
	}
  }
  
}
class Board {
	constructor(size, p1, p2) {
		this.size = size;
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
		for (var row=0; row<size; ++row)
		{
			for (var col=0; col<size; ++col)
			{
				this.mat[row][col] = new Tile(col, row, 0, 0, 0);
/* 				if (color_parity > 0) { mat[i][j].color = "0xbababa"; }
				else { mat[i][j].color = "0x5c5c5c"; }
				
 				color_parity *= -1;
				if (size%2==0)&&(row==size-1)
				{
					color_parity *= -1;
				}  */
			}
		}
		
		for (var n=0; n<size; ++n)
		{
			//this.mat[0][n].strength = p1_order[n];
			//this.mat[0][n].owner = 1;
			//this.mat[size-1][n].strength = p2_order[n];
			//this.mat[size-1][n].owner = 2;
			
			this.mat[n][0].strength = p1_order[n];
			this.mat[n][0].owner = 1;
			this.mat[n][size-1].strength = p2_order[n];
			this.mat[n][size-1].owner = 2;
		}
	
	}
	
	display(scene)
	{
		scene.add.grid(400, 300, 600, 600, (600/this.size), (600/this.size), 0xbababa).setAltFillStyle(0x5c5c5c).setOutlineStyle();
		
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
				
				if (this.mat[row][col].owner == 1)
				{
					this.mat[row][col].circ = scene.add.circle(x_pos, y_pos, (200/this.size), 0xb80000);
					if (this.mat[row][col].selected == 1)
					{
						this.mat[row][col].circ.setFillStyle(0x00b800);
					}
					this.mat[row][col].text = scene.add.text(x_pos-8, y_pos-16, this.mat[row][col].strength, { font: '32px Courier', fill: '#ffffff' });
				}
				else if (this.mat[row][col].owner == 2)
				{
					this.mat[row][col].circ = scene.add.circle(x_pos, y_pos, (200/this.size), 0x0000b8);
					if (this.mat[row][col].selected == 1)
					{
						this.mat[row][col].circ.setFillStyle(0x00b800);
					}
					this.mat[row][col].text = scene.add.text(x_pos-8, y_pos-16, this.mat[row][col].strength, { font: '32px Courier', fill: '#ffffff' });
				}
				
				
				
			}
		}
	}
	
	click_to_tile(x, y)
	{
		if ((x<100) || (x>700))
		{
			return;
		}
		
		var row = Math.floor(y/(600/board_size));
		var col = Math.floor((x-100)/(600/board_size));
		//console.log("calculated col: %d\n", col);
		//console.log("calculated row: %d\n", row);
		return this.mat[row][col];
	}
	
	
	select_pawn(target)
	{
		if (target.owner == 0)
		{
			return;
		}
		target.selected = 1;
	}
	
	get_tile(c, r)
	{
		return this.mat[r][c];
	}
	
	swap_tiles(c1, r1, c2, r2)
	{
		var temp = this.mat[c1][r1];
		this.mat[c1][r1] = this.mat[c2][r2];
		this.mat[c2][r2] = temp;
	}
	
	swap(t1, t2)
	{
		var temp = t1;
		t1 = t2;
		t2 = temp;
	}
	
	move_pawn(pawn, dir)
	{
		if (pawn.selected!=1)
		{
			return;
		}
		if (dir=="u")
		{
			if (pawn.row-1>=0)
			{
				this.swap_tiles(pawn.c, pawn.r, pawn.c, pawn.r-1);
			}
		}
		if (dir=="r")
		{
			if (pawn.col+1<board_size)
			{
				this.swap_tiles(pawn.c, pawn.r, pawn.c+1, pawn.r);
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
		
	var prompt = this.add.text(10, 10, 'Enter board size (Max:9, Quick:6):', { font: '32px Courier', fill: '#ffffff' });

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
	
	
	
	var prompt = this.add.text(10, 10, 'Enter Player 1 starting line (123...N):', { font: '32px Courier', fill: '#ffffff' });

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
		
	var prompt = this.add.text(10, 10, 'Enter Player 2 starting line (123...N):', { font: '32px Courier', fill: '#ffffff' });

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
		
		cursorKeys = this.input.keyboard.createCursorKeys();
		var key_up = this.input.keyboard.addKey('W');
		var key_down = this.input.keyboard.addKey('S');
		var key_left = this.input.keyboard.addKey('A');
		var key_right = this.input.keyboard.addKey('D');
		var temp;
		var target;

		
		var grid;
		board = new Board(board_size, p1_order, p2_order);
		//this.add.grid(400, 300, 600, 600, (600/this.size), (600/this.size), 0xbababa).setAltFillStyle(0x5c5c5c).setOutlineStyle();
		board.display(this);
		
		hud = new Hud(this);
		
		this.input.on('pointerdown', function (pointer) {

			if ((selection.selected==1)) //deselect current (old) selection
			{
				//console.log("selection == %d\n", selection);
				//console.log("selection.selected == %d\n", selection.selected);
				selection.deselect();
			}
			
			//console.log('down');
			//console.log("x: %d\ny: %d", pointer.x, pointer.y);
			selection = board.click_to_tile(pointer.x, pointer.y);
			console.log("Owner: %d\n", selection.owner);
			console.log("Strength: " + selection.strength + "\n");
			if (selection.owner == 0)
			{
				board.display(this);
				return;
			}
			board.select_pawn(selection);
			board.display(this);
			

		}, this);
		
		key_right.on('down', function(event) {
			if ((selection.owner ==1)||(selection.owner==2)) 
			{
				selection.act('r');
				board.display(this);
			}
			
		}, this );
		key_left.on('down', function(event) {
			if ((selection.owner ==1)||(selection.owner==2)) 
			{
				selection.act('l');
				board.display(this);
			}
			
		}, this );
		key_up.on('down', function(event) {
			if ((selection.owner ==1)||(selection.owner==2)) 
			{
				selection.act('u');
				board.display(this);
			}
			
		}, this );
		key_down.on('down', function(event) {
			if ((selection.owner ==1)||(selection.owner==2)) 
			{
				selection.act('d');
				board.display(this);
			}
			
		}, this );
		
		
		
        
    },
	
	update: function ()
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
