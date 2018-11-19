In your updateCell function code, you are allowed to enter a line like this

let >local< = $(NW,N,NE,W,E,SW,S,SE) ~ [0];

The format has to match correctly.
This particular line of code will be transformed into the block of code at the bottom of this README

inside $(...), you have to specify offsets of the current cell you're looking at. The format is
-First: N or S, followed by a number(optional) which specifies how far north or south.
  -If the number is not specified, the amount north or south is assumed to be 1.
-Second: W or S, followed by a number(optional) which specifies how far west or east.
  -If the number is not specified, the amount west or east is assumed to be 1.
-The user may choose to omit the First or Second part, but not both(cuz otherwise you would literally have
nothing).

The $(...) is an array of these offsets.

Now, as for the ~ [0]
Essentially, after the ~, you specify an array of numbers that one should consider to be the "state" of a
cell that is out of bounds. Keep in mind that all cells have an array of state, so similarly we give an array
of state here. In this case, [0] means that the cells that are out of bounds are considered to have
bound.state[0] = 0.

So what do you get out of writing out a line like this? Well, it lets you define a neighborhood around the cell.
In this case, it'll generate references to the cells with the specified offsets with the names NW,N,NE,...,
so you can easily access the cells that are around your cell. It also puts all of them in an array, so you can
iterate over your neighborhood.

// THIS CODE HAS BEEN GENERATED USING SYNTAX SUGAR
let def = {state: [0]};
let NW,N,NE,W,E,SW,S,SE;

if(posR - 1 >= 0 && posC - 1 >= 0)
	NW = grid[posR - 1][posC - 1];
else
	NW = def;

if(posR - 1 >= 0)
	N = grid[posR - 1][posC];
else
	N = def;

if(posR - 1 >= 0 && posC + 1 < cols)
	NE = grid[posR - 1][posC + 1];
else
	NE = def;

if(posC - 1 >= 0)
	W = grid[posR][posC - 1];
else
	W = def;

if(posC + 1 < cols)
	E = grid[posR][posC + 1];
else
	E = def;

if(posR + 1 < rows && posC - 1 >= 0)
	SW = grid[posR + 1][posC - 1];
else
	SW = def;

if(posR + 1 < rows)
	S = grid[posR + 1][posC];
else
	S = def;

if(posR + 1 < rows && posC + 1 < cols)
	SE = grid[posR + 1][posC + 1];
else
	SE = def;

let local = [NW,N,NE,W,E,SW,S,SE];
// THIS CODE HAS BEEN GENERATED USING SYNTAX SUGAR
