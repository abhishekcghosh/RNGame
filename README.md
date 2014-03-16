2048, 4096, ...
======

## TOOLKIT FOR THE R^N GAME
### { FOR WHICH PEOPLE SEEM QUITE CRAZY RIGHT NOW }

Based on the [works of Gabriele Cirulli](http://gabrielecirulli.github.io/2048/), which was inspired by [1024 by Veewo Studio](http://itunes.apple.com/us/app/1024!/id823499224) and conceptually similar to [Threes by Asher Vollmer](http://asherv.com/threes/). 

###{ WORK IN PROGRESS } 

This code is developed from scratch but is identical in concept and created with an additional agenda of developing an extensible framework for experimenting with the game itself.

### Features already implemented:

* **Multiple game instances** one after another in the game area.
* Each game fully customizable with: 
	* Variable **Mantissa** (R, example = 2 for the [2048 game](http://gabrielecirulli.github.io/2048/))
	* Variable **Winning Exponent** (N, example = 11 for the 2028 game)
	* Variable **Grid size** of the game board (K, example = 4 for the 2048 game)
	* Variable **Tile size** (T, example ~100px for the 2048 game) 

**Game Generator** interface is *not yet developed*, for for the moment have to generate through the Browser's JavaScript console itself.

**To generate a new game instance, just run the following the console:**

**`setupNewGame(N, K, R, T);`**

with suitable values of N, K, R, T.

**Note:** Each new game instance generation sets the most newly generated game instance to be the **current** game instance, which is maintained in the global variable `currGameIndex` which holds the index of the game instance in the `gridGame` array that holds all the game instances.

To go back to a previous change, simply change the value of `currGameIndex` to the respective game instance's index.



### Features yet to be developed:

* Game Enhancements
* **Control Panel** for the Game Generator
* Game Solver



