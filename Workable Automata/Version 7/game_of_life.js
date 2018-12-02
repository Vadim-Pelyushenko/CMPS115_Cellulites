// GAME OF LIFE EXAMPLE:
//--------------------------------------------------------------

function gameOfLifeFunctionGroup()
{
	let result = new Function_Group("Game of Life, Mapped",1);

	result.initBoardName = "GOL - Init";
	result.initBoardRaw = gameOfLifeRawInit();
	result.initBoardForm = "compute-each";
	result.dataWidth = "1";

	result.updateCellName = "GOL - Update";
	result.updateCellRaw = gameOfLifeRawUpdate();

	result.drawBoardName = "GOL - Draw Board Mapped";
	result.drawBoardRaw = gameOfLifeRawDrawBoardMapped();
	result.drawBoardForm = "mapping";

	return result;
}

function gameOfLifeFunctionGroup2()
{
	let result = new Function_Group("Game of Life, Computed",2);

	result.initBoardName = "GOL - Init";
	result.initBoardRaw = gameOfLifeRawInit();
	result.initBoardForm = "compute-each";
	result.dataWidth = "1";

	result.updateCellName = "GOL - Update";
	result.updateCellRaw = gameOfLifeRawUpdate();

	result.drawBoardName = "GOL - Draw Board Computed";
	result.drawBoardRaw = gameOfLifeRawDrawBoardComputed();
	result.drawBoardForm = "compute-color";

	return result;
}

function gameOfLifeFunctionGroup3()
{
	let result = new Function_Group("Game of Life, Coarse",3);

	result.initBoardName = "GOL - Init";
	result.initBoardRaw = gameOfLifeRawInit();
	result.initBoardForm = "compute-each";
	result.dataWidth = "1";

	result.updateCellName = "GOL - Update";
	result.updateCellRaw = gameOfLifeRawUpdate();

	result.drawBoardName = "GOL - Draw Board Coarse";
	result.drawBoardRaw = gameOfLifeRawDrawBoardCoarse();
	result.drawBoardForm = "coarse";

	return result;
}

function gameOfLifeFunctionGroup4()
{
	let result = new Function_Group("GOL Glider Gun",4);

	result.initBoardName = "Glider Gun";
	result.initBoardRaw = gameOfLifeGliderGun();
	result.initBoardForm = "literal";
	result.dataWidth = "1";

	result.updateCellName = "GOL - Update";
	result.updateCellRaw = gameOfLifeRawUpdate();

	result.drawBoardName = "GOL - Draw Board Mapped";
	result.drawBoardRaw = gameOfLifeRawDrawBoardMapped();
	result.drawBoardForm = "mapping";

	return result;
}

function gameOfLifeRawInit()
{
	let rawInit = "";
	rawInit += "let val = Math.floor(Math.random()*2);\n";
	rawInit += "curr.setCurrentState(0,val);\n";
	rawInit += "curr.setFutureState(0,0);\n";

	return rawInit;
}


// Test by inputting:
// ide_controller.compile_update_function(gameOfLifeRawUpdate());
// should return a string that is the result of compiling game of life
function gameOfLifeRawUpdate()
{
	let rawUpdate = "";
	rawUpdate += "let >local< = $(NW,N,NE,W,E,SW,S,SE) ~ [0];\n\n";
	rawUpdate += "let count = 0;\n";
	rawUpdate += "for(let k = 0; k < local.length; k++)\n";
	rawUpdate += "\tif(local[k].state[0] == 1)\n";
	rawUpdate += "\t\tcount++;\n\n";
	rawUpdate += "let nextState;\n";
	rawUpdate += "if(cell.state[0] == 0)\n";
	rawUpdate += "{\n";
	rawUpdate += "\tif(count == 3)\n";
	rawUpdate += "\t\tnextState = 1;\n";
	rawUpdate += "\telse\n";
	rawUpdate += "\t\tnextState = 0;\n";
	rawUpdate += "}\n";
	rawUpdate += "else\n";
	rawUpdate += "{\n";
	rawUpdate += "\tif(count < 2 || count > 3)\n";
	rawUpdate += "\t\tnextState = 0;\n";
	rawUpdate += "\telse\n";
	rawUpdate += "\t\tnextState = 1;\n";
	rawUpdate += "}\n";
	rawUpdate += "cell.setFutureState(0,nextState);";

	return rawUpdate;
}

