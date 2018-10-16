import java.util.Random;

public class Board
{
	private Cell[][] grid;
	private Cell[][] tempBoard;
	
	int width;
	int height;
	
	public Board(int width, int height) 
	{
		this.width = width;
		this.height = height;
		
		grid = new Cell[width][height];
		tempBoard = new Cell[width][height];
	}
	
	// Initializes the board of cells. initMode 1 will
	// set about 1/3rd of all cells to alive.
	public void initialize(int initMode) 
	{
		if(initMode == 1)
		{
			for(int i = 0; i < width; i++) 
			{
				for(int j = 0; j < height; j++) 
				{
					if(Math.random() < 1.0/3)
						grid[i][j] = new Cell(true);
					else
						grid[i][j] = new Cell(false);
					
					tempBoard[i][j] = new Cell(false);
				}
			}
		}
		else if(initMode == 2) 
		{
			for(int i = 0; i < width; i++) 
			{
				for(int j = 0; j < height; j++) 
				{
					grid[i][j] = new Cell(false);					
					tempBoard[i][j] = new Cell(false);
				}
			}
			
			grid[5][5].alive = true;
			grid[6][5].alive = true;
			grid[7][5].alive = true;
			grid[7][4].alive = true;
			grid[6][3].alive = true;
		}
	}
	
	public void nextGeneration() 
	{
		for(int i = 0; i < width; i++) 
		{
			for(int j = 0; j < height; j++) 
			{
				tempBoard[i][j].alive = nextState(i,j);
			}
		}
		
		// The tempBoard is now the current board, and the
		// current board will be reused as the tempBoard.
		Cell[][] swap = grid;
		grid = tempBoard;
		tempBoard = swap;
	}
	
	// Looks at nearby neighbors to determine what should
	// be the state of a particular cell in the next
	// generation
	public boolean nextState(int x, int y) 
	{
		int liveAdj = 0;
		
		liveAdj += checkAlive(x-1,y-1);
		liveAdj += checkAlive(x,y-1);
		liveAdj += checkAlive(x+1,y-1);
		
		liveAdj += checkAlive(x-1,y);
		liveAdj += checkAlive(x+1,y);
		
		liveAdj += checkAlive(x-1,y+1);
		liveAdj += checkAlive(x,y+1);
		liveAdj += checkAlive(x+1,y+1);
		
		if(grid[x][y].alive)
			return liveAdj == 2 || liveAdj == 3;
		else
			return liveAdj == 3;
	}
	
	// Return 0 if out of bounds, or if not alive
	// return 1 otherwise.
	// used for the purposes of counting live neighbors
	public int checkAlive(int x, int y) 
	{
		if(x < 0 || x >= width || y < 0 || y >= height)
			return 0;
		
		return grid[x][y].alive ? 1 : 0;
	}
	
	public Cell getCell(int x, int y) 
	{
		return grid[x][y];
	}
	
//	Debugging
//	public static void main(String[] args) 
//	{
//		Debugging
//		Board b = new Board(10,10);
//		b.initialize(2);
//		b.printBoard();
//		b.nextGeneration();
//		b.printBoard();
//	}
	
	
//	Debugging
//	private void printBoard() 
//	{
//		for(int i = 0; i < height; i++) 
//		{
//			for(int j = 0; j < width; j++) 
//			{
//				int value = grid[i][j].alive ? 1 : 0;
//				System.out.print(value + " ");
//			}
//			System.out.println();
//		}
//		System.out.println();
//	}
}
