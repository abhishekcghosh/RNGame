// JavaScript Document

// GLOBAL DECLARATIONS ==============================================================================================
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;


var TILE_COLOR_ARRAY = new Array( "#00140F", "#00291F", "#003D2E", "#00523D", "#00664C", 
									"#007A5C", "#008F6B", "#00A37A", "#00B88A", "#00CC99", 
									"#19D1A3", "#33D6AD", "#4DDBB8", "#66E0C2", "#80E6CC", 
									"#99EBD6", "#B2F0E0", "#CCF5EB", "#E6FAF5", "#FFFFFF" );


var gridCount = 0;
var gridGame = [];
var currGameIndex;

// GAME LOGIC =======================================================================================================

function setAnimation(obj, animStr) {
	obj.style.webkitAnimation = animStr;
	obj.style.msAnimation = animStr;
	obj.style.MozAnimation = animStr;
	obj.style.OAnimation = animStr;
	obj.style.animation = animStr;
}

function Tile(mantissa, powerValue, posX, posY) {
	this.tileValue = powerValue;
	this.tileColor = TILE_COLOR_ARRAY[powerValue % TILE_COLOR_ARRAY.length - 1];
	this.posX = posX;
	this.posY = posY;
	this.DOMRef = null;
}


function Grid(mantissa, winningExponent, gridSize, tileDimension, DOMParentId) {
	this.gamePlayable = true;
	this.mantissa = mantissa;
	this.gridSize = gridSize;
	this.tileDimension = tileDimension;
	this.winningExponent = winningExponent;

	this.scoreValue = 0;

	this.DOMParentId = DOMParentId;
	this.DOMRef = null; 
	this.scoreKeeperRef = null;
	this.gameMessageContentRef = null;

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

	var gameMessage = document.createElement("DIV");
	gameMessage.setAttribute("class", "gameMessage");
	gameMessage.setAttribute("id", "gameMessage" + gridId);
	var gameMessageContent = document.createElement("DIV");
	gameMessageContent.setAttribute("id", "gameMessageContent" + gridId);
	var gameMessageContentText = document.createTextNode("");
	gameMessageContent.appendChild(gameMessageContentText);
	gameMessage.appendChild(gameMessageContent);

	newGrid.appendChild(gameMessage);


	this.DOMRef = newGrid;
	this.scoreKeeperRef = scoreKeeperValue;
	this.gameMessageContentRef = gameMessageContent;
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
			// probability - launch with exponent 1 or exponent 2
			var newTile;
			if(Math.random() > 0.2) {
				newTile = new Tile(this.mantissa, 1, randomPosX, randomPosY);
			} else {
				newTile = new Tile(this.mantissa, 2, randomPosX, randomPosY);
			}
			// assign it to the vacant spot	
			this.grid[randomPosX][randomPosY] = newTile;
			// do the DOM manipulation part
			var tileDiv = document.createElement("DIV");
			var tileSpan = document.createElement("SPAN");
			var tileSpanText = document.createTextNode(Math.pow(this.mantissa, newTile.tileValue));
			tileSpan.appendChild(tileSpanText);
			tileDiv.appendChild(tileSpan);				
			tileDiv.setAttribute("class", "tile");
			tileDiv.setAttribute("id", "tile" + this.genTileCount);
			tileDiv.style.backgroundColor = TILE_COLOR_ARRAY[newTile.tileValue % TILE_COLOR_ARRAY.length - 1];
			tileDiv.style.top = Math.floor(newTile.posX * this.tileDimension) + "px";
			tileDiv.style.left = Math.floor(newTile.posY * this.tileDimension) + "px";		
			this.DOMRef.appendChild(tileDiv);		
			tileDiv.style.width = (this.tileDimension) + "px";
			tileDiv.style.height = (this.tileDimension) + "px";
			setAnimation(tileDiv, this.animationBirthOfATile);
			newTile.DOMRef = tileDiv;
			this.genTileCount++;	
			if (!this.furtherMovesPossible()) {
				this.gamePlayable = false;
				this.gameMessageContentRef.innerHTML = "Game Over!";
				this.gameMessageContentRef.parentNode.style.opacity = 1;
			}
		} else {
			// do nothing
		}
	} else {
		// has won the game, finish up!!
		this.gamePlayable = false;
		this.gameMessageContentRef.innerHTML = "You Won!";
		this.gameMessageContentRef.parentNode.style.opacity = 1;
	}
	
	
}

