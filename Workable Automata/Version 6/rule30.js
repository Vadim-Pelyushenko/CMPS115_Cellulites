function rule30FunctionGroup()//DONE
{
    let result = new Function_Group("Rule 30, Mapped",1);

    result.initBoardName = "Rule30 - Init";
    result.initBoardRaw = rule30RawInit();
    result.initBoardForm = "compute-each";
    result.dataWidth = "1";

    result.updateCellName = "Rule30 - Update";
    result.updateCellRaw = rule30RawUpdate();

    result.drawBoardName = "Rule30 - Draw Board Mapped";
    result.drawBoardRaw = rule30RawDrawBoardMapped();
    result.drawBoardForm = "mapping";

    return result;
}

function rule30FunctionGroup2()//DONE
{
    let result = new Function_Group("Rule 30, Computed",2);

    result.initBoardName = "Rule30 - Init";
    result.initBoardRaw = rule30RawInit();
    result.initBoardForm = "compute-each";
    result.dataWidth = "1";

    result.updateCellName = "Rule30 - Update";
    result.updateCellRaw = rule30RawUpdate();

    result.drawBoardName = "Rule30 - Draw Board Computed";
    result.drawBoardRaw = rule30RawDrawBoardComputed();
    result.drawBoardForm = "compute-color";

    return result;
}

function rule30FunctionGroup3()//DONE
{
    let result = new Function_Group("Rule 30, Coarse",3);

    result.initBoardName = "Rule30 - Init";
    result.initBoardRaw = rule30RawInit();
    result.initBoardForm = "compute-each";
    result.dataWidth = "1";

    result.updateCellName = "Rule30 - Update";
    result.updateCellRaw = rule30RawUpdate();

    result.drawBoardName = "Rule30 - Draw Board Coarse";
    result.drawBoardRaw = rule30RawDrawBoardCoarse();
    result.drawBoardForm = "coarse";

    return result;
}

function rule30RawInit()//DONE??
{
    let rawInit = "";

    rawInit += "let val = Math.floor(Math.random()*2);\n";
    rawInit += "curr.setCurrentState(0,val);\n";
    rawInit += "curr.setFutureState(0,0);\n";

    return rawInit;
}

function rule30RawUpdate()//DONE??
{
    let rawUpdate = "";
    rawUpdate += "let >local< = $(NW,N,NE) ~ [0];\n\n";
    rawUpdate += "if (posR == 0 || posC == 0 || posC+1 >= cols || posR+1 >= rows)\n";
	rawUpdate += "{\n";
	rawUpdate += "\tcell.setFutureState(0, cell.state[1]);\n";
	rawUpdate += "\treturn;\n";
	rawUpdate += "}\n\n";
    rawUpdate += "if(local[0].state[0] == 0 && local[1].state[0] == 1 && local[2].state[0] == 1)\n";
    rawUpdate += "\tcell.setFutureState(0, 0);\n";
    rawUpdate += "if(local[0].state[0] == 1 && local[1].state[0] == 0 && local[2].state[0] == 0)\n";
    rawUpdate += "\tcell.setFutureState(0, 0);\n";
    rawUpdate += "if(local[0].state[0] == 1 && local[1].state[0] == 0 && local[2].state[0] == 1)\n";
    rawUpdate += "\tcell.setFutureState(0, 0);\n";
    rawUpdate += "if(local[0].state[0] == 1 && local[1].state[0] == 1 && local[2].state[0] == 0)\n";
    rawUpdate += "\tcell.setFutureState(0, 0);\n";

    rawUpdate += "if(local[0].state[0] == 0 && local[1].state[0] == 0 && local[2].state[0] == 0)\n";
    rawUpdate += "\tcell.setFutureState(0, 1);\n";
    rawUpdate += "if(local[0].state[0] == 0 && local[1].state[0] == 0 && local[2].state[0] == 1)\n";
    rawUpdate += "\tcell.setFutureState(0, 1);\n";
    rawUpdate += "if(local[0].state[0] == 0 && local[1].state[0] == 1 && local[2].state[0] == 0)\n";
    rawUpdate += "\tcell.setFutureState(0, 1);\n";
    rawUpdate += "if(local[0].state[0] == 1 && local[1].state[0] == 1 && local[2].state[0] == 1)\n";
    rawUpdate += "\tcell.setFutureState(0, 1);\n";



    return rawUpdate;
}

function rule30RawDrawBoardMapped()//DONE
{
    let rawDraw = "";

    rawDraw += "0->#000000\n";
    rawDraw += "1->#FFFFFF\n";

    return rawDraw;
}

function rule30RawDrawBoardComputed()//DONE
{
    let rawDraw = "";

    rawDraw += "if(state[0] == 0)\n";
    rawDraw += "\tcompute_color = 0x000000;\n";
    rawDraw += "else\n";
    rawDraw += "\tcompute_color = 0xFFFFFF;"

    return rawDraw;
}

function rule30RawDrawBoardCoarse()//DONE
{
    let rawDraw = "";
    rawDraw += "// Draw black on the whole thing\n";
    rawDraw += "ctx.fillStyle = \"000000\";\n";
    rawDraw += "ctx.fillRect(0,0,this.canv.width,this.canv.height);\n\n";
    rawDraw += "// Draw all of the live cells as white\n";
    rawDraw += "ctx.fillStyle = \"FFFFFF\";\n";
    rawDraw += "for(let r = 0; r < this.board.rows; r++)\n";
    rawDraw += "{\n";
    rawDraw += "\tfor(let c = 0; c < this.board.cols; c++)\n";
    rawDraw += "\t{\n";
    rawDraw += "\t\tlet tempCell = grid[r][c];\n";
    rawDraw += "\t\tlet isAlive = tempCell.state[0];\n\n";
    rawDraw += "\t\tif(isAlive == 1)\n";
    rawDraw += "\t\t\tctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);";
    rawDraw += "\t}\n";
    rawDraw += "}\n";

    return rawDraw;
}


// RULE 30 CELLULAR AUTOMATA
//--------------------------------------------------------------
// 0 for black, 1 for white.


//
// Initial Board for Rule 30
function rule30InitBoard()
{
    let result = create2DArray(this.rows, this.cols);

	for (let r = 0; r < this.rows; r++)
	{
		for (let c = 0; c < this.cols; c++)
		{
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
function rule30UpdateCell(posR, posC)
{	
	let grid = this.grid;
	let cell = grid[posR][posC];
    let up = posR-1;
	
	// Return nothing when reach the boarders and edges
	if (posR == 0 || posC == 0 || posC+1 >= cols || posR+1 >= rows)
	{
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
function rule30DrawBoard()
{
    // For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

    // Draw black on the whole thing
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

    // Draw all of the live cells as white
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
