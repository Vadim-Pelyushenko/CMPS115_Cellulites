The Rule 30 Cellular Automata, branched off from Game of Life C.A.

------ Below this line prpvides the same information as Game Of Life README ------
The interchangeable functions are
-initBoard()
-updateState()
-drawBoard()

So, a particular CA is really defined by how the state of all the cells are updated,
which is where updateState() comes in.

For any CA, there are plenty of ways in which you can initialize then state of the
CA, which is where initBoard() comes in.

For any CA, you can have different choices as to how it is drawn, like for Game of Life
one may draw the live cells are yellow and the dead cells as gray, this is where
drawBoard() comes in.

*In addition to the interchangeable functions, a Cell class has been implemented, and
the code that has depended on the grid of values for the state of cells has been
appropriately altered to fit this.


NOTE: This version should be tested out a significant bit before further improvement of the
system. By this I mean trying out different CA's with this scheme and seeing if it
is robust enough to handle them.
