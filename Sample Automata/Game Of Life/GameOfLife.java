// In the backend of the simulation, there will be two grids,
// the current grid, and a temporary grid to calculate the next
// set of states.

// If you want to access the temporary grid(you want to change what
// the future generation is), you access it with *
// If you want to access the current grid, you do so with no special symbol
// If you want to change both simultaneously, you use ^

Cell
{
	int state; // 0 is dead, 1 is alive
	neighborhood = {N,E,S,W,NE,SE,SW,NW};
	// N3W1
	
	// The user will have the option to select a checkbox for which init method
	// they want to utilise. They will also have the option to take in a manually
	// edited initial conditions.
	
	// Can have an initialization method which takes no arguments
	// void init()
	// {
		
	// }
	
	// Can have an initialization method which takes position in grid
	// void init(int row, int col)
	// {
		
	// }
	
	// Can have an initialization method which takes position in grid, as well
	// as red green blue thing. This is in case they want to provide an image
	// to use as the initial conditions
	// void init(int row, int col, int red, int green, int blue)
	// {
		
	// }
	
	void update()
	{
		int totalAlive = 0;
		
		for(Neighbor n : neighborhood)
		{
			if(n.state == 1)
			{
				totalAlive++;
			}
		}
		
		if(this.state == 0)
		{
			if(totalAlive == 3)
			{
				*state = 1;
			}
			*state = 2;
		}
		else
		{
			if(totalAlive < 2)
			{
				*state = 0;
			}
			else if(totalAlive > 3)
			{
				*state = 0;
			}
		}
	}
}
