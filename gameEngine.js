// JavaScript Document

// GLOBAL DECLARATIONS ==============================================================================================
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;


const TILE_COLOR_ARRAY = new Array( 
		"#000000", "#0F051A","#1F0A33","#2E0F4C","#3D1466","#4C1A80","#5C1F99","#6B24B2",
		"#7A29CC","#8A2EE6","#9933FF","#A347FF","#AD5CFF","#B870FF","#C285FF","#CC99FF",
		"#D6ADFF","#E0C2FF","#EBD6FF","#F5EBFF","#FFFFFF" );



var gridCount = 0;
var gridGame = [];
var currGameIndex;

// GAME LOGIC =======================================================================================================


function Tile(mantissa, powerValue, posX, posY) {
	this.tileValue = Math.pow(mantissa, powerValue);
	this.tileColor = TILE_COLOR_ARRAY[powerValue - 1];
	this.posX = posX;
	this.posY = posY;
	this.DOMRef = null;
}


function Grid(mantissa, gridSize, winningExponent, tileDimension, DOMParentId) {
	this.gamePlayable = true;
	this.mantissa = mantissa;
	this.gridSize = gridSize;
	this.tileDimension = tileDimension;
	this.winningExponent = winningExponent;

	this.scoreValue = 0;

	this.DOMParentId = DOMParentId;
	this.DOMRef = null; 
	this.scoreKeeperRef = null;

	this.animationPowerUpLeft = "powerUp 0.5s ease-out";
	this.animationPowerUpRight = "powerUp 0.5s ease-out";
	this.animationPowerUpUp = "powerUp 0.5s ease-out";
	this.animationPowerUpDown = "powerUp 0.5s ease-out";
	this.animationBirthOfATile = "birthOfATile 0.2s";
	this.animationReset = "";
	this.animationResetTime = 500;
	this.animationScoreUp = "scoreUp 0.4s ease-in-out"

	this.genTileCount = 0;

	this.grid = new Array(gridSize);	
	var i, j;
	for (i = 0; i < gridSize; i++) {
		this.grid[i] = new Array(gridSize);
		for (j = 0; j < gridSize; j++) {
			this.grid[i][j] = null;
		}
	}

	this.createDOM(gridCount);
	gridCount++;
}

Grid.prototype.createDOM = function (gridId) {
	var newGrid = document.createElement("DIV");
	newGrid.setAttribute("class", "grid");
	newGrid.setAttribute("id", "grid" + gridId);
	newGrid.style.width = (this.tileDimension * this.gridSize) + "px";
	newGrid.style.height = (this.tileDimension * this.gridSize) + "px";

	for (i = 0; i < this.gridSize; i++) {
		for (j = 0; j < this.gridSize; j++) {
			var backgroundTile = document.createElement("DIV");
			backgroundTile.setAttribute("class", "tileBG");
			backgroundTile.style.width = (this.tileDimension) + "px";
			backgroundTile.style.height = (this.tileDimension) + "px";
			backgroundTile.style.top = (i * this.tileDimension) + "px";
			backgroundTile.style.left = (j * this.tileDimension) + "px";
			newGrid.appendChild(backgroundTile);
		}
	}

	var scoreKeeper = document.createElement("SPAN");
	scoreKeeper.setAttribute("class", "scoreKeeper");
	var scoreKeeperText = document.createTextNode("GAME " + (gridId + 1) + ", SCORE: ");
	scoreKeeper.appendChild(scoreKeeperText);
	var scoreKeeperValue = document.createElement("SPAN");
	scoreKeeperValue.setAttribute("id", "scoreKeeper" + gridId);
	scoreKeeperValue.appendChild(document.createTextNode("0"));
	scoreKeeper.appendChild(scoreKeeperValue);
	newGrid.appendChild(scoreKeeper);
	this.DOMRef = newGrid;
	this.scoreKeeperRef = scoreKeeperValue;
	document.getElementById(this.DOMParentId).appendChild(newGrid);
}

