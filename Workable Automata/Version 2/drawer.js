class Drawer
{
	constructor(board, cellWidth)
	{
		this.board = board;
		this.cellWidth = cellWidth;

		this.canv = document.createElement("canvas");
		document.body.insertBefore(this.canv,document.body.childNodes[0]);

		// there was a problem in that it wasn't drawing anything, turns out the canvas
		// had height 0.
		// console.log(document.body.childNodes[0]);

		this.canv.width = board.rows*cellWidth;
		this.canv.height = board.cols*cellWidth;
		this.context = this.canv.getContext("2d");

		this.drawLoop = null;
		this.frame = 0;
	}

	startDrawing()
	{
		console.log("The interval is set");
		// In order for the object context to still hold, bind is necessary
		this.drawFrame();
		this.drawLoop = setInterval(this.drawFrame.bind(this),17);
	}

	stopDrawing()
	{
		if(this.drawLoop == null)
		{
			console.log("There is nothing being drawn right now");
		}
		else
		{
			clearInterval(this.drawLoop);
		}
	}

	drawFrame()
	{
		console.log("current Frame: " + this.frame);
		this.frame++;

		this.drawBoard();
		this.board.updateBoard();
	}

	// printError()
	// {
	// 	console.log("THIS IS THE ERROR");
	// }

	drawBoard()
	{
		let ctx = this.context;

		ctx.fillStyle = "#000000"; // Set the color to black
		ctx.fillRect(0,0,this.canv.width,this.canv.height);
		
		ctx.fillStyle = "#FFFFFF";
		for(let r = 0; r < this.board.rows; r++)
		{
			for(let c = 0; c < this.board.cols; c++)
			{
				if(this.board.grid[r][c] == 1)
					ctx.fillRect(r*this.cellWidth,c*this.cellWidth,this.cellWidth,this.cellWidth);
			}
		}
	}
}