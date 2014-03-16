2048, 4096, ...
======

## TOOLKIT FOR THE R^N GAME
**For which people seem to be quite crazy right now...**

Based on the [works of Gabriele Cirulli](http://gabrielecirulli.github.io/2048/), which was inspired by [1024 by Veewo Studio](http://itunes.apple.com/us/app/1024!/id823499224) and conceptually similar to [Threes by Asher Vollmer](http://asherv.com/threes/). 

###{ WORK IN PROGRESS } 

This code is developed from scratch but is identical in concept and created with an additional agenda of developing an extensible framework for experimenting with the game itself.

### Features already implemented:

* **Multiple game instances** one after another in the game area.
* Each game fully customizable with: 
	* Variable **Mantissa** (R, example = 2 for the [2048 game](http://gabrielecirulli.github.io/2048/))
	* Variable **Winning Exponent** (N, example = 11 for the 2048 game)
	* Variable **Grid size** of the game board (K, example = 4 for the 2048 game)
	* Variable **Tile size** (T in pixels, example ~100 for the 2048 game) 
* **Game Generator** options panel to create multiple instances of the game with a few clicks and experiment with different game parameters. 
* **Exposed functions** to manipulate the game data through console.

### Exposed functions

To experiment without the **Game Generator** interface, use the browser's JavaScript console itself.

For example, **to generate a new game instance,** run the following command:

**`setupNewGame(R, N, K, T);`**

with suitable values for **R, N, K, T**. 

The accepted range of these values are:

* **R**: 2 to 10
* **N**: 2 to 20
* **K**: 2 to 20
* **T**: 50 to 300

Each new game instance generation sets the most newly generated game instance to be the **current** game instance, which is maintained in the global variable **`currGameIndex`** which holds the index of the game instance in the **`gridGame`** array that holds all the game instances. This is because of the design consideration that keyboard inputs (UP, DOWN, LEFT, RIGHT) should be *directed to only one* game instance at a time.

To activate keyboard input to a *previously* created game instance, either use the **Game Generator** interface to change the **Current Game Index (CGI)** or simply invoke the setter function **`setCGI(cgiValue)`** directly through the browser's console  passing the respective game instance's index as the parameter **cgiValue** to the function. A complementary getter function **`getCGI()`** is also available to obtain the present **CGI value**. 

It is not required to manipulate the **`currGameIndex`** variable directly, which actually holds a **0-based** index value while CGI data as exposed on the **Game Generator** interface as well as **CGI getters and setters** are **1-based**. Also, modifying the **`currGameIndex`** variable directly will not provide a correct feedback to the **Game Generator** interface. 

Also, you can use the **`showLogGrid(gameIndexValue)`** function  to view the raw grid / tile data of a game instance in the console. Provide the **1-based** game instance index value (as agreeing with CGI values) as the value of the **`gameIndexValue`** parameter.


### Features planned, not yet implemented:

* Improved features on the **Game Generator** interface.
* **AI Solver**
* **Single-Input Multiple-Reflection** difficulty mode.
* Other game enhancements.





