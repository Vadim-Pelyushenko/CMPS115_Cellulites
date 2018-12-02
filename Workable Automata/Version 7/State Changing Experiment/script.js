var drawer = null;

changeParams();
setEventListeners();

function changeParams()
{
	rows = parseInt(document.getElementById("rowInput").value);
	cols = parseInt(document.getElementById("colInput").value);
	cellWidth = parseInt(document.getElementById("widthInput").value);
	gridColor = document.getElementById("gridColorInput").value;

	if(drawer === null)
		drawer = new Drawer(rows,cols,cellWidth,gridColor);
	else
		drawer.change_parameters(rows,cols,cellWidth,gridColor);

	drawer.redrawAll();
}

function setEventListeners()
{
	let outputCanvas = document.getElementById("outputCanvas");
	let targetCanvas = document.getElementById("targetCanvas");

	outputCanvas.onmousedown = drawer.onMouseDown.bind(drawer);
	outputCanvas.onmousemove = drawer.onMouseMove.bind(drawer);
	outputCanvas.onmouseup = drawer.onMouseUp.bind(drawer);
	outputCanvas.onmouseleave = drawer.onMouseUp.bind(drawer);

	let zoom = drawer.zoom_controller;

	targetCanvas.onmousedown = zoom.targOnMouseDown.bind(zoom);
	targetCanvas.onmousemove = zoom.targOnMouseMove.bind(zoom);
	targetCanvas.onmouseup = zoom.targOnMouseUp.bind(zoom);
	targetCanvas.onmouseleave = zoom.targOnMouseUp.bind(zoom);
}

function zoomClick(amount)
{
	drawer.zoom_controller.zoomChange(amount);
	drawer.redrawAll();
}