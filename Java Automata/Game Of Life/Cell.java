import java.awt.Color;

public class Cell
{
	boolean alive;
	
	public Cell(boolean alive) 
	{
		this.alive = alive;
	}
	
	public void setState(boolean state) 
	{
		alive = state;
	}
	
	public Color getColor() 
	{
		if(alive)
			return Color.WHITE;
		else
			return Color.BLACK;
	}
}
