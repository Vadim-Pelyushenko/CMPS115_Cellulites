function compile()
{
	let textAr = document.getElementById("codeInput");
	let rawCode = textAr.value;
	let outputArea = document.getElementById("compiledCode");
	let result = "";

	// outputArea.innerHTML = rawCode;

	let lines = rawCode.split("\n");
	for(let i = 0; i < lines.length; i++)
	{
		let line = lines[i].trim();
		if(line.length < 13 || line.substring(0,13) !== "let >local< =")
			result += line + "\n";
		else
		{
			let parsed = parseLocality(line.substring(13));
			if(parsed == null)
			{
				console.log("THERE WAS AN ERROR IN PARSING");
				return;
			}
			else
			{
				result += parsed + "\n";
			}
		}
	}

	console.log("result: ");
	console.log(result);
	// result = result.replace("\n","<br>");
	// outputArea.innerHTML = result;
}

function parseLocality(code)
{
	console.log("PARSING LOCALITY");

	let dollInd = code.indexOf("$");
	let leftParInd = code.indexOf("(");
	let rightParInd = code.indexOf(")");
	let tildeInd = code.indexOf("~");
	let leftBrackInd = code.indexOf("[");
	let rightBrackInd = code.indexOf("]");

	if(!validateFormat(dollInd,leftParInd,rightParInd,tildeInd,leftBrackInd,rightBrackInd))
		return null;

	let hoodInput = code.substring(leftParInd + 1,rightParInd).split(",");
	if(hoodInput.length == 0)
	{
		console.log("NO HOOD COORDS HAVE BEEN SUPPLIED");
		return null;
	}

	for(let k = 0; k < hoodInput.length; k++)
		if(!validateCoord(hoodInput[k]))
			return null;

	let defString = code.substring(leftBrackInd+1,rightBrackInd);
	let defState = defString.split(",");

	if(!validateDefault(defState))
		return null;

	// At this point, everything is validated

	let unrolled = "\n";
	unrolled += "// THIS CODE HAS BEEN GENERATED USING SYNTAX SUGAR\n";
	unrolled += "let def = {state: [" + defString + "]};\n";

	unrolled += "let " + hoodInput[0];
	for(let k = 1; k < hoodInput.length; k++)
		unrolled += "," + hoodInput[k];
	unrolled += ";\n\n";

	// TESTING, NOT FINAL

	for(let k = 0; k < hoodInput.length; k++)
	{
		let disp = interpretCoordToDisplacement(hoodInput[k]);
		unrolled += generateIfElse(hoodInput[k],disp);
	}

	// TESTING, NOT FINAL

	unrolled += "let local = [" + code.substring(leftParInd + 1,rightParInd) + "];\n";



	unrolled += "// THIS CODE HAS BEEN GENERATED USING SYNTAX SUGAR\n";

	console.log("PARSED");
	// console.log(unrolled);
	return unrolled;
}

function generateIfElse(varName,disp)
{
	let result = "";

	let op1 = disp[0] > 0 ? " + " : " - ";
	let op2 = disp[1] > 0 ? " + " : " - ";

	let offset1 = disp[0] == 0 ? "" : op1 + Math.abs(disp[0]);
	let offset2 = disp[1] == 0 ? "" : op2 + Math.abs(disp[1]);

	let indexAccess1 = "[posR" + offset1 + "]";
	let indexAccess2 = "[posC" + offset2 + "]";

	let passedStatement = "\t" + varName + " = " + "grid" + indexAccess1 + indexAccess2 + ";";
	let failedStatement = "\t" + varName + " = def;"

	let condition1 = "";
	let condition2 = "";
	if(disp[0] < 0)
		condition1 = "posR - " + Math.abs(disp[0]) + " >= 0";
	else if(disp[0] > 0)
		condition1 = "posR + " + Math.abs(disp[0]) + " < rows";

	if(disp[1] < 0)
		condition2 = "posC - " + Math.abs(disp[1]) + " >= 0";
	else if(disp[1] > 0)
		condition2 = "posC + " + Math.abs(disp[1]) + " < cols";

	let compound = condition1 !== "" && condition2 !== "" ? " && " : "";

	result += "if(" + condition1 + compound + condition2 + ")\n";
	result += passedStatement + "\n";
	result += "else\n";
	result += failedStatement + "\n\n";

	return result;
}

function interpretCoordToDisplacement(coord)
{
	let displaceR = 0;
	let displaceC = 0;

	// Handle North South part
	let ind = -1;

	if(coord.indexOf("N") != -1)
	{
		ind = coord.indexOf("N");
		displaceR = -1;
	}
	else if(coord.indexOf("S") != -1)
	{
		ind = coord.indexOf("S");
		displaceR = 1;
	}

	if(ind != -1 && ind < coord.length - 1)
	{
		let check = coord.substring(ind+1,ind+2);
		if(!isNaN(check))
			displaceR *= parseInt(check);
	}

	// Handle West East part
	ind = -1;

	if(coord.indexOf("W") != -1)
	{
		ind = coord.indexOf("W");
		displaceC = -1;
	}
	else if(coord.indexOf("E") != -1)
	{
		ind = coord.indexOf("E");
		displaceC = 1;
	}

	if(ind != -1 && ind < coord.length - 1)
		displaceC *= parseInt(coord.substring(ind+1,ind+2));

	// Return result

	return [displaceR,displaceC];
}

