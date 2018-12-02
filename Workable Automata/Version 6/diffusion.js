function diffusionFunctionGroup()//DONE
{
    let result = new Function_Group("Diffusion, Mapped",5);

    result.initBoardName = "Diff - Init";
    result.initBoardRaw = diffusionRawInit();
    result.initBoardForm = "compute-each";
    result.dataWidth = "1";

    result.updateCellName = "Diff - Update";
    result.updateCellRaw = diffusionRawUpdate();

    result.drawBoardName = "Diff - Draw Board Mapped";
    result.drawBoardRaw = diffusionRawDrawBoardMapped();
    result.drawBoardForm = "mapping";

    return result;
}

function diffusionFunctionGroup2()//DONE
{
    let result = new Function_Group("Diffusion, Computed",6);

    result.initBoardName = "Diff - Init";
    result.initBoardRaw = diffusionRawInit();
    result.initBoardForm = "compute-each";
    result.dataWidth = "1";

    result.updateCellName = "Diff - Update";
    result.updateCellRaw = diffusionRawUpdate();

    result.drawBoardName = "Diff - Draw Board Computed";
    result.drawBoardRaw = diffusionRawDrawBoardComputed();
    result.drawBoardForm = "compute-color";

    return result;
}

function diffusionFunctionGroup3()//DONE
{
    let result = new Function_Group("Diffusion, Coarse",7);

    result.initBoardName = "Diff - Init";
    result.initBoardRaw = diffusionRawInit();
    result.initBoardForm = "compute-each";
    result.dataWidth = "1";

    result.updateCellName = "Diff - Update";
    result.updateCellRaw = diffusionRawUpdate();

    result.drawBoardName = "Diff - Draw Board Coarse";
    result.drawBoardRaw = diffusionRawDrawBoardCoarse();
    result.drawBoardForm = "coarse";

    return result;
}

function diffusionRawInit()//DONE
{
    let rawInit = "";
    // rawInit += "let temp = new Cell(this, 1, r, c);\n";
    rawInit += "let rand = Math.floor(Math.random()*18);\n";
    rawInit += "if (rand == 0)\n";
    rawInit += "{\n";
    rawInit += "\tcurr.setCurrentState(0, 1);\n";
    rawInit += "\tcurr.setFutureState(0, 1);\n";
    rawInit += "}\n";
    rawInit += "else\n";
    rawInit += "{\n";
    rawInit += "\tcurr.setCurrentState(0, 0);\n";
    rawInit += "\tcurr.setFutureState(0, 0);\n";
    rawInit += "}\n";

    return rawInit;
}

function diffusionRawUpdate()
{
    let rawUpdate = "";
    rawUpdate += "if (currentState == 2 || currentState == 0)\n";
    rawUpdate += "{\n";
    rawUpdate += "\treturn;\n";
    rawUpdate += "}\n\n";
    rawUpdate += "let >local< = $(NW,N,NE,W,E,SW,S,SE) ~ [1];\n\n";
    rawUpdate += "for(let k = 0; k < local.length; k++)\n";
    rawUpdate += "{\n";
    rawUpdate += "\tif(local[k].state[0] == 2)\n";
    rawUpdate += "\t{\n";
    rawUpdate += "\t\tcell.setFutureState(0, 2);\n";
    rawUpdate += "\t\tbreak;\n";
    rawUpdate += "\t}\n";
    rawUpdate += "}\n\n";
    rawUpdate += "if (cell.futureState[0] == 2)\n";
    rawUpdate += "\treturn;\n\n";
    rawUpdate += "let rand = Math.floor(Math.random()*8);\n";
    rawUpdate += "if(local[rand].state[0] != 0 || local[rand].futureState[0] != 0)\n";
    rawUpdate += "{\n";
    rawUpdate += "\tcell.setFutureState(0, 1);\n";
    rawUpdate += "\treturn;\n";
    rawUpdate += "}\n\n";
    rawUpdate += "cell.setFutureState(0, 0);\n";
    rawUpdate += "local[rand].setFutureState(0, 1);\n";

    return rawUpdate;


}

