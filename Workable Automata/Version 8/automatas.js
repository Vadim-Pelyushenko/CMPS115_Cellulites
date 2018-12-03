function sandPilesFunctionGroup()
{
	let result = new Function_Group("Sand Piles");

	result.initBoardName = "Sand Piles - Init";
	result.initBoardRaw = sandPilesRawInit();
	result.initBoardForm = "compute-each";
	result.dataWidth = "1";

	result.updateCellName = "Sand Piles - Update";
	result.updateCellRaw = sandPilesRawUpdate();

	result.drawBoardName = "Sand Piles - Computed";
	result.drawBoardRaw = sandPilesRawDrawBoardComputed();
	result.drawBoardForm = "compute-color";

	return result;
}

function sandPilesRawInit()
{
	let rawInit = "";
	rawInit += "if(r === Math.floor(rows/2) && c === Math.floor(cols/2))\n";
	rawInit += "{\n";
	rawInit += "\tcurr.setCurrentState(0,10000);\n"
	rawInit += "\tcurr.setFutureState(0,10000);\n";
	rawInit += "}\n";
	rawInit += "else\n";
	rawInit += "{\n";
	rawInit += "\tcurr.setCurrentState(0,0);\n"
	rawInit += "\tcurr.setFutureState(0,0);\n";
	rawInit += "}\n";

	return rawInit;
}

function sandPilesRawUpdate()
{
	let rawUpdate = "";
	rawUpdate += "let nextState = cell.state[0] - 4*Math.floor(cell.state[0]/4);\n";
	rawUpdate += "let >local< = $(N,E,S,W) ~ [0];\n\n";
	rawUpdate += "for(let k = 0; k < local.length; k++)\n";
	rawUpdate += "\tnextState += Math.floor(local[k].state[0]/4);\n\n";
	rawUpdate += "cell.setFutureState(0,nextState);\n";

	return rawUpdate;
}

function sandPilesRawDrawBoardComputed()
{
	let rawDraw = "";

	rawDraw += "if(state[0] == 0)\n";
	rawDraw += "\tcompute_color = 0x000000;\n";
	rawDraw += "else if(state[0] == 1)\n";
	rawDraw += "\tcompute_color = 0x005500;\n";
	rawDraw += "else if(state[0] == 2)\n";
	rawDraw += "\tcompute_color = 0x00AA00;\n";
	rawDraw += "else if(state[0] == 3)\n";
	rawDraw += "\tcompute_color = 0x00FF00;\n";
	rawDraw += "else\n";
	rawDraw += "\tcompute_color = 0xFF0000;\n";

	return rawDraw;
}