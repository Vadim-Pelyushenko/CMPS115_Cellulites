// RULE 30 CELLULAR AUTOMATA
//--------------------------------------------------------------
// 0 for black, 1 for white.

//
// Initial Board for Rule 30
function rule30InitBoard() {
    let result = create2DArray(this.rows, this.cols);

	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < this.cols; c++) {
			let temp = new Cell(this,1,r,c);
			temp.setCurrentState(0, 1);
			temp.setFutureState(0, 1);
			result[r][c] = temp;
		}
	}

    // To get the center grid of the column 
    let centerC = Math.floor(this.cols/2);

    result[0][centerC].setCurrentState(0, 0);
    result[0][centerC].setFutureState(0, 0);

	this.grid = result;
}



//
// Update Cell for Rule 30.
// Base on Rule 30 rules, this function will set the current cell state and future cell state.
function rule30UpdateCell(posR, posC) {
    // Return nothing when reach the boarders and edges
    if (this.posR == 0 || this.posC == 0 || this.posC+1 >= this.cols || this.posR+1 >= this.rows) {
        this.setFutureState(0, this.state[0]);
        return;
    }

    let grid = this.grid;
    let up = this.posR-1;
    
    let upleft = grid[up][this.posC-1].state[0];
    let upcenter = grid[up][this.posC].state[0];
    let upright = grid[up][this.posC+1].state[0];
    
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



/*
function gameOfLifeDrawBoard()
{
	// Draw all of the lives cells as white
			let tempCell = grid[r][c];
			let isAlive = tempCell.state[0];

			if(isAlive == 1)
				ctx.fillRect(r*cellWidth,c*cellWidth,cellWidth,cellWidth);
		}
	}
}
*/
function rule30DrawBoard() {
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	ctx.fillStyle = "#FFFFFFF";
	ctx.fillRect(0, 0, this.canv.width, this.canv.height);

    ctx.fillStyle = "#000000";
    // ************************************8  this.board.rows and this.board.cols ************/
	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < this.cols; c++) {
			let tempCell = grid[r][c];
			let isAlive = tempCell.state[0];

			if(isAlive == 1)
				ctx.fillRect(r*cellWidth, c*cellWidth, cellWidth, cellWidth);
		}
	}
}