Grid.prototype.startGame = function() {
	this.addRandomTile();
	this.addRandomTile();
}

Grid.prototype.logGrid = function () {
	var i, j, thisRow = "";
	for (i = 0; i < this.gridSize; i++) {
		thisRow = "";
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null) {
				thisRow += this.grid[i][j].tileValue + ", ";	
			} else {
				thisRow += "0, ";	
			}
			
		}
		console.log(thisRow);
	}
}

Grid.prototype.addRandomTile = function () {
	if (!this.gamePlayable) {
		return;
	}
	// first thing to do is check if game already won
	var hasWon = this.checkWin();
	if (!hasWon) {
		// gather all vacant positions
		var emptyPositionsList = new Array();
		for (i = 0; i < this.gridSize; i++) {
			for (j = 0; j < this.gridSize; j++) {
				if (this.grid[i][j] == null) {
					emptyPositionsList.push(i * this.gridSize + j);
				}
			}
		}
		// check is game not over, and proceed
		if (emptyPositionsList.length != 0) {
			// get one random place from the empty positions
			var randomPos = emptyPositionsList[Math.floor(Math.random() * emptyPositionsList.length)];
			var randomPosX = Math.floor(randomPos / this.gridSize);
			var randomPosY = randomPos % this.gridSize;
			// create a new random tile
			var newTile = new Tile(this.mantissa, 1, randomPosX, randomPosY);
			// assign it to the vacant spot	
			this.grid[randomPosX][randomPosY] = newTile;
			// do the DOM manipulation part
			var tileDiv = document.createElement("DIV");
			var tileSpan = document.createElement("SPAN");
			var tileSpanText = document.createTextNode(newTile.tileValue);
			tileSpan.appendChild(tileSpanText);
			tileDiv.appendChild(tileSpan);				
			tileDiv.setAttribute("class", "tile");
			tileDiv.setAttribute("id", "tile" + this.genTileCount);
			tileDiv.style.backgroundColor = TILE_COLOR_ARRAY[newTile.tileValue - 1];
			tileDiv.style.top = Math.floor(newTile.posX * this.tileDimension) + "px";
			tileDiv.style.left = Math.floor(newTile.posY * this.tileDimension) + "px";		
			this.DOMRef.appendChild(tileDiv);		
			tileDiv.style.width = (this.tileDimension) + "px";
			tileDiv.style.height = (this.tileDimension) + "px";
			tileDiv.style.webkitAnimation = this.animationBirthOfATile;
			newTile.DOMRef = tileDiv;
			this.genTileCount++;	
			if (!this.furtherMovesPossible()) {
				this.gamePlayable = false;
				alert("You lose!");	
			}
			//return true;
		} else {
			// game is already non playable, do nothing
			// game over ? !
			// check for possible moves, if possible moves == none, then
			//console.log("GAME OVER! GRID FULL!!");
			//if (!this.furtherMovesPossible()) {

			//	alert("You lose!");	
			//}			
			//return false;
		}
	} else {
		// has won the game, finish up!!
		this.gamePlayable = false;
		alert("You won!");
		//return false;
	}
	
	
}

Grid.prototype.userMove = function(direction) {
	var that = this;
	switch(direction) {
		case KEY_LEFT:
			this.shiftTilesLeft();
			setTimeout(function() { that.mergeTilesLeft(); }, 100);
			setTimeout(function() { that.shiftTilesLeft(); }, 200);
			setTimeout(function() { that.addRandomTile(); }, 300);
			break;
		case KEY_UP:
			this.shiftTilesUp();
			setTimeout(function() { that.mergeTilesUp(); }, 100);
			setTimeout(function() { that.shiftTilesUp(); }, 200);
			setTimeout(function() { that.addRandomTile(); }, 300);
			break;
		case KEY_RIGHT:
			this.shiftTilesRight();
			setTimeout(function() { that.mergeTilesRight(); }, 100);
			setTimeout(function() { that.shiftTilesRight(); }, 200);
			setTimeout(function() { that.addRandomTile(); }, 300);
			break;
		case KEY_DOWN:
			this.shiftTilesDown();
			setTimeout(function() { that.mergeTilesDown(); }, 100);
			setTimeout(function() { that.shiftTilesDown(); }, 200);
			setTimeout(function() { that.addRandomTile(); }, 300);
			break;
		default:	
	}
	//setTimeout(function() { that.logGrid(); }, 500);
	
}

