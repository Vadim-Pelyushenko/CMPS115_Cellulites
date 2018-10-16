import java.awt.Color;

public class Cell
{
	boolean alive;
	
	public Cell(boolean alive) 
	{
		this.alive = alive;
	}
	
	public Color getColor() 
	{
		if(alive)
			return Color.WHITE;
		else
			return Color.BLACK;
	}
}