Grid.prototype.userMove = function(direction) {
	var that = this;
	var happened = false, shifted = false, shifted2 = false; merged = false;
	switch(direction) {
		case KEY_LEFT:
			shifted = this.shiftTilesLeft();
			setTimeout(function() { merged = that.mergeTilesLeft(); }, 100); 
			setTimeout(function() { shifted2 = that.shiftTilesLeft(); }, 200); 			
			setTimeout(function() { if(shifted || merged || shifted2) { that.addRandomTile(); } }, 300); 
			break;
		case KEY_UP:
			shifted = this.shiftTilesUp();
			setTimeout(function() { merged = that.mergeTilesUp(); }, 100); 
			setTimeout(function() { shifted2 = that.shiftTilesUp(); }, 200);
			setTimeout(function() { if(shifted || merged || shifted2) { that.addRandomTile(); } }, 300); 
			break;
		case KEY_RIGHT:
			shifted = this.shiftTilesRight();
			setTimeout(function() { merged = that.mergeTilesRight(); }, 100); 
			setTimeout(function() { shifted2 = that.shiftTilesRight(); }, 200); 
			setTimeout(function() { if(shifted || merged || shifted2) { that.addRandomTile(); } }, 300); 
			break;
		case KEY_DOWN:
			shifted = this.shiftTilesDown();
			setTimeout(function() { merged = that.mergeTilesDown(); }, 100); 
			setTimeout(function() { shifted2 = that.shiftTilesDown(); }, 200); 
			setTimeout(function() { if(shifted || merged || shifted2) { that.addRandomTile(); } }, 300); 
			break;
		default:	
	}	
}

Grid.prototype.checkWin = function() {
	var i, j;
	for (i = 0; i < this.gridSize; i++) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i][j].tileValue >= this.winningExponent) {
				// game has been won
				return true;
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
	setAnimation(this.scoreKeeperRef, this.animationScoreUp);
	var that = this;
	setTimeout(function() { setAnimation(that.scoreKeeperRef, that.animationReset);  }, this.animationResetTime);
}