Grid.prototype.checkWin = function() {
	var i, j;
	for (i = 0; i < this.gridSize; i++) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i][j].tileValue > this.winningExponent) {
				// game has been won
				//alert("You Won!");
				return true;
				//this.logGrid();
			}
		}
	}
	return false;
}

Grid.prototype.furtherMovesPossible = function() {
	//check any neighborung tiles exist with similar values 
	for (i = 0; i < this.gridSize; i++) {
		for (j = 0; j < this.gridSize - 1; j++) {
			if (this.grid[i][j] == null || this.grid[i][j + 1] == null || this.grid[i][j].tileValue == this.grid[i][j + 1].tileValue) {
				// vacant tile lcoation found, return true
				return true;
			}
		}
	}
	for (i = 0; i < this.gridSize - 1; i++) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] == null || this.grid[i + 1][j] == null || this.grid[i][j].tileValue == this.grid[i + 1][j].tileValue) {
				// vacant tile lcoation found, return true
				return true;
			}			
		}
	}
	return false;	
}

Grid.prototype.addToScore = function (value) {
	this.scoreValue += value;
	//display score on dom
	this.scoreKeeperRef.innerHTML = this.scoreValue;
	this.scoreKeeperRef.style.webkitAnimation = this.animationScoreUp;
	var that = this;
	setTimeout(function() { that.scoreKeeperRef.style.webkitAnimation = that.animationReset; }, this.animationResetTime);
}

