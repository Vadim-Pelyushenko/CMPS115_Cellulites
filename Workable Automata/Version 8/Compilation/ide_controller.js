class IDE_Controller
{
	// Data:
	//
	// func_groups
	// A list of all of the function groups
	//
	// simulating_group
	// the group that is currently going to be simulated/is being edited right now
	//
	// selected_function
	// the function that is currently being displayed

	constructor()
	{
		this.func_groups = new Array();
		this.simulating_group = null;
		this.selected_function = "nothing";

		console.log("Constructed IDE controller");
	}

	set_simulating(group)
	{
		this.saveCurrentProgress();

		// if(sim !== null && sim.groupIndex == -1)
		// {
		// 	console.log("adding created automaton to list");
		// 	sim.groupIndex = this.func_groups.length;
		// 	let ind = this.find_func_group(sim.groupName);
		// 	if(ind != -1)
		// 		sim.groupName = sim.groupName + "!";

		// 	this.func_groups.push(sim);
		// 	func_group_into_presets(sim);
		// }

		// let check = this.find_func_group(group.groupName);
		// if(check != -1) // removes the group from the array, if its there
		// 	this.func_groups.splice(check,1);

		if(group === null)
			console.log("Clearing room for a new automaton");
		this.simulating_group = group;

		// let menu = document.getElementById("functionSelection");
		// menu.getElementsByTagName('option')[2].selected = "selected";
		this.change_function_editing("updateCell");
	}

	// returns true on success, false otherwise
	swap_simulating_by_name(group_name)
	{
		let ind = this.find_func_group(group_name);

		if(ind === -1)
		{
			console.log("No Function Group by the name: " + group_name + " found");
			return false;
		}

		this.set_simulating(this.func_groups[ind]);
		return true;
	}

	find_func_group(groupName)
	{
		for(let k = 0; k < this.func_groups.length; k++)
			if(this.func_groups[k].groupName === groupName)
				return k;

		return -1;
	}

	// User changed the name of the CA currently being edited
	name_change(name)
	{
		let sim = this.simulating_group;
		if(sim === null)
		{
			console.log("New Cellular Automaton Created");
			this.set_simulating(new Function_Group(name,this.func_groups.length+1));
			func_group_into_presets(this.simulating_group);
			this.func_groups.push(this.simulating_group);
		}
		else
		{
			console.log("Old name: " + sim.groupName);
			sim.groupName = name;
			console.log("New name: " + sim.groupName);

			if(sim.groupIndex != -1)
			{
				// console.log("Name change, index in list: " + sim.groupIndex);
				let menu = document.getElementById("autoList");

				// Debugging
				// console.log("index of sim in thing: " + sim.groupIndex);
				// console.log("WHOLE STRUCTURE");
				// let list = menu.getElementsByTagName('option');
				// for(let k = 0; k < list.length; k++)
				// 	console.log(k + ": " + list[k].innerHTML);
				// console.log("old: " + menu.getElementsByTagName('option')[sim.groupIndex].innerHTML);
				// console.log("new: " + name);

				let correspondingOption = menu.getElementsByTagName('option')[sim.groupIndex];
				correspondingOption.innerHTML = name;
				correspondingOption.value = name;
			}
		}
	}

	add_function_group(group)
	{
		this.func_groups.push(group); // appends it to the array
	}

	change_function_editing(func)
	{
		let functionEditing = document.getElementById("functionEditingPart");
		let functionArea = document.getElementById("functionInputArea");
		let functionNameInput = document.getElementById("functionNameInput");
		let formField = document.getElementById("formTypeField");
		let formInput = document.getElementById("formTypeInput");

		if(func === "nothing")
		{
			functionEditing.style.display = "none"; // hide the function editing part
			selected_function = null;
			console.log("You are not writing to any function");
			return;
		}
		
		this.selected_function = func;
		functionEditing.style.display = ""; // unhide the function editing part

		let dataWidthField = document.getElementById("dataWidthField");
		if(func === "initBoard")
		{
			this.loadInitBoardFromSelected();
			formField.style.display = "";
			formInput.value = this.simulating_group.initBoardForm;

			dataWidthField.style.display = "";
			swapOutTab('functionEditingPart',true,true);
		}
		else if(func === "updateCell")
		{
			this.loadUpdateCellFromSelected();
			formField.style.display = "none";
			dataWidthField.style.display = "none";
			swapOutTab('functionEditingPart',false,false);
		}
		else if(func === "drawBoard")
		{
			this.loadDrawBoardFromSelected();
			formField.style.display = "";
			formInput.value = this.simulating_group.drawBoardForm;
			dataWidthField.style.display = "none";
			swapOutTab('functionEditingPart',true,false);
		}


	}

	saveCurrentProgress()
	{
		console.log("Saving current progress");
		if(this.selected_function === "nothing" || this.simulating_group === null)
		{
			console.log("no progress to save");
			return;
		}

		let sim = this.simulating_group;
		let func_name = document.getElementById("functionNameInput").value;
		let func_raw = document.getElementById("functionInputArea").value;
		let formEntry = document.getElementById("formTypeInput").value;

		if(this.selected_function === "initBoard")
		{
			sim.dataWidth = parseInt(document.getElementById("dataWidthInput").value) || 1;
			sim.initBoardName = func_name;
			sim.initBoardRaw = func_raw;

			if(formEntry !== "compute-each" && formEntry !== "literal")
				sim.initBoardForm = "";
			else
				sim.initBoardForm = formEntry;
		}
		else if(this.selected_function === "updateCell")
		{
			sim.updateCellName = func_name;
			sim.updateCellRaw = func_raw;
		}
		else if(this.selected_function === "drawBoard")
		{
			if(formEntry !== "mapping" && formEntry !== "compute-color" && formEntry !== "coarse")
				sim.drawBoardForm = "";
			else
				sim.drawBoardForm = formEntry;

			sim.drawBoardName = func_name;
			sim.drawBoardRaw = func_raw;
		}
		else
		{
			console.log("INVALID SELECTED FUNCTION. SOMETHING WRONG WITH SYSTEM");
			console.log("RECEIVED: " + this.selected_function);
		}
	}

	loadInitBoardFromSelected()
	{
		let functionNameInput = document.getElementById("functionNameInput");
		let functionArea = document.getElementById("functionInputArea");
		console.log("You are writing the board init function");

		if(this.simulating_group !== null)
		{
			functionArea.value = this.simulating_group.initBoardRaw;
			functionNameInput.value = this.simulating_group.initBoardName;
			document.getElementById("dataWidthInput").value = this.simulating_group.dataWidth;
		}
		else
		{
			functionArea.value = "";
			functionNameInput.value = "";
		}
	}

	loadUpdateCellFromSelected()
	{
		let functionNameInput = document.getElementById("functionNameInput");
		let functionArea = document.getElementById("functionInputArea");
		console.log("You are writing the cell update function");

		if(this.simulating_group !== null)
		{
			functionArea.value = this.simulating_group.updateCellRaw;
			functionNameInput.value = this.simulating_group.updateCellName;
		}
		else
		{
			functionArea.value = "";
			functionNameInput.value = "";
		}
	}

	loadDrawBoardFromSelected()
	{
		let functionNameInput = document.getElementById("functionNameInput");
		let functionArea = document.getElementById("functionInputArea");
		console.log("You are writing the cell drawing function");

		if(this.simulating_group !== null)
		{
			functionArea.value = this.simulating_group.drawBoardRaw;
			functionNameInput.value = this.simulating_group.drawBoardName;
		}
		else
		{
			functionArea.value = "";
			functionNameInput.value = "";
		}
	}

	compile_func_group(func_group)
	{
		console.log("Compiling Function Group: \"" + func_group.groupName + "\"");

		// Compile the initialization
		let initForm = func_group.initBoardForm;
		let initRaw = func_group.initBoardRaw;
		let initDataWidth = func_group.dataWidth;

		let compiled = this.compile_initialization_function(initRaw,initForm,initDataWidth);
		// console.log("FUNCTION: \n" + compiled);

		// console.log(compiled.replace(/\n+/g,""));
		// compiled = compiled.substring(compiled.indexOf("function()"));

		let assignment = "func_group.initBoardCompiled = ";
		if(initForm === "compute-each")
			eval(assignment + compiled);
		else if(initForm === "literal")
			func_group.initBoardState = compiled;

		// Compile the update cell
		assignment = "func_group.updateCellCompiled = ";
		compiled = this.compile_update_function(func_group.updateCellRaw);
		eval(assignment + compiled);

		// Compile the drawing
		assignment = "func_group.drawBoardCompiled = ";
		let drawRaw = func_group.drawBoardRaw;
		let drawForm = func_group.drawBoardForm;
		compiled = this.compile_drawing_function(drawRaw,drawForm);

		// console.log(compiled); // Debugging
		eval(assignment + compiled);
		console.log("Compilation of \"" + func_group.groupName + "\" complete\n\n");
	}

	compile_initialization_function(rawCode,form,dataWidth)
	{
		console.log("DataWidth Received: " + dataWidth);
		if(form === "compute-each")
			return compileInit(rawCode,dataWidth);
		else if(form === "literal")
			return parseInitialization(rawCode);
		else
		{
			console.log("INVALID FORM OF INPUTTED USER CODE");
			return null;
		}
	}

	compile_update_function(rawCode)
	{
		return compileUpdate(rawCode);
	}

	compile_drawing_function(rawCode,form)
	{
		if(form === "mapping")
			return compileMapping(rawCode);
		else if(form === "compute-color")
			return compileComputedColor(rawCode);
		else if(form === "coarse")
			return compileCoarseDrawing(rawCode);
		else
		{
			console.log("INVALID FORM OF INPUTTED USER CODE");
			return null;
		}
	}
}

