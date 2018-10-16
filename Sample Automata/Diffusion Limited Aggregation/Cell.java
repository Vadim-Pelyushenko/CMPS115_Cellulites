// randomChoice(Neighborhood) is an inbuilt function which will randomly select an adjacent
// cell from a given list of cells
// random(int,int) generates a random number from the lowerbound to upperbound(inclusive of both)

Cell
{
	int state; // 0 is black, 1 is red, 2 is white
	
	Neighborhood adjacent = {N,E,S,W,NE,SE,SW,NW};
	
	void init()
	{
		if(Environment.numWCells == 0)
		{
			if(random(1,100) == 1)
			{
				this.state = 1;
			}
			else
			{
				this.state = 0;
			}
		}
		else
		{
			if(random(1,Environment.numRem) == 1)
			{
				this.state = 2;
			}
		}
	}
	
	void update()
	{
		int anyWhite = 0;
		
		for(Neighbor n : adjacent)
		{
			if(n.state == 2)
			{
				anyWhite++;
			}
		}
		
		if(anyWhite != 0)
		{
			*this.state = 2;
		}
		else
		{
			Neighbor adj = randomChoice(adjacent);
			if(adj.state == 0)
			{
				^this.state = 0;
				^rand.state = 1;
			}
		}		
	}
}