function diffusionRawDrawBoardMapped()//DONE
{
    let rawDraw = "";

    rawDraw += "0->#000000\n";
    rawDraw += "1->#FF0000\n";
    rawDraw += "2->#FFFFFF\n";

    return rawDraw;
}

function diffusionRawDrawBoardComputed()//DONE
{
    let rawDraw = "";

    rawDraw += "if(state[0] == 0)\n";
    rawDraw += "\tcompute_color = 0x000000;\n";
    rawDraw += "else if(state[0] == 1)\n";
    rawDraw += "\tcompute_color = 0xFF0000;\n"
	rawDraw += "else\n";
    rawDraw += "\tcompute_color = 0xFFFFFF;\n";

    return rawDraw;
}

function diffusionRawDrawBoardCoarse()//DONE
{
    let rawDraw = "";
    rawDraw += "// Draw black on the whole thing\n";
    rawDraw += "ctx.fillStyle = \"000000\";\n";
    rawDraw += "ctx.fillRect(0,0,this.canv.width,this.canv.height);\n\n";
    rawDraw += "for(let r = 0; r < this.board.rows; r++)\n";
    rawDraw += "{\n";
    rawDraw += "\tfor(let c = 0; c < this.board.cols; c++)\n";
    rawDraw += "\t{\n";
    rawDraw += "\t\tlet tempCell = grid[r][c];\n";
    rawDraw += "\t\tlet state = tempCell.state[0];\n\n";
    rawDraw += "\t\tif(state == 1)\n";
    rawDraw += "\t\t\tctx.fillStyle = \"#FF0000\";\n";
    rawDraw += "\t\telse if(state == 2)\n";
    rawDraw += "\t\t\tctx.fillStyle = \"#FFFFFF\";\n\n";
    rawDraw += "\t\t// Draws circles instead of squares\n"
    rawDraw += "\t\tlet cirR = Math.floor(cellWidth/2);\n";
    rawDraw += "\t\tlet cenX = c*cellWidth + cirR;\n";
    rawDraw += "\t\tlet cenY = r*cellWidth + cirR;\n";
    rawDraw += "\t\tctx.beginPath();\n";
    rawDraw += "\t\tctx.arc(cenX,cenY,cirR,0,2*Math.PI);\n";
    rawDraw += "\t\tctx.fill();\n";
    rawDraw += "\t}\n";
    rawDraw += "}\n";

    return rawDraw;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    let center = result[Math.floor(this.rows/2)][Math.floor(this.cols/2)];
	center.setCurrentState(0, 2);
	center.setFutureState(0, 2);

    this.grid = result;
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

    let rand = Math.floor(Math.random()*8);
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
		cell.setFutureState(0, 1);
		return;
	}

	let target = this.grid[neighR][neighC];

	// If the spot is not already empty, or its claimed by anot`her cell, leave it alone.
	if(target.state[0] != 0 || target.futureState[0] != 0)
	{
		cell.setFutureState(0, 1);
		return;
	}

	// console.log("moved into the empty cell");
	cell.setFutureState(0, 0);
	target.setFutureState(0, 1);
}

/*****************************************************************************/
/*****************************************************************************/

// function gameOfLifeDrawBoard()
// {
// 	// For easier reference
// 	let ctx = this.context;
// 	let cellWidth = this.cellWidth;
// 	let grid = this.board.grid;
//
// 	// Draw black on the whole thing
// 	ctx.fillStyle = "#000000";
// 	ctx.fillRect(0,0,this.canv.width,this.canv.height);
//
// 	// Draw all of the lives cells as white
// 	ctx.fillStyle = "#FFFFFF";
// 	for(let r = 0; r < this.board.rows; r++)
// 	{
// 		for(let c = 0; c < this.board.cols; c++)
// 		{
// 			let tempCell = grid[r][c];
// 			let isAlive = tempCell.state[0];
//
// 			if(isAlive == 1)
// 				ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
// 		}
// 	}
// }

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