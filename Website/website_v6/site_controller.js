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
    var stateQuantity = parseInt(document.getElementById("StateQuantity").value);
    console.log("stateQuantity " + stateQuantity);
	let func_name = "DrawBoard";
    let StateColorsText = document.getElementById("StateColorInput");
    let rawCode = StateColorsText.value;
    var compiledFunction = null;
    var index;
    var color0 = "";
    var color1 = "";

    var lines = rawCode.split("\n");	//Lines is an array of the user input, with each line being a different element.

    for (var i = 0; i < lines.length; i++)
    {
        lines[i] = lines[i].replace(/\s/g, ""); //Deletes all of the white space in a given line
        lines[i] = lines[i].toUpperCase();
    }

    let part1 = "function()\n{\n\tlet ctx = this.context;\n\tlet cellWidth = this.cellWidth;\n\tlet grid = this.board.grid;\n\n";

    index = currStateIndex(lines, "0");
    if(index != -1)
    {
        console.log("Entering color 0");
        var colorStartsAt = lines[index].search(">");       //Cut off the string up until the ">" symbol, so all that is left is the hex color value
        color0 = "\tctx.fillStyle = \"" + lines[index].slice(colorStartsAt+1) + "\";\n\t";
    } else {
        console.log("Entering random color0");
        color0 = "\tctx.fillStyle = \"" + randomHexColor() + "\";\n\t";
    }

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

    index = currStateIndex(lines, "1");
    if(index != -1)
    {
        var colorStartsAt = lines[index].search(">");       //Cut off the string up until the ">" symbol, so all that is left is the hex color value
        color1 = "\t\t\t\tctx.fillStyle = \"" + lines[index].slice(colorStartsAt+1) + "\";\n\t";
    }
    else
    {
        color1 = "\t\t\t\tctx.fillStyle = \"" + randomHexColor() + "\";\n\t";
    }

    let part3 = "\t\t\tctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);\n\t\t\t}";

    if (stateQuantity == 2)	//If there are only 2 colors, we are done
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
	    console.log("Entering more than 2 colors");
		let remainderOfColors = "";
		for(var i = 2; i < stateQuantity; i++)
		{
			remainderOfColors += "\n\t\t\telse if(state == " + i + ")\n\t\t\t{";

			index = currStateIndex(lines, i);
            if(index != -1)
            {
                var colorStartsAt = lines[index].search(">");       //Cut off the string up until the ">" symbol, so all that is left is the hex color value
                remainderOfColors += "\n\t\t\t\tctx.fillStyle = \"" + lines[index].slice(colorStartsAt+1) + "\";\n\t";
            }
            else
            {
                remainderOfColors += "\n\t\t\t\tctx.fillStyle = \"" + randomHexColor() + "\";\n\t";
            }
			remainderOfColors += "\t\t\tctx.fillRect(c*cellWidth, r*cellWidth, cellWidth, cellWidth);\n\t\t\t}\n"
		}

        confirmedDrawBoardText = part1+color0+part2+color1+part3+remainderOfColors;
        confirmedDrawBoardFuncName = func_name;
        console.log("Generated Function");
        console.log(part1 + color0 + part2 + color1 + part3 + remainderOfColors +"\n\t\t}\n\t}\n};");
		eval("compiledFunction = " + part1 + color0 + part2 + color1 + part3 + remainderOfColors +"}}};");
		setDrawBoardFunction(compiledFunction,func_name);
	}

}

//https://www.paulirish.com/2009/random-hex-color-code-snippets/
function randomHexColor()
{
    return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

function currStateIndex(array, state)  //Takes in the array of mappings, in the format 0->#XXXXXX, 1->#XXXXXX. Order is not guaranteed
{                                      //And takes in the state we are looking for. If not found, return -1.
    var temp;
    for(var i = 0; i < array.length; i++)
    {
        var lineStartsAt = array[i].search("-");
        temp = array[i].slice(0, lineStartsAt);         //Get the state we are currently referring to.
        console.log("Currently looking at: " + temp + " at index " + i + "\nstate looking for: " + state);
        if(temp == state)
            return i;
    }
    return -1;
}