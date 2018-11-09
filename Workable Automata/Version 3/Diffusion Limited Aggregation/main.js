function startSite()
{
	console.log("The script has begun");

	// Settings for the CA
	let rows = 200;
	let cols = 200;
	let cellWidth = 5;
	let delay = 1;

	// Create the board, set the initialization and update function of the CA
	let board = new Board(rows,cols);
	board.setInitBoard(diffusionInitBoard);
	board.initializeBoard();
	board.setCellUpdate(diffusionUpdateCell);

	// Create the drawer, set the drawing function of the CA
	let drawer = new Drawer(board,cellWidth);
	drawer.setDrawBoard(diffusionDrawBoard);

	drawer.startDrawing(delay);
	// drawer.drawFrame();
}

// DIFFUSION LIMITED AGGREGATION EXAMPLE:
// 0 is empty cell, 1 is red cell, 2 is white cell
//--------------------------------------------------------------

// We'll say 1/18 chance of producing a red cell
// and we'll set the cell in the middle of the grid to white
function diffusionInitBoard()
{
	let result = create2DArray(this.rows,this.cols);

	for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
			let temp = new Cell(this,1,r,c);

			let rand = Math.floor(Math.random()*18);
			if(rand == 0)
			{
				temp.setCurrentState(0,1);
				temp.setFutureState(0,1);
			}
			else
			{
				temp.setCurrentState(0,0);
				temp.setFutureState(0,0);
			}

			result[r][c] = temp;
		}
	}	

	let center = result[Math.floor(this.rows/2)][Math.floor(this.cols/2)];
	center.setCurrentState(0,2);
	center.setFutureState(0,2);

	this.grid = result;
}

function diffusionUpdateCell()
{

	let grid = this.board.grid;
	let currState = grid[this.posR][this.posC].state[0];

	// debugging
	// console.log("current state: " + currState);

	if(currState == 2 || currState == 0)
		return;

	// console.log("Evaluating: (" + this.posR + "," + this.posC + ")");

	let rows = this.board.rows;
	let cols = this.board.cols;

	let up = this.posR - 1;
	let down = this.posR + 1;
	let left = this.posC - 1;
	let right = this.posC + 1;

	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 2)
		this.setFutureState(0,2);
	else if(up >= 0 && grid[up][this.posC].state[0] == 2)
		this.setFutureState(0,2);
	else if(up >= 0 && right < cols && grid[up][right].state[0] == 2)
		this.setFutureState(0,2);
	else if(left >= 0 && grid[this.posR][left].state[0] == 2)
		this.setFutureState(0,2);
	else if(right < cols && grid[this.posR][right].state[0] == 2)
		this.setFutureState(0,2);
	else if(down < rows && left >= 0 && grid[down][left].state[0] == 2)
		this.setFutureState(0,2);
	else if(down < rows && grid[down][this.posC].state[0] == 2)
		this.setFutureState(0,2);
	else if(down < rows && right < cols && grid[down][right].state[0] == 2)
		this.setFutureState(0,2);

	// Means one of the conditions above happened
	if(this.futureState[0] == 2)
		return;

	let rand = Math.floor(Math.random()*8);
	// console.log("random number generated: " + rand);

	let neighR,neighC;
	switch(rand)
	{
		case 0:
			neighR = up;
			neighC = left;
			break;
		case 1:
			neighR = up;
			neighC = this.posC;
			break;
		case 2:
			neighR = up;
			neighC = right;
			break;
		case 3:
			neighR = this.posR;
			neighC = left;
			break;
		case 4:
			neighR = this.posR;
			neighC = right;
			break;
		case 5:
			neighR = down;
			neighC = left;
			break;
		case 6:
			neighR = down;
			neighC = this.posC;
			break;
		case 7:
			neighR = down;
			neighC = right;
			break;
	}

	// debugging
	// console.log("resulting choice: (" + neighR + "," + neighC + ")");

	// If neighbor is not valid, don't do anything
	if(neighR < 0 || neighR >= rows || neighC < 0 || neighC >= cols)
	{
		// debugging
		// console.log("out of bounds\n\n");
		this.setFutureState(0,1);
		return;
	}

	let target = grid[neighR][neighC];
	// console.log("target's current, and future state: " + target.state[0] + ", " + target.futureState);

	// If the spot is not already empty, or its claimed by another cell,
	// leave it alone.
	if(target.state[0] != 0 || target.futureState[0] != 0)
	{
		// console.log("left it alone\n\n");
		this.setFutureState(0,1);
		return;
	}

	// console.log("moved into the empty cell");
	this.setFutureState(0,0);
	target.setFutureState(0,1);

	// console.log("\n\n");
}

