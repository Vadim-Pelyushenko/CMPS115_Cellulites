import java.awt.Color;
import java.awt.Graphics;
import java.awt.image.BufferedImage;

import javax.swing.JPanel;

public class Projector extends JPanel
{
	Board board;
	int width;
	int height;
	int pixelSize;
	
	BufferedImage buffer;
	Graphics bfg;
	
	public Projector(Board board, int width, int height, int pixelSize) 
	{
		this.width = width;
		this.height = height;
		this.pixelSize = pixelSize;
		this.board = board;
		
		buffer = new BufferedImage(width*pixelSize,height*pixelSize,BufferedImage.TYPE_INT_RGB);
		bfg = buffer.createGraphics();
	}
	
	public void paintComponent(Graphics g) 
	{
		super.paintComponent(g);
		
		for(int i = 0; i < width; i++) 
		{
			for(int j = 0; j < height; j++) 
			{
				bfg.setColor(board.getCell(i, j).getColor());
				bfg.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
			}
		}
		g.drawImage(buffer,0,0,this);
	}
}
