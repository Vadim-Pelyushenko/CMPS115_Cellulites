import java.awt.Color;

public class Cell
{
	int state; // 0 for red, 1 for green, 2 for blue
	int gradient;

	int x;
	int y;

	public Cell(int x, int y, int state)
	{
		this.x = x;
		this.y = y;
		this.state = state;

		gradient = Simulator.maxGradient;
	}

	public boolean beats(Cell c)
	{
		return (c.state + 1) % 3 == this.state;
	}

	public Color getColor()
	{
		if (Simulator.shadeMode)
		{
			int intensity = (int) (255.0 / Simulator.maxGradient) * gradient;

			if (state == 0)
				return new Color(intensity, 0, 0);
			else if (state == 1)
				return new Color(0, intensity, 0);
			else if (state == 2)
				return new Color(0, 0, intensity);
			else
				return Color.BLACK;
		} else
		{
			if (state == 0)
				return Color.RED;
			else if (state == 1)
				return Color.GREEN;
			else if (state == 2)
				return Color.BLUE;
			else
				return Color.BLACK;
		}
	}
}
