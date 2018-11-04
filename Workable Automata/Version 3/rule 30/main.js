/*
 * Cellular Automata - Rule 30
 * 0 for black, 1 for white
 */

function startSite()
{
	console.log("The script has begun");

	// Settings for the CA
	let rows = 30;
	let cols = 30;
	let cellWidth = 30;
	let delay = 17;

	// Create the board, set the initialization and update function of the CA
	let board = new Board(rows,cols);
	board.setInitBoard(rule30InitBoard);
	board.initializeBoard();
	board.setCellUpdate(rule30UpdateCell);
	//console.log("CHECK 2 " + board.grid);

	// Create the drawer, set the drawing function of the CA
	let drawer = new Drawer(board,cellWidth);
	drawer.setDrawBoard(rule30DrawBoard);

	drawer.startDrawing(delay);
	// drawer.drawFrame();
}

function rule30InitBoard()
{
	let result = create2DArray(this.rows, this.cols);

	for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
			let temp = new Cell(this,1,r,c);
			temp.setCurrentState(0, 1);
			temp.setFutureState(0,1);
			result[r][c] = temp;
		}
	}

	let centerC = Math.floor(this.cols/2);
	result[centerC][0].setCurrentState(0,0);
	result[centerC][0].setFutureState(0,0);

	this.grid = result;
	//console.log("CHECK 1" + this.grid);
}

function rule30UpdateCell()
{
	if(this.posR == 0 || this.posC == 0 || this.posC >= this.board.cols)
	{
		this.setFutureState(0,this.state[0]);
		return;
	}

	let grid = this.board.grid;
	let up = this.posR - 1;
	
	let upleft = grid[up][this.posC-1];
	let upcenter = grid[up][this.posC];
	let upright = grid[up][this.posC+1];

	// console.log("Up Left: " + upleft);
	// // console.log("Up Left: " + upcenter);
	// // console.log("Up Left: " + upright);


	// The relationships of cells. Based on Rule 30.
	// Cannot change current State of cell, otherwise it's going to break everything!
	// hence the reason to change future 
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
	//console.log("CHECK: " + this.board.grid);
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, this.canv.width, this.canv.height);

	ctx.fillStyle = "#000000";
	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			//console.log(grid);
			let tempCell = grid[r][c];
			let isWhite = tempCell.state[0];

			if(isWhite == 0)
				ctx.fillRect(r*cellWidth, c*cellWidth, cellWidth, cellWidth);
		}
	}
}
