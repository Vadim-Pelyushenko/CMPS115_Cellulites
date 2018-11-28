function parse()
{
	let text = document.getElementById("input").value;
	let lines = text.split("\n");

	let result = "";
	result += "let result = \"\";\n\n";

	for(let k = 0; k < lines.length; k++)
	{
		result += "result += \"" + lines[k] + "\";\n";
	}

	console.log(result);
}