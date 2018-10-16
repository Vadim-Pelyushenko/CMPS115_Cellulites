import java.util.Random;

public class Board
{
	int[][] neigh = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
	
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
	// distribute green red and blue evenly.
	public void initialize(int initMode) 
	{
		if(initMode == 1)
		{
			for(int i = 0; i < width; i++) 
			{
				for(int j = 0; j < height; j++) 
				{
					int choice = (int)(Math.random()*3);
					
					grid[i][j] = new Cell(i,j,choice);
					tempBoard[i][j] = new Cell(i,j,4);
				}
			}
		}
	}
	
	public void nextGeneration() 
	{
		for(int i = 0; i < width; i++) 
		{
			for(int j = 0; j < height; j++) 
			{
				activateCell(i,j);
			}
		}
		
		// The tempBoard is now the current board, and the
		// current board will be reused as the tempBoard.
		Cell[][] swap = grid;
		grid = tempBoard;
		tempBoard = swap;
	}
	
	public void activateCell(int x, int y) 
	{
		Cell curr = getCell(x,y);
		
		if(curr.gradient != 0) 
		{
			Cell temp = tempBoard[curr.x][curr.y];
			temp.gradient = curr.gradient;
			temp.state = curr.state;
		}
		
		Cell neigh = randomNeighbor(x,y);
		
		if(neigh == null || neigh.gradient == 0)
			return;
		
		if(curr.beats(neigh)) 
		{
			Cell temp = tempBoard[neigh.x][neigh.y];
			
			neigh.gradient--;
			temp.gradient--;
			if(neigh.gradient == 0) 
			{
				temp.state = curr.state;
				
//				temp.gradient = 10;
				temp.gradient = Math.min(curr.gradient + 1,Simulator.maxGradient);
			}
		}
	}
	
	public Cell randomNeighbor(int x, int y) 
	{
		int[] dc = neigh[(int)(Math.random()*8)];
		
		int nx = x + dc[0];
		int ny = y + dc[1];
		
		if(nx < 0 || nx >= width || ny < 0 || ny >= height)
			return null;
		else
			return getCell(nx,ny);
	}
	
	public Cell getCell(int x, int y) 
	{
		return grid[x][y];
	}
}