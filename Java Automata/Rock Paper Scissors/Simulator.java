import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFrame;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

public class Simulator extends JFrame
{
	public static int maxGradient = 10;
	public static boolean shadeMode = false;
	public static int delay = 17;
	
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
				Timer timer = new Timer(delay,new ActionListener() 
				{
					int counter = 0;
					long prevTime = System.currentTimeMillis();

					@Override
					public void actionPerformed(ActionEvent arg0)
					{
						board.nextGeneration();
						proj.repaint();
						long currTime = System.currentTimeMillis();
						long delta = currTime - prevTime;
						System.out.println("frame: " + counter + ", time since last frame: " + delta + " milliseconds");
						prevTime = currTime;
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
		
//		Try uncommenting these options, they look hella dope
//		maxGradient = 100;
//		shadeMode = true;
		
		Simulator sim = new Simulator(width,height,pixel);
		sim.start();
	}
}
