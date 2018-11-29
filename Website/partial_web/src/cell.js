class Cell
{
	// Data:
	//
	// state
	// Basically an array of values. So that cells can have any quantity of variables
	// to represent state.
	//
	// futureState
	// Also an array of values. Will have the same length as state. When a cell is updated,
	// state will be changed to futureState
	//
	// board
	// Needs reference to the grid of all cells, so that it can access the state of
	// other cells. As well as the rows and cols in the board.
	//
	// posR, posC
	// Needs to know where it is in the grid, row and column

	constructor(board, dataWidth, posR, posC) // maybe a name different than dataWidth would be nice tho.
	{
		this.state = new Array(dataWidth);
		this.futureState = new Array(dataWidth);

		this.board = board;
		this.posR = posR;
		this.posC = posC;

		this.update = null;
	}

	setCurrentState(ind,value)
	{
		if(ind < 0 || ind >= this.state.length)
		{
			let msg = "(setCurrentState)";
			msg += " INDEX SUPPLIED IS OUT OF BOUNDS! Length: " + this.data.length + ", Index: " + ind;
			console.log(msg);
		}
		else
			this.state[ind] = value;
	}

	setFutureState(ind,value)
	{
		if(ind < 0 || ind >= this.futureState.length)
		{
			let msg = "(setFutureState)";
			msg += " INDEX SUPPLIED IS OUT OF BOUNDS! Length: " + this.data.length + ", Index: " + ind;
			console.log(msg);
		}
		else
			this.futureState[ind] = value;
	}

	changeWidth(dataWidth)
	{
		this.data = new Array(width);
		this.futureState = new Array(width);
	}

	nextGeneration()
	{
		// let temp = state;
		// state = futureState;
		// futureState = temp;

		// if everything is done correctly, then these arrays could just be swapped, 
		// as is done above. But for safety, we'll reset futureState each time.
		// .... I have decided to let futureState copy over the currentState, and it'll
		// wait until its overwritten, or stay the same until then.
		this.state = this.futureState;

		this.futureState = new Array(this.state.length);
		for(let ind = 0; ind < this.state.length; ind++)
			this.futureState[ind] = this.state[ind];
	}
}