function gameOfLifeRawDrawBoardMapped()
{
	let rawDraw = "";

	rawDraw += "0->#000000\n";
	rawDraw += "1->#FFFFFF\n";

	return rawDraw;
}

function gameOfLifeRawDrawBoardComputed()
{
	let rawDraw = "";

	rawDraw += "if(state[0] == 0)\n";
	rawDraw += "\tcompute_color = 0x000000;\n";
	rawDraw += "else\n";
	rawDraw += "\tcompute_color = 0xFFFFFF;"

	return rawDraw;
}

function gameOfLifeRawDrawBoardCoarse()
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
	rawDraw += "\t\t\tctx.fillStyle = \"#FFFFFF\";\n";
	rawDraw += "\t\telse\n";
	rawDraw += "\t\t\tctx.fillStyle = \"#000000\";\n\n";
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

// if(state[0] == 0)
// 	compute_color = 0xFFFFFF;
// else
// 	compute_color = 0x000000;

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

function gameOfLifeGliderGun()
{
	let result = "";

	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[1],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[1],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[1],[0],[1],[1],[0],[0],[0],[0],[1],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]},";
	result += "{[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]}";

	return result;
}

function gameOfLifeUpdateCell(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 1)
		count++;

	if(up >= 0 && grid[up][posC].state[0] == 1)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 1)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[posR][left].state[0] == 1)
		count++;

	if(right < cols && grid[posR][right].state[0] == 1)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 1)
		count++;

	if(down < rows && grid[down][posC].state[0] == 1)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 1)
		count++;


	// Updating state
	let nextState;

	if(cell.state[0] == 0)
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
	cell.setFutureState(0,nextState);
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

function gameOfLifeUpdateCell2(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 1)
		count++;

	if(up >= 0 && grid[up][posC].state[0] == 1)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 1)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[posR][left].state[0] == 1)
		count++;

	if(right < cols && grid[posR][right].state[0] == 1)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 1)
		count++;

	if(down < rows && grid[down][posC].state[0] == 1)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 1)
		count++;


	// Updating state
	let nextState;

	if(cell.state[0] == 0)
	{
		if(count == 3)
			nextState = 1;
		else
			nextState = 0;
	}
	else
	{
		if(count < 2 || count > 4)
			nextState = 0;
		else
			nextState = 1;
	}

	// console.log("Live neighbors: " + count + "\n\n");
	cell.setFutureState(0,nextState);
}

function gameOfLifeUpdateCell3(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 0)
		count++;

	if(up >= 0 && grid[up][posC].state[0] == 0)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 0)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[posR][left].state[0] == 0)
		count++;

	if(right < cols && grid[posR][right].state[0] == 0)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 0)
		count++;

	if(down < rows && grid[down][posC].state[0] == 0)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 0)
		count++;


	// Updating state
	let nextState;

	if(cell.state[0] == 1)
	{
		if(count == 3)
			nextState = 0;
		else
			nextState = 1;
	}
	else
	{
		if(count < 2 || count > 3)
			nextState = 1;
		else
			nextState = 0;
	}

	// console.log("Live neighbors: " + count + "\n\n");
	cell.setFutureState(0,nextState);
}

function gameOfLifeDrawBoard2()
{
	// For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw black on the whole thing
	ctx.fillStyle = "#0000FF";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	// Draw all of the lives cells as white
	ctx.fillStyle = "#FFFF00";
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