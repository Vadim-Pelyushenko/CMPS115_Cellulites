// Global Variables
var rows = null;
var cols = null;
var cellWidth = null;
var delay = null;

var drawer = null;
var ide_controller = new IDE_Controller();

// Put in the initial CA's to have in the preset list
createPresets();

var initForm = null;
var initBoardFunc = null;
var initBoardState = null;

var updateCellFunc = null;
var drawBoardFunc = null;

// var confirmedInitBoardText = null;
// var confirmedUpdateCellText = null;
// var confirmedDrawBoardText = null;

// var confirmedInitBoardFuncName = null;
// var confirmedUpdateCellFuncName = null;
// var confirmedDrawBoardFuncName = null;

// var selectedFunction = null;

function runSimulation()
{
    // let func_group = ide_controller.simulating_group;

    // if(!func_group.readyToSimulate())
    // {
    // 	console.log("NOT ALL OF THE FUNCTIONS HAVE BEEN SET. CANNOT START SIMULATION");
    // 	return;
    // }

    // let initFuncDisplay = document.getElementById("initFuncDisplay");
    // if(func_group.initBoardForm === "compute-each")
    // {
    // 	board.setInitBoard(func_group.initBoardCompiled);
    // 	board.initializeBoard();

    // 	initFuncDisplay.innerHTML = "InitBoard Function: " + func_group.initBoardName;
    // }
    // else if(func_group.initBoardForm === "literal")
    // {
    // 	board.grid = func_group.initBoardState;
    // 	initFuncDisplay.innerHTML = "InitBoard Function: NONE(Initialized with values)";
    // }

    // board.setCellUpdate(func_group.updateCellCompiled);
    // let updateFuncDisplay = document.getElementById("updateFuncDisplay");
    // updateFuncDisplay.innerHTML = "UpdateCell Function: " + func_group.updateCellName;

    // drawer.setDrawBoard(func_group.drawBoardCompiled);
    // let drawFuncDisplay = document.getElementById("drawFuncDisplay");
    // drawFuncDisplay.innerHTML = "DrawBoard Function: " + func_group.drawBoardName;

    // if(drawer.isRunning)
    // 	drawer.stopDrawing();

    // drawer.startDrawing(delay);
    // drawer.frame = 0;

    if(initForm === null || updateCellFunc === null || drawBoardFunc === null)
    {
        console.log("NOT ALL OF THE FUNCTIONS HAVE BEEN SET. CANNOT START SIMULATION");
        return;
    }

    board.setInitBoard(initBoardFunc);
    board.initializeBoard();
    // if(initForm === "compute-each")
    // {
    // 	board.setInitBoard(initBoardFunc);
    // 	board.initializeBoard();
    // }
    // else
    // {
    // 	board.grid = ide_controller.simulating_group.initBoardState;
    // 	// board.grid = copyGrid(initBoardState);
    // 	// let initFunc;
    // 	// eval("initFunc = function(){this.grid = copyGrid(initBoardState);}");
    // 	// board.setInitBoard(initFunc);
    // }

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

function select_function(e)
{
    ide_controller.saveCurrentProgress();
    ide_controller.change_function_editing(e.value);
}

function preset_into_editor(e)
{
    let worked = false;
    if(e !== null)
        worked = ide_controller.swap_simulating_by_name(e.value);

    if(worked)
    {
        document.getElementById("automatonName").value = e.value;
        document.getElementById("autoNamePrompt").innerHTML = "Cellular Automata Name: ";
    }

    document.getElementById("autoList").value = "";
}

function createPresets()
{
    // Adding the Game of Life Preset
    let gol_funcs = gameOfLifeFunctionGroup();
    ide_controller.add_function_group(gol_funcs);
    func_group_into_presets(gol_funcs);

    let gol_funcs2 = gameOfLifeFunctionGroup2();
    ide_controller.add_function_group(gol_funcs2);
    func_group_into_presets(gol_funcs2);

    let gol_funcs3 = gameOfLifeFunctionGroup3();
    ide_controller.add_function_group(gol_funcs3);
    func_group_into_presets(gol_funcs3);

    let gol_funcs4 = gameOfLifeFunctionGroup4();
    ide_controller.add_function_group(gol_funcs4);
    func_group_into_presets(gol_funcs4);

    let gol_funcs5 = gameOfLifeFunctionGroup5();
    ide_controller.add_function_group(gol_funcs5);
    func_group_into_presets(gol_funcs5);

    // Adding Diffusion Preset

    let Diff_funcs = diffusionFunctionGroup();
    ide_controller.add_function_group(Diff_funcs);
    func_group_into_presets(Diff_funcs);

    let Diff_funcs2 = diffusionFunctionGroup2();
    ide_controller.add_function_group(Diff_funcs2);
    func_group_into_presets(Diff_funcs2);

    let Diff_funcs3 = diffusionFunctionGroup3();
    ide_controller.add_function_group(Diff_funcs3);
    func_group_into_presets(Diff_funcs3);

    //Adding Rule30 Preset

    let rule30_funcs = rule30FunctionGroup();
    ide_controller.add_function_group(rule30_funcs);
    func_group_into_presets(rule30_funcs);

    let rule30_funcs2 = rule30FunctionGroup2();
    ide_controller.add_function_group(rule30_funcs2);
    func_group_into_presets(rule30_funcs2);

    let rule30_funcs3 = rule30FunctionGroup3();
    ide_controller.add_function_group(rule30_funcs3);
    func_group_into_presets(rule30_funcs3);

    console.log("Created Presets");
}

function func_group_into_presets(func_group)
{
    // <option value="Game Of Life">Game Of Life</option>
    let selectMenu = document.getElementById("autoList");
    let newOption = document.createElement("option");

    newOption.value = func_group.groupName;
    newOption.innerHTML = func_group.groupName;

    selectMenu.appendChild(newOption);
}

// https://www.w3schools.com/jsref/event_oninput.asp
function automatonInputNameChanged()
{
    console.log("Automaton name changed");
    document.getElementById("autoNamePrompt").innerHTML = "Cellular Automata Name: ";

    let name = document.getElementById("automatonName").value;
    ide_controller.name_change(name);
}


// CHECK THIS LATER TO MAKE SURE THE FUNCTIONALITY STILL EXISTS(WILL BE REPLACED USING COMPILE)
//
// function confirmCode()
// {
// 	let functionInput = document.getElementById("functionInputArea");
// 	let functionNameInput = document.getElementById("functionNameInput");
// 	let rawCode = functionInput.value;
// 	let func_name = functionNameInput.value;

// 	var compiledFunction;

// 	if(selectedFunction === "initBoard")
// 	{
// 		confirmedInitBoardText = rawCode;
// 		confirmedInitBoardFuncName = func_name;
// 		eval("compiledFunction = " + rawCode + ";");
// 		setBoardInitFunction(compiledFunction,func_name);
// 	}
// 	else if(selectedFunction === "updateCell")
// 	{
// 		confirmedUpdateCellText = rawCode;
// 		confirmedUpdateCellFuncName = func_name;
// 		eval("compiledFunction = " + rawCode + ";");
// 		setCellUpdateFunction(compiledFunction,func_name);
// 	}
// 	else if(selectedFunction === "drawBoard")
// 	{
// 		confirmedDrawBoardText = rawCode;
// 		confirmedDrawBoardFuncName = func_name;
// 		eval("compiledFunction = " + rawCode + ";");
// 		setDrawBoardFunction(compiledFunction,func_name);
// 	}
// }

function compile_all()
{
    console.log("compile clicked");
    let func_group = ide_controller.simulating_group;

    // NOTE!!!! CHANGE HERE SO THAT IT ALSO COMPILES THE TEXT THAT IS CURRENTLY
    // IN THE TEXT EDITOR

    ide_controller.saveCurrentProgress();

    ide_controller.compile_func_group(func_group);
    // console.log(func_group.initBoardCompiled);


    if(func_group.initBoardForm === "compute-each")
    {
        setBoardInitFunction(func_group.initBoardCompiled,func_group.initBoardName);
        console.log("compute-each compiled");
    }
    else if(func_group.initBoardForm === "literal")
    {
        let initFunc;
        eval("initFunc = function(){this.grid = copyGrid(func_group.initBoardState);}");
        setBoardInitFunction(initFunc,func_group.initBoardName);

        if(board !== null)
        {
            let correct = func_group.initBoardState;
            let prevArea = rows*cols*cellWidth*cellWidth;
            let totalCells = correct.length * correct[0].length;
            document.getElementById("quantityRowInput").value = correct.length;
            document.getElementById("quantityColInput").value = correct[0].length;
            document.getElementById("cellWidthInput").value = Math.ceil(Math.sqrt(prevArea/totalCells));
            setParameters();
        }
    }
    else
    {
        console.log("NO VALID INITBOARD FORM, COMPILATION FAILED");
        return;
    }

    initForm = func_group.initBoardForm;

    setCellUpdateFunction(func_group.updateCellCompiled,func_group.updateCellName);
    setDrawBoardFunction(func_group.drawBoardCompiled,func_group.drawBoardName);

    board.setCellUpdate(updateCellFunc);
    drawer.setDrawBoard(drawBoardFunc);

    if(drawer.isRunning)
    {
        drawer.stopDrawing();
        drawer.startDrawing();
    }
}

function new_automaton()
{
    console.log("New Automaton clicked");
    ide_controller.set_simulating(null);
    document.getElementById("automatonName").value = "";
}

function createInitInput(numRows,numCols,numData)
{
    let result = "";

    for(let i = 0; i < numRows; i++)
    {
        let line = "{";
        for(let j = 0; j < numCols; j++)
        {
            let col = "[";
            for(let k = 0; k < numData; k++)
            {
                col += Math.floor(Math.random()*10) + ",";
            }
            col = col.substring(0,col.length-1);
            col += "],";
            line += col;
        }
        line = line.substring(0,line.length-1);
        line += "},";
        result += line;
    }
    result = result.substring(0,result.length-1);

    return result;
}