function diffusionDrawBoard()
{
	// For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw black on the whole thing
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[r][c];
			let state = tempCell.state[0];

			if(state == 1) // red cells
			{
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(r*cellWidth,c*cellWidth,cellWidth,cellWidth);
			}
			else if(state == 2) // white cells
			{
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(r*cellWidth,c*cellWidth,cellWidth,cellWidth);	
			}
		}
	}
}

// GAME OF LIFE EXAMPLE:
//--------------------------------------------------------------

function gameOfLifeInitBoard()
{
	let result = create2DArray(this.rows,this.cols);

	for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
			let val = Math.floor(Math.random()*2);

			let temp = new Cell(this,1,r,c);
			temp.setCurrentState(0,val);
			temp.setFutureState(0,0);
			result[r][c] = temp;
		}
	}

	this.grid = result;
}

function gameOfLifeUpdateCell()
{
	let count = 0;

	let grid = this.board.grid;
	let rows = this.board.rows;
	let cols = this.board.cols;

	let up = this.posR - 1;
	let down = this.posR + 1;
	let left = this.posC - 1;
	let right = this.posC + 1;

	// console.log("(" + this.posR + "," + this.posC + ")'s evaluation");
	// console.log("rows: " + rows);
	// console.log("cols: " + cols);

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 1)
		count++;

	if(up >= 0 && grid[up][this.posC].state[0] == 1)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 1)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[this.posR][left].state[0] == 1)
		count++;

	if(right < cols && grid[this.posR][right].state[0] == 1)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 1)
		count++;

	if(down < rows && grid[down][this.posC].state[0] == 1)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 1)
		count++;


	// Updating state
	let nextState;

	if(this.state[0] == 0)
	{
		if(count == 3)
			nextState = 1;
		else
			nextState = 0;
	}
	else
	{
		if(count < 2 || count > 3)
			nextState = 0;
		else
			nextState = 1;
	}

	// console.log("Live neighbors: " + count + "\n\n");
	this.setFutureState(0,nextState);
}

function gameOfLifeDrawBoard()
{
	// For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw black on the whole thing
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	// Draw all of the lives cells as white
	ctx.fillStyle = "#FFFFFF";
	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[r][c];
			let isAlive = tempCell.state[0];

			if(isAlive == 1)
				ctx.fillRect(r*cellWidth,c*cellWidth,cellWidth,cellWidth);
		}
	}
}

// HEAVY DEBUGGING:
// let count = 0;

// let grid = this.board.grid;
// let rows = this.board.rows;
// let cols = this.board.cols;

// let up = this.posR - 1;
// let down = this.posR + 1;
// let left = this.posC - 1;
// let right = this.posC + 1;

// console.log("(" + this.posR + "," + this.posC + ")'s evaluation");
// console.log("rows: " + rows);
// console.log("cols: " + cols);

// // COUNTING LIVE NEIGHBORS
// // upper three neighbors
// if(up >= 0 && left >= 0)
// {
// 	let value = grid[up][left].state[0];

// 	console.log("UL's value: " + value);
// 	if(value == 1)
// 		count++;
// }
// else
// 	console.log("UL is out of bounds");

// if(up >= 0)
// {
// 	let value = grid[up][this.posC].state[0];

// 	console.log("UC's value: " + value);
// 	if(value == 1)
// 		count++;
// }
// else
// 	console.log("UC is out of bounds");

// if(up >= 0 && right < cols)
// {
// 	let value = grid[up][right].state[0];

// 	console.log("UR's value: " + value);
// 	if(value == 1)
// 		count++;
// }
// else
// 	console.log("UR is out of bounds");

// // middle two neighbors
// if(left >= 0)
// {
// 	let value = grid[this.posR][left].state[0];

// 	console.log("CL's value: " + value);
// 	if(value == 1)
// 		count++;
// }
// else
// 	console.log("CL is out of bounds");

// if(right < cols)
// {
// 	let value = grid[this.posR][right].state[0];

// 	console.log("CR's value: " + value);
// 	if(value == 1)
// 		count++;
// }
// else
// 	console.log("CR is out of bounds");

// // bottom three neighbors
// if(down < rows && left >= 0 && grid[down][left].state[0] == 1)
// 	count++;

// if(down < rows && grid[down][this.posC].state[0] == 1)
// 	count++;

// if(down < rows && right < cols && grid[down][right].state[0] == 1)
// 	count++;



// // Updating state
// let nextState;

// if(this.state[0] == 0)
// {
// 	if(count == 3)
// 		nextState = 1;
// 	else
// 		nextState = 0;
// }
// else
// {
// 	if(count < 2 || count > 3)
// 		nextState = 0;
// 	else
// 		nextState = 1;
// }

// console.log("Live neighbors: " + count + "\n\n");
// this.setFutureState(0,nextState);