function startSite()
{
	console.log("The script has begun");

	// Settings for the CA
	let rows = 10;
	let cols = 10;
	let cellWidth = 50;
	let delay = 17;

	// EUREKA!!! IT WORKS
	// board.initializeBoard();
	// printGameOfLifeBoard(board.grid);

	// Create the board, set the initialization and update function of the CA
	let board = new Board(rows,cols);
	board.setInitBoard(rule30InitBoard);
	board.initializeBoard();
	board.setCellUpdate(rule30UpdateCell);
	console.log("CHECK 2 " + board.grid);

	// Create the drawer, set the drawing function of the CA
	let drawer = new Drawer(board,cellWidth);
	drawer.setDrawBoard(rule30DrawBoard);

	drawer.startDrawing(delay);
	// drawer.drawFrame();
}

function rule30InitBoard()
{
	let result = create2DArray(this.rows,this.cols);

	for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
			let temp = new Cell(this,1,r,c);
			temp.setCurrentState(0,1);
			temp.setFutureState(0,1);
			result[r][c] = temp;
		}
	}

	let centerC = Math.floor(this.cols/2);
	result[0][centerC].setCurrentState(0,0);
	result[0][centerC].setFutureState(0,0);

	this.grid = result;
	console.log("CHECK 1" + result);
}

function rule30UpdateCell()
{
	if(this.posR == 0 || this.posC == 0 || this.posC >= this.board.rows)
	{
		this.setFutureState(0,this.state[0]);
		return;
	}

	let grid = this.board.grid;
	let up = this.posR - 1;

	let upleft = grid[up][this.posC-1];
	let upcenter = grid[up][this.posC];
	let upright = grid[up][this.posC+1];

	if(upleft == 0 && upcenter == 0 && upright == 0)
		this.setFutureState(0,1);
	if(upleft == 0 && upcenter == 0 && upright == 1)
		this.setFutureState(0,1);
	if(upleft == 0 && upcenter == 1 && upright == 0)
		this.setFutureState(0,1);
	if(upleft == 0 && upcenter == 1 && upright == 1)
		this.setFutureState(0,0);
	if(upleft == 1 && upcenter == 0 && upright == 0)
		this.setFutureState(0,0);
	if(upleft == 1 && upcenter == 0 && upright == 1)
		this.setFutureState(0,0);
	if(upleft == 1 && upcenter == 1 && upright == 0)
		this.setFutureState(0,0);
	if(upleft == 1 && upcenter == 1 && upright == 1)
		this.setFutureState(0,1);
}

function rule30DrawBoard()
{
	console.log("CHECK: " + this.board.grid);
	let ctx = this.context;
	let grid = this.board.grid;
	let cellWidth = this.cellWidth;

	ctx.fillStyle = "#0000FF";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	ctx.fillStyle = "#000000";
	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			console.log(grid);
			let tempCell = grid[r][c];
			let isWhite = tempCell.state[0];

			if(isWhite == 0)
				ctx.fillRect(r*cellWidth,c*cellWidth,cellWidth,cellWidth);
		}
	}
}

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