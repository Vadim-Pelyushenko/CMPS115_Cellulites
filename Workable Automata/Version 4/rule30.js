// RULE 30 CELLULAR AUTOMATA
//--------------------------------------------------------------
// 0 for black, 1 for white.


//
// Initial Board for Rule 30
function rule30InitBoard() {
    let result = create2DArray(this.rows, this.cols);

	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < this.cols; c++) {
			let temp = new Cell(this, 1, r, c);
			temp.setCurrentState(0, 0);
			temp.setFutureState(0, 0);
			result[r][c] = temp;
		}
	}

    // To get the center grid of the column 
    let centerC = Math.floor(this.cols/2);

    result[0][centerC].setCurrentState(0, 1);
    result[0][centerC].setFutureState(0, 1);

	this.grid = result;
}

//
// Update Cell for Rule 30.
// Base on Rule 30 rules, this function will set the current cell state and future cell state.
function rule30UpdateCell(posR, posC) {	
	let grid = this.grid;
	let cell = grid[posR][posC];
    let up = posR-1;
	
	// Return nothing when reach the boarders and edges
	if (posR == 0 || posC == 0 || posC+1 >= cols || posR+1 >= rows) {
        cell.setFutureState(0, cell.state[1]);
        return;
    }

    // let grid = this.grid;
    // let up = posR-1;
    
    let upleft = grid[up][posC-1].state[0];
    let upcenter = grid[up][posC].state[0];
	let upright = grid[up][posC+1].state[0];

    if(upleft == 0 && upcenter == 0 && upright == 0)
		cell.setFutureState(0, 1);
	if(upleft == 0 && upcenter == 0 && upright == 1)
		cell.setFutureState(0, 1);
	if(upleft == 0 && upcenter == 1 && upright == 0)
		cell.setFutureState(0, 1);
	if(upleft == 0 && upcenter == 1 && upright == 1)
		cell.setFutureState(0, 0);
	if(upleft == 1 && upcenter == 0 && upright == 0)
		cell.setFutureState(0, 0);
	if(upleft == 1 && upcenter == 0 && upright == 1)
		cell.setFutureState(0, 0);
	if(upleft == 1 && upcenter == 1 && upright == 0)
		cell.setFutureState(0, 0);
	if(upleft == 1 && upcenter == 1 && upright == 1)
		cell.setFutureState(0, 1);
}

//
// Draw Board function to produce the cell boards
function rule30DrawBoard() {
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, this.canv.width, this.canv.height);

    ctx.fillStyle = "#000000";
	for (let r = 0; r < this.board.rows; r++)
	{
		for (let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[c][r];
			let isAlive = tempCell.state[0];

			if(isAlive == 1)
				ctx.fillRect(r*cellWidth, c*cellWidth, cellWidth, cellWidth);
		}
	}
}
