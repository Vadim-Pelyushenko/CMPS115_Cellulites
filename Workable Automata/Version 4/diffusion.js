// Diffusion Limited Aggregation Cellular Automata
//

function diffusionInitBoard()
{
    let result = create2DArray(this.rows, this.cols);

    for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
            let temp = new Cell(this, 1, r, c);
            let rand = Math.floor(Math.random()*18);
            if (rand == 0)
            {
                temp.setCurrentState(0, 1);
			    temp.setFutureState(0, 1);
            }
            else
            {
                temp.setCurrentState(0, 0);
			    temp.setFutureState(0, 0);
            }
			result[r][c] = temp;
		}
	}
}

/*****************************************************************************/
/*****************************************************************************/

function diffusionUpdateCell(posR, posC)
{
    let grid = this.grid;
    let cell = grid[posR][posC];
    let currentState = grid[posR][posC].state[0];

    if (currentState == 2 || currentState == 0)
    {
        return;
    }

    let rows = this.rows;
    let cols = this.cols;
    let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
    let right = posC + 1;
    
    if(up >= 0 && left >= 0 && grid[up][left].state[0] == 2)
		cell.setFutureState(0, 2);
	else if(up >= 0 && grid[up][posC].state[0] == 2)
		cell.setFutureState(0, 2);
	else if(up >= 0 && right < cols && grid[up][right].state[0] == 2)
		cell.setFutureState(0, 2);
	else if(left >= 0 && grid[posR][left].state[0] == 2)
		cell.setFutureState(0, 2);
	else if(right < cols && grid[posR][right].state[0] == 2)
		cell.setFutureState(0, 2);
	else if(down < rows && left >= 0 && grid[down][left].state[0] == 2)
        cell.setFutureState(0, 2);
	else if(down < rows && grid[down][posC].state[0] == 2)
        cell.setFutureState(0, 2);
	else if(down < rows && right < cols && grid[down][right].state[0] == 2)
        cell.setFutureState(0, 2);
        
    if (cell.futureState[0] == 2)
        return;
    
    let rand = Math.random(Math.random()*8);
    let neighR, neighC;
    switch(rand)
	{
		case 0:
			neighR = up;
			neighC = left;
			break;
		case 1:
			neighR = up;
			neighC = posC;
			break;
		case 2:
			neighR = up;
			neighC = right;
			break;
		case 3:
			neighR = posR;
			neighC = left;
			break;
		case 4:
			neighR = posR;
			neighC = right;
			break;
		case 5:
			neighR = down;
			neighC = left;
			break;
		case 6:
			neighR = down;
			neighC = posC;
			break;
		case 7:
			neighR = down;
			neighC = right;
			break;
    }
    
    // If neighbor is not valid, don't do anything
	if(neighR < 0 || neighR >= rows || neighC < 0 || neighC >= cols)
	{
		cell.setFutureState(0,1);
		return;
	}

	let target = grid[neighR][neighC];

	// If the spot is not already empty, or its claimed by another cell, leave it alone.
	if(target.state[0] != 0 || target.futureState[0] != 0)
	{
		cell.setFutureState(0,1);
		return;
	}

	// console.log("moved into the empty cell");
	cell.setFutureState(0,0);
	target.setFutureState(0,1);
}

/*****************************************************************************/
/*****************************************************************************/

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
				ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
		}
	}
}

function diffusionDrawBoard()
{
    // For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw black on the whole thing
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, this.canv.width, this.canv.height);

	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[r][c];
			let state = tempCell.state[0];

			if(state == 1) // red cells
			{
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);
			}
			else if(state == 2) // white cells
			{
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);	
			}
		}
	}
}