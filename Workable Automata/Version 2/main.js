function startSite()
{
	console.log("The script has begun");

	let rows = 100;
	let cols = 100;
	let cellWidth = 5;

	let board = new Board(rows,cols);
	let drawer = new Drawer(board,cellWidth);	

	drawer.startDrawing();
}