Grid.prototype.shiftTilesLeft = function() {
	var i, j;
	var movedInLastIteration = true;
	var gotShifted = false;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = 0; i < this.gridSize; i++) {
			for (j = 1; j < this.gridSize; j++) {
				if (this.grid[i][j] != null && this.grid[i][j - 1] == null) {
					// shiftable, since left pos is empty
					gotShifted = true;
					this.grid[i][j - 1] = this.grid[i][j];
					this.grid[i][j - 1].DOMRef.style.left = (this.tileDimension * (j - 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
	return gotShifted;
}
Grid.prototype.shiftTilesRight = function() {
	var i, j;
	var movedInLastIteration = true;
	var gotShifted = false;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = 0; i < this.gridSize; i++) {
			for (j = this.gridSize - 2; j >= 0; j--) {
				if (this.grid[i][j] != null && this.grid[i][j + 1] == null) {
					// shiftable, since right pos is empty
					gotShifted = true;
					this.grid[i][j + 1] = this.grid[i][j];
					this.grid[i][j + 1].DOMRef.style.left = (this.tileDimension * (j + 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
	return gotShifted;
}
Grid.prototype.shiftTilesUp = function() {
	var i, j;
	var movedInLastIteration = true;
	var gotShifted = false;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = 1; i < this.gridSize; i++) {
			for (j = 0; j < this.gridSize; j++) {
				if (this.grid[i][j] != null && this.grid[i - 1][j] == null) {
					// shiftable, since right pos is empty
					gotShifted = true;
					this.grid[i - 1][j] = this.grid[i][j];
					this.grid[i - 1][j].DOMRef.style.top = (this.tileDimension * (i - 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
	return gotShifted;
}
Grid.prototype.shiftTilesDown = function() {
	var i, j;
	var movedInLastIteration = true;
	var gotShifted = false;
	while(movedInLastIteration == true) {
		movedInLastIteration = false;
		for (i = this.gridSize - 2; i >= 0; i--) {
			for (j = 0; j < this.gridSize; j++) {
				if (this.grid[i][j] != null && this.grid[i + 1][j] == null) {
					// shiftable, since right pos is empty
					gotShifted = true;
					this.grid[i + 1][j] = this.grid[i][j];
					this.grid[i + 1][j].DOMRef.style.top = (this.tileDimension * (i + 1)) + "px";
					this.grid[i][j] = null;
					movedInLastIteration = true;
				}
			}
		}
	}
	return gotShifted;
}


Grid.prototype.mergeTilesLeft = function() {
	var i, j;
	var that, thatTile;
	var gotMerged = false;
	for (i = 0; i < this.gridSize; i++) {
		for (j = 1; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i][j - 1] != null && this.grid[i][j].tileValue == this.grid[i][j - 1].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i][j - 1].tileValue += 1;				
				gotMerged = true;
				var increasedScore = Math.pow(this.mantissa, this.grid[i][j - 1].tileValue);
				this.grid[i][j - 1].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.grid[i][j - 1].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i][j - 1].tileValue % TILE_COLOR_ARRAY.length - 1];
				setAnimation(this.grid[i][j - 1].DOMRef, this.animationPowerUpLeft);
				that = this;
				thatTile = this.grid[i][j - 1];
				setTimeout(function() { setAnimation(thatTile.DOMRef, that.animationReset);  }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
	return gotMerged;
}
Grid.prototype.mergeTilesRight = function() {
	var i, j;
	var that, thatTile;
	var gotMerged = false;
	for (i = 0; i < this.gridSize; i++) {
		for (j = this.gridSize - 2; j >= 0; j--) {
			if (this.grid[i][j] != null && this.grid[i][j + 1] != null && this.grid[i][j].tileValue == this.grid[i][j + 1].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i][j + 1].tileValue += 1;
				gotMerged = true;
				var increasedScore = Math.pow(this.mantissa, this.grid[i][j + 1].tileValue);
				this.grid[i][j + 1].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.scoreValue
				this.grid[i][j + 1].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i][j + 1].tileValue % TILE_COLOR_ARRAY.length - 1];
				setAnimation(this.grid[i][j + 1].DOMRef, this.animationPowerUpRight);
				that = this;
				thatTile = this.grid[i][j + 1];
				setTimeout(function() { setAnimation(thatTile.DOMRef, that.animationReset);  }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
	return gotMerged;
}
Grid.prototype.mergeTilesUp = function() {
	var i, j;
	var that, thatTile;
	var gotMerged = false;
	for (i = 1; i < this.gridSize; i++) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i - 1][j] != null && this.grid[i][j].tileValue == this.grid[i - 1][j].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i - 1][j].tileValue += 1;
				gotMerged = true;
				var increasedScore = Math.pow(this.mantissa, this.grid[i - 1][j].tileValue);
				this.grid[i - 1][j].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.grid[i - 1][j].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i - 1][j].tileValue % TILE_COLOR_ARRAY.length - 1];
				setAnimation(this.grid[i - 1][j].DOMRef, this.animationPowerUpUp);
				that = this;
				thatTile = this.grid[i - 1][j];
				setTimeout(function() { setAnimation(thatTile.DOMRef, that.animationReset);  }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
	return gotMerged;
}
Grid.prototype.mergeTilesDown = function() {
	var i, j;
	var that, thatTile;
	var gotMerged = false;
	for (i = this.gridSize - 2; i >= 0; i--) {
		for (j = 0; j < this.gridSize; j++) {
			if (this.grid[i][j] != null && this.grid[i + 1][j] != null && this.grid[i][j].tileValue == this.grid[i + 1][j].tileValue) {
				// shiftable, since left pos is empty
				this.grid[i + 1][j].tileValue += 1;
				gotMerged = true;
				var increasedScore = Math.pow(this.mantissa, this.grid[i + 1][j].tileValue);
				this.grid[i + 1][j].DOMRef.innerHTML = "<span>" + increasedScore + "</span>";
				this.addToScore(increasedScore);
				this.grid[i + 1][j].DOMRef.style.backgroundColor = TILE_COLOR_ARRAY[this.grid[i + 1][j].tileValue % TILE_COLOR_ARRAY.length - 1];
				setAnimation(this.grid[i + 1][j].DOMRef, this.animationPowerUpDown);
				that = this;
				thatTile = this.grid[i + 1][j];
				setTimeout(function() { setAnimation(thatTile.DOMRef, that.animationReset);  }, this.animationResetTime);
				this.DOMRef.removeChild(this.grid[i][j].DOMRef);
				this.grid[i][j] = null;
			}
		}
	}
	return gotMerged;
}



// USER INTERACTIONS HANDLING ================================================================================================
function captureKey(e) {
	var evtObj = window.event ? event : e;	
	var unicodeKey = evtObj.keyCode ? evtObj.keyCode : evtObj.charCode;
	switch (unicodeKey) {
		case KEY_LEFT:
		case KEY_UP:			
		case KEY_RIGHT:			
		case KEY_DOWN:
			if (evtObj.preventDefault) { 
				// non IE
				evtObj.preventDefault(); 
			} else { 
				// IE
				evtObj.returnValue = false; 
			}
			gridGame[currGameIndex].userMove(unicodeKey);			
			break;			
		default:
	}		
}

function menuToggle(e) {
	var evtObj = window.event ? event : e;	
	if (document.getElementById("sidePane").style.right != "0px") {
		document.getElementById("sidePane").style.right = "0px";	
		document.getElementById("menuIcon").style.opacity = 1;
		loadGameGenData();
	} else {
		document.getElementById("sidePane").style.right = "-500px";	
		document.getElementById("menuIcon").style.opacity = 0.5;
	}
}

function gameGeneratorHandler(e) {
	var R, N, K, T;
	try {
		R = parseInt(document.getElementById("ggR").value);
		N = parseInt(document.getElementById("ggN").value);
		K = parseInt(document.getElementById("ggK").value);
		T = parseInt(document.getElementById("ggT").value);
		if ((R == NaN || N == NaN || K == NaN || T == NaN)|| ( (R < 2 || R > 10) || (N < 2 || N > 20) || (K < 2 || K > 20) || (T < 50 || T > 300)) ) { 
			alert("Invalid Values!");
			return;
		} 
		document.getElementById("ggR").value = R;
		document.getElementById("ggN").value = N;
		document.getElementById("ggK").value = K;
		document.getElementById("ggT").value = T;
		setupNewGame(R, N, K, T);
	} catch(ex) {
		alert(ex);
	}
}

function gameGeneratorCGIUpdate(e) {
	var CGI;
	try {
		CGI = parseInt(document.getElementById("ggCGISelect").value);
		if ((CGI == NaN)|| ( (CGI < 1 || CGI > gridGame.length))) { 
			alert("Invalid CGI set!");
			return;
		} 		
		document.getElementById("ggCGILabel").value = (CGI);
		setCGI(CGI);		
	} catch(ex) {
		alert(ex);
	}	
}

function loadGameGenData() {
	// reverse feedback for CGI
	document.getElementById("ggCGILabel").value = getCGI();
	var cgiSelect = document.getElementById("ggCGISelect");
	var i, cgiOptions = "";
	for (i = 0; i < gridGame.length; i++) {
		cgiOptions += "<option value='" + (i + 1) + "'>" + (i + 1) + "</option>";
	}
	cgiSelect.innerHTML = cgiOptions;
}
// INIT ROUTINES & CONSOLE COMMANDS ====================================================================================================

function addEvent(obj, eventName, callbackFn) {
	if (window.addEventListener) {
		// non IE
		obj.addEventListener(eventName, callbackFn);
	} else  {
		// IE
		obj.attachEvent(eventName, callbackFn);
	}
}

function setupNewGame(R, N, K, T) {
	if ((R < 2 || R > 10) || (N < 2 || N > 20) || (K < 2 || K > 20) || (T < 50 || T > 300)) {
		console.log("Invalid data!");
		return;
	}
	gridGame.push(new Grid(R, N, K, T, "gameArea"));
	currGameIndex = gridGame.length - 1;	
	gridGame[currGameIndex].startGame();
	loadGameGenData();
	window.scrollTo(0, gridGame[currGameIndex].DOMRef.offsetTop + gridGame[currGameIndex].DOMRef.parentNode.offsetTop - 100);
	console.log("New game instance generated!");
}

function setCGI(cgiValue) {
	if (cgiValue < 1 || cgiValue > gridGame.length) {
		console.log("Invalid data!");
		return;
	}
	currGameIndex = (cgiValue - 1);
	loadGameGenData();
	window.scrollTo(0, gridGame[currGameIndex].DOMRef.offsetTop + gridGame[currGameIndex].DOMRef.parentNode.offsetTop - 100);
	console.log("CGI updated!");
}

function getCGI() {
	return (currGameIndex + 1);
}

function showLogGrid(gameIndexValue) {
	if (gameIndexValue < 1 || gameIndexValue > gridGame.length) {
		console.log("Invalid data!");
		return;
	}
	gridGame[gameIndexValue - 1].logGrid();
}

function init() {	
	addEvent(document, "keydown", captureKey);
	addEvent(document.getElementById("menuIcon"), "click", menuToggle);

	addEvent(document.getElementById("ggB1"), "click", gameGeneratorHandler);
	addEvent(document.getElementById("ggB2"), "click", gameGeneratorCGIUpdate);
	
	setupNewGame(2, 12, 4, 120);	
}

addEvent(window, "load", init);