Grid.prototype.shiftTilesLeft = function() {
	var i, j;
	var movedInLastIteration = true;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = 0; i < this.gridSize; i++) {
			for (j = 1; j < this.gridSize; j++) {
				if (this.grid[i][j] != null && this.grid[i][j - 1] == null) {
					// shiftable, since left pos is empty
					this.grid[i][j - 1] = this.grid[i][j];
					this.grid[i][j - 1].DOMRef.style.left = (this.tileDimension * (j - 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
}
Grid.prototype.shiftTilesRight = function() {
	var i, j;
	var movedInLastIteration = true;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = 0; i < this.gridSize; i++) {
			for (j = this.gridSize - 2; j >= 0; j--) {
				if (this.grid[i][j] != null && this.grid[i][j + 1] == null) {
					// shiftable, since right pos is empty
					this.grid[i][j + 1] = this.grid[i][j];
					this.grid[i][j + 1].DOMRef.style.left = (this.tileDimension * (j + 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
}
Grid.prototype.shiftTilesUp = function() {
	var i, j;
	var movedInLastIteration = true;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = 1; i < this.gridSize; i++) {
			for (j = 0; j < this.gridSize; j++) {
				if (this.grid[i][j] != null && this.grid[i - 1][j] == null) {
					// shiftable, since right pos is empty
					this.grid[i - 1][j] = this.grid[i][j];
					this.grid[i - 1][j].DOMRef.style.top = (this.tileDimension * (i - 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
}
Grid.prototype.shiftTilesDown = function() {
	var i, j;
	var movedInLastIteration = true;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = this.gridSize - 2; i >= 0; i--) {
			for (j = 0; j < this.gridSize; j++) {
				if (this.grid[i][j] != null && this.grid[i + 1][j] == null) {
					// shiftable, since right pos is empty
					this.grid[i + 1][j] = this.grid[i][j];
					this.grid[i + 1][j].DOMRef.style.top = (this.tileDimension * (i + 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
}


Grid.prototype.mergeTilesLeft = function() {
	var i, j;
	var that, thatTile;
	for (i = 0; i < this.gridSize; i++) {
		for (j = 1; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i][j - 1] != null && this.grid[i][j].tileValue == this.grid[i][j - 1].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i][j - 1].tileValue += 1;				
				var increasedScore = Math.pow(this.mantissa, this.grid[i][j - 1].tileValue - 1);
				this.grid[i][j - 1].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.grid[i][j - 1].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i][j - 1].tileValue - 1];
				this.grid[i][j - 1].DOMRef.style.webkitAnimation = this.animationPowerUpLeft;
				that = this;
				thatTile = this.grid[i][j - 1];
				setTimeout(function() { thatTile.DOMRef.style.webkitAnimation = that.animationReset; }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
}
Grid.prototype.mergeTilesRight = function() {
	var i, j;
	var that, thatTile;
	for (i = 0; i < this.gridSize; i++) {
		for (j = this.gridSize - 2; j >= 0; j--) {
			if (this.grid[i][j] != null && this.grid[i][j + 1] != null && this.grid[i][j].tileValue == this.grid[i][j + 1].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i][j + 1].tileValue += 1;
				var increasedScore = Math.pow(this.mantissa, this.grid[i][j + 1].tileValue - 1);
				this.grid[i][j + 1].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.scoreValue
				this.grid[i][j + 1].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i][j + 1].tileValue - 1];
				this.grid[i][j + 1].DOMRef.style.webkitAnimation = this.animationPowerUpRight;
				that = this;
				thatTile = this.grid[i][j + 1];
				setTimeout(function() { thatTile.DOMRef.style.webkitAnimation = that.animationReset; }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
}
Grid.prototype.mergeTilesUp = function() {
	var i, j;
	var that, thatTile;
	for (i = 1; i < this.gridSize; i++) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i - 1][j] != null && this.grid[i][j].tileValue == this.grid[i - 1][j].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i - 1][j].tileValue += 1;
				var increasedScore = Math.pow(this.mantissa, this.grid[i - 1][j].tileValue - 1);
				this.grid[i - 1][j].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.grid[i - 1][j].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i - 1][j].tileValue - 1];
				this.grid[i - 1][j].DOMRef.style.webkitAnimation = this.animationPowerUpUp;
				that = this;
				thatTile = this.grid[i - 1][j];
				setTimeout(function() { thatTile.DOMRef.style.webkitAnimation = that.animationReset; }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
}
Grid.prototype.mergeTilesDown = function() {
	var i, j;
	var that, thatTile;
	for (i = this.gridSize - 2; i >= 0; i--) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i + 1][j] != null && this.grid[i][j].tileValue == this.grid[i + 1][j].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i + 1][j].tileValue += 1;
				var increasedScore = Math.pow(this.mantissa, this.grid[i + 1][j].tileValue - 1);
				this.grid[i + 1][j].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.grid[i + 1][j].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i + 1][j].tileValue - 1];
				this.grid[i + 1][j].DOMRef.style.webkitAnimation = this.animationPowerUpDown;
				that = this;
				thatTile = this.grid[i + 1][j];
				setTimeout(function() { thatTile.DOMRef.style.webkitAnimation = that.animationReset; }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
}



// KEYBOARD HANDLING ================================================================================================
function captureKey(e) {
	var evtObj = window.event ? event : e;
	
	var unicodeKey = evtObj.keyCode ? evtObj.keyCode : evtObj.charCode;
	switch (unicodeKey) {
		case KEY_LEFT:
		case KEY_UP:			
		case KEY_RIGHT:			
		case KEY_DOWN:
			evtObj.preventDefault();
			gridGame[currGameIndex].userMove(unicodeKey);			
			break;			
		default:
	}		
}

// INIT ROUTINES ====================================================================================================
function init() {

	gridGame.push(new Grid(2, 4, 12, 120, "gameArea"));
	currGameIndex = gridGame.length - 1;
	
	gridGame[currGameIndex].startGame();

	document.addEventListener("keydown", captureKey);
	
}

window.addEventListener("load", init);