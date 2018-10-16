import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFrame;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

public class Simulator extends JFrame
{
	Board board;
	Projector proj;
	
	int width;
	int height;
	int pixelSize;
	
	public Simulator(int width, int height, int pixelSize) 
	{
		this.width = width;
		this.height = height;
		this.pixelSize = pixelSize;
		
		board = new Board(width,height);
		board.initialize(1);
		
		proj = new Projector(board,width,height,pixelSize);
		this.add(proj);
	}
	
	public void start() 
	{
		// The magic numbers 16 & 39 are because of JFrame giving
		// less room than would actually be expected
		this.setVisible(true);
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setSize(width*pixelSize+16, height*pixelSize + 39);
		
		SwingUtilities.invokeLater(new Runnable()
		{
			@Override
			public void run()
			{
				Timer timer = new Timer(17,new ActionListener() 
				{
					int counter = 0;

					@Override
					public void actionPerformed(ActionEvent arg0)
					{
						board.nextGeneration();
						proj.repaint();
						System.out.println("frame: " + counter);
						counter++;
					}					
				});			
				
				timer.start();
			}			
		});
	}
	
	public static void main(String[] args) 
	{
		int width = 300;
		int height = 300;
		int pixel = 3;
		
		Simulator sim = new Simulator(width,height,pixel);
		sim.start();
	}
}