// A function group is essentially a collection of functions that is enough to
// specify the information needed to run a cellular automaton.
class Function_Group
{
	// Data:
	//
	// groupName
	// The name of this group of functions. Like Game of Life - Random Black and White,
	// or Game of Life - Glider Cannon Yellow and Blue. Though the user can call it anything
	// they want.
	//
	// initBoardName
	// The name of the initBoard function. Allows differentiating between functions that
	// have the same role but are in different groups.
	//
	// initBoardRaw
	// The raw code(text) of the initBoard function. May be code, or may be a literal
	// grid of values.
	//
	// initBoardForm
	// The form of specification for initBoardRaw. Can be "literal", meaning that it is
	// a literal grid of values. Or it may be "compute-each" meaning the user computes
	// the initialization of each cell through code.
	//
	// initBoardCompiled
	// The compiled code(text) of the initBoard function. May be code, or may be a literal
	// grid of values, if the latter then it will not differ from initBoardRaw
	//
	// initBoardState
	// The current state of the board(null if not yet done)
	//
	// dataWidth
	// How long the array of state is supposed to be for cells
	//
	// updateCellName
	// The name of the updateCell function. Allows differentiating between functions that
	// have the same role but are in different groups.
	//
	// updateCellRaw
	// The raw code(text) of the updateCell function
	//
	// updateCellCompiled
	// The compiled code(text) of the updateCell function
	//
	// drawBoardName
	// The name of the drawBoard function. Allows differentiating between functions that
	// have the same role but are in different groups.
	//
	// drawBoardRaw
	// The raw code(text) of the drawBoard function
	//
	// drawBoardForm
	// The form of specification for the raw code, can be "mapping", "compute-color", and "coarse"
	// "mapping" meaning that the raw code is a mapping from state to color, 
	// "compute-color" meaning that the user specifies how to compute the color of a cell 
	// from its state.
	// "coarse" meaning that the user is not given a nested for loop and has to specify how
	// all cells are drawn. Can be good if the user for instance wants to draw each cell as a
	// circle, or triangles or whatever.
	//
	// drawBoardCompiled
	// The compiled code(text) of the drawBoard function
	//
	// groupIndex
	// an index telling where in the list of function groups this one is.

