// Global Variables
var rows = null;
var cols = null;
var cellWidth = null;
var delay = null;

var board = null;
var drawer = null;

var initBoardFunc = null;
var updateCellFunc = null;
var drawBoardFunc = null;

var confirmedDrawBoardText = null;
var confirmedDrawBoardFuncName = null;
var selectedFunction = null;



function runSimulation()
{
	board.setInitBoard(initBoardFunc);
	board.initializeBoard();
	board.setCellUpdate(updateCellFunc);

	drawer.setDrawBoard(drawBoardFunc);

	if(drawer.isRunning)
		drawer.stopDrawing();

	drawer.startDrawing(delay);
	drawer.frame = 0;
}

function stopSimulation()
{
	drawer.stopDrawing();
}

function resumeSimulation()
{
	drawer.resumeDrawing(delay);
}

// function select_Event(e)
// {
//     let functionEditing = document.getElementById("SettingStateColor");
//     let functionArea = document.getElementById("StateColorInput");
//
//     if(e.value === "nothing")
//     {
//         functionEditing.style.display = "none"; // hide the function editing part
//         selectedFunction = null;
//         console.log("You are not writing to any function");
//         return;
//     }
//
//     selectedFunction = e.value;
//     functionEditing.style.display = ""; // unhide the function editing part
//
//     if(e.value === "drawBoard")
//     {
//         console.log("You are writing the cell drawing function");
//         if(confirmedDrawBoardText !== null)
//         {
//             functionArea.value = confirmedDrawBoardText;
//         }
//         else
//         {
//             functionArea.value = "";
//         }
//     }
// }

//https://www.w3schools.com/js/js_string_methods.asp
//https://stackoverflow.com/questions/6507056/replace-all-whitespace-characters
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
function confirmStateColor()            //As of right now the user must specify all colors each time they input a color.
{
	let func_name = "DrawBoard";
    let StateColorsText = document.getElementById("StateColorInput");
    let rawCode = StateColorsText.value;
    var compiledFunction = null;

    var lines = rawCode.split("\n");	//Lines is an array of the user input, with each line being a different element.

    for (var i = 0; i < lines.length; i++)
    {
        lines[i] = lines[i].replace(/\s/g, ""); //Deletes all of the white space in a given line
        var colorStartsAt = rawCode.search(">");
        lines[i] = lines[i].slice(colorStartsAt+1);     //Cut off the string up until the ">" symbol, so all that is left is the hex color value
    }

	//I now have an array where each index value is the cell state and the entry at that index is the color for that state

    let part1 = "function()\n{\n\tlet ctx = this.context;\n\tlet cellWidth = this.cellWidth;\n\tlet grid = this.board.grid;\n\n";

    let color0 = "\tctx.fillStyle = \"" + lines[0] + "\";\n\t";

    let part2 = "ctx.fillRect(0, 0, this.canv.width, this.canv.height);\n" +
        "\n" +
        "\tfor(let r = 0; r < this.board.rows; r++)\n" +
        "\t{\n" +
        "\t\tfor(let c = 0; c < this.board.cols; c++)\n" +
        "\t\t{\n" +
        "\t\t\tlet tempCell = grid[r][c];\n" +
        "\t\t\tlet state = tempCell.state[0];\n" +
        "\n" +
        "\t\t\tif(state == 1)\n" +
        "\t\t\t{\n";

    let color1 = "\t\t\t\tctx.fillStyle = \"" + lines[1] + "\";\n";

    let part3 = "\t\t\t\tctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);\n\t\t\t}";

    if (lines.length == 2)	//If there are only 2 colors, we are done
	{
        confirmedDrawBoardText = part1+color0+part2+color1+part3;
        confirmedDrawBoardFuncName = func_name;
        let generatedCode = part1 + color0 + part2 + color1 + part3 + "\n\t\t}\n\t}\n}";
        console.log("Generated Function");
        console.log(generatedCode);
        eval("compiledFunction = " + generatedCode + ";");
        setDrawBoardFunction(compiledFunction,func_name);
	}
	else
	{
		let remainderOfColors = "";
		for(var i = 2; i < lines.length; i++)
		{
			remainderOfColors += "\n\t\t\telse if(state == " + i + ")\n\t\t\t{";
			remainderOfColors += "\n\t\t\t\tctx.fillStyle = \"" + lines[i] + "\";\n\t\t\t\t";
			remainderOfColors += "ctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);\n\t\t\t}\n"
		}

        confirmedDrawBoardText = part1+color0+part2+color1+part3+remainderOfColors;
        confirmedDrawBoardFuncName = func_name;
        console.log("Generated Function");
        console.log(part1 + color0 + part2 + color1 + part3 + remainderOfColors +"\n\t\t}\n\t}\n};");
		eval("compiledFunction = " + part1 + color0 + part2 + color1 + part3 + remainderOfColors +"}}};");
		setDrawBoardFunction(compiledFunction,func_name);
	}

}