function validateDefault(def)
{
	for(let k = 0; k < def.length; k++)
		if(isNaN(def[k]))
			return false;
	return true;
}

function validateCoord(hoodInput)
{
	if(hoodInput.length == 0)
	{
		console.log("EMPTY HOOD ELEMENTS NOT ALLOWED");
		return false;
	}
	else if(hoodInput.length > 4)
	{
		console.log("CANNOT HAVE A HOOD ELEMENT SPECIFIED WITH MORE THAN 4 CHARACTERS");
		return false;
	}

	// checks to make sure all chars are valid
	for(let k = 0; k < hoodInput.length; k++)
		if(hoodFormatKind(hoodInput.substring(k,k+1)) == -1)
		{
			console.log("INVALID CHARACTER: " + hoodInput.substring(k,k+1));
			return false;
		}
	// checks to make sure all chars are valid

	// checks to make sure first char is not a number
	let firstKind = hoodFormatKind(hoodInput.substring(0,1));
	if(firstKind == 4) // they entered a number as the first character
	{
		console.log("CANNOT START A HOOD ELEMENT WITH A NUMBER");
		return false;
	}
	else if(hoodInput.length == 1)
		return true;
	// checks to make sure first char is not a number

	// checks whether the 2nd char is a number or not
	let firstVal;
	let secondKind = hoodFormatKind(hoodInput.substring(1,2));
	let nextRead;
	if(secondKind == 4)
	{
		firstVal = parseInt(hoodInput.substring(1,2),10);
		if(hoodInput.length == 2)
			return true;
		else if(firstKind >= 2)
		{
			console.log("IF A HOOD ELEMENT STARTS WITH EAST OR WEST, IT CAN ONLY HAVE A SINGLE NUMBER FOLLOW");
			return false;
		}
		secondKind = hoodFormatKind(hoodInput.substring(2,3));
		if(secondKind <= 1 || secondKind == 4)
		{
			console.log("THE SECOND CARDINAL DIRECTION MUST BE EAST OR WEST");
			return false;
		}
		nextRead = 3;
	}
	else // first cardinal did not have a number following it
	{
		if(hoodInput.length == 2)
			return true;
		else if(hoodInput.length == 4)
			return false;

		firstVal = 0;
		nextRead = 2;
	}

	let secondVal = hoodFormatKind(hoodInput.substring(nextRead,nextRead+1));

	if(secondVal != 4)
	{
		console.log("IF A CHARACTER FOLLOWING SECOND CARDINAL, IT MUST BE A NUMBER");
		return false;
	}

	return true;
}

function hoodFormatKind(hoodChar)
{
	if(hoodChar === "N")
		return 0;
	else if(hoodChar === "S")
		return 1;
	else if(hoodChar === "W")
		return 2;
	else if(hoodChar === "E")
		return 3;
	else if(!isNaN(hoodChar))
		return 4;
	else
		return -1;
}

function validateFormat(dollInd,leftParInd,rightParInd,tildeInd,leftBrackInd,rightBrackInd)
{
	if(dollInd == -1)
	{
		console.log("MISSING DOLLAR SIGN"); 
		return false;
	}
	else if(leftParInd == -1)
	{
		console.log("MISSING LEFT PAREN SIGN");
		return false;
	}
	else if(rightParInd == -1)
	{
		console.log("MISSING RIGHT PAREN");
		return false;
	}
	else if(tildeInd == -1)
	{
		console.log("MISSING TILDE");
		return false;
	}
	else if(leftBrackInd == -1)
	{
		console.log("MISSING LEFT BRACKET");
		return false;
	}
	else if(rightBrackInd == -1)
	{
		console.log("MISSING RIGHT BRACKET");
		return false;
	}

	if(dollInd > leftParInd)
	{
		console.log("THE DOLLAR SIGN IS SUPPOSED TO COME BEFORE THE LEFT PAREN");
		return false;
	}
	else if(leftParInd > rightParInd)
	{
		console.log("THE LEFT PAREN IS SUPPOSED TO COME BEFORE THE RIGHT PAREN");
		return false;
	}
	else if(rightParInd > tildeInd)
	{
		console.log("THE RIGHT PAREN IS SUPPOSED TO COME BEFORE THE TILDE");
		return false;
	}
	else if(tildeInd > leftBrackInd)
	{
		console.log("THE TILDE IS SUPPOSED TO COME BEFORE THE LEFT BRACKET");
		return false;
	}
	else if(leftBrackInd > rightBrackInd)
	{
		console.log("THE LEFT BRACKET IS SUPPOSED TO COME BEFORE THE RIGHT BRACKET");
		return false;
	}

	return true;
}