	constructor(groupName,index)
	{
		this.groupName = groupName;
		this.groupIndex = index;

		this.initBoardName = null;
		this.initBoardRaw = "";
		this.initBoardCompiled = null;
		this.initBoardState = null;
		this.initBoardForm = "compute-each"; // indirectly changed by user
		this.dataWidth = 1;

		this.updateCellName = null;
		this.updateCellRaw = "";
		this.updateCellCompiled = null;

		this.drawBoardName = null;
		this.drawBoardRaw = "";
		this.drawBoardCompiled = null;
		this.drawBoardForm = "mapping"; // directly changed by user
	}

	// setInitBoard(func_name,func_raw,form_result,form,dataWidth)
	// {
	// 	this.initBoardName = func_name;
	// 	this.initBoardRaw = func_raw;
	// 	this.initBoardForm = form;

	// 	if(form === "literal")
	// 		this.initBoardState = form_result;
	// 	else if(form === "compute-each")
	// 		this.initBoardCompiled = form_result;

	// 	this.dataWidth = dataWidth;
	// }

	// setUpdateCell(func_name,func_raw,func_compiled)
	// {
	// 	this.updateCellName = func_name;
	// 	this.updateCellRaw = func_raw;
	// 	this.updateCellCompiled = func_compiled;
	// }

	// setDrawBoard(func_name,func_raw,func_compiled,form)
	// {
	// 	this.drawBoardName = func_name;
	// 	this.drawBoardRaw = func_raw;
	// 	this.drawBoardCompiled = func_compiled;
	// 	this.drawBoardForm = form;
	// }

	readyToSimulate()
	{
		return (this.initBoardCompiled != null || this.initBoardState != null) &&
		       this.updateCellCompiled != null &&
		       this.drawBoardCompiled != null;
	}

	readyToDrawInitialState()
	{
		return (this.initBoardCompiled != null || this.initBoardState != null) &&
		       this.drawBoardCompiled != null;
	}
}