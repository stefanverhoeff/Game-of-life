/**
 * Big global
 */
var LIFE = {
		intervalId: null,
		interval: 10,
		randomFactor: 0.8,
		stepNumber: 0,
		cellHeight: 15,
		cellWidth: 15,
		gridHeight: 30,
		gridWidth: 30,
		grid: []
};

/**
 * onload
 */
$(function() {
	// Setup the grid
	clearGrid();
	
	// Intial random cells in grid ready to play
	randomGrid(LIFE.grid);
	displayGrid(LIFE.grid);
	
	// UI handlers
	$('#buttonStep').click(function () {
		// Do one game loop cycle
		gameLoop();
	});
	
	$('#buttonLoop').click(function () {
		LIFE.interval = parseInt($('#interval').attr('value'), 10);
		
		if (LIFE.running) {
			// Stop existing loop
			window.clearInterval(LIFE.intervalId);
		}
		
		LIFE.running = true;
		LIFE.intervalId = window.setInterval(gameLoop, LIFE.interval);
	});

	$('#buttonStop').click(function () {
		stopRunning();
	});

	$('#interval').change(function () {
		return false;
	});
	
	$('#buttonRandom').click(function() {
		randomGrid(LIFE.grid);
		displayGrid(LIFE.grid);
	});
	
	$('#buttonClear').click(function() {
		clearGrid();
	});
});

function clearGrid() {
	LIFE.stepNumber = 0;
	setupGrid(LIFE.grid, LIFE.gridWidth, LIFE.gridHeight);
	displayGrid(LIFE.grid);
	$('#steps').text(0);
}

function gameLoop() {
	nextCycle(LIFE.grid);
	displayGrid(LIFE.grid);
	$('#steps').text(++LIFE.stepNumber);
}

/**
 * Setup a grid of width,height cells
 */
function setupGrid(grid, width, height) {
	var i,
		j,
		cell;
	
	$('#grid').empty();
	$('#grid').css('width', width*16+4);
	$('#grid').css('height', height*16+4);

	// Init the display field
	for (i=0; i < height; ++i) {
		grid[i] = [];
		for (j=0; j < width; ++j) {
			grid[i][j] = 0;
			cell = $('<div class="cell" id="cell' + i + 'x' + j + '"></div>').get(0);
			cell.x = i;
			cell.y = j;
			$(cell).appendTo('#grid');
			$(cell).click(function() {
				console.log('Cell clicked at ' + this.x + " " + this.y + ", neighbours: " + calcNeighbours(grid, this.x, this.y));
				LIFE.grid[this.x][this.y] = LIFE.grid[this.x][this.y] === 1 ? 0 : 1;
				displayGrid(LIFE.grid);
			});
		}
		
		$('<div class="clear-left"></div>').appendTo('#grid');
	}
}

/**
 * Display the grid, set the cells color matching the grid matrix
 */
function displayGrid(grid) {
	var i,
		j,
		cellNode;
	
	for (i=0; i < grid.length; ++i) {
		for (j=0; j < grid[0].length; ++j) {
			cellNode = $('#cell' + i + 'x' + j);
			$(cellNode).attr('class', grid[i][j] ? 'cell alive' : 'cell dead');
		}
	}
}

/**
 * Move grid forward one cycle
 */
function nextCycle(grid) {
	var nextGrid,
		i,
		j,
		neighbours;
	nextGrid = [];
	
	for (i=0; i < grid.length; ++i) {
		nextGrid[i] = [];
		for (j=0; j < grid[0].length; ++j) {
			neighbours = calcNeighbours(grid, i, j);
			
			if (neighbours < 2) {
				// Starvation
				nextGrid[i][j] = 0;
			}
			else if (neighbours === 3) {
				// Reproduction
				nextGrid[i][j] = 1;
			}
			else if (neighbours > 3) {
				// Over population
				nextGrid[i][j] = 0;
			}
			else {
				// Exactly 2 = stay the same
				nextGrid[i][j] = grid[i][j];
			}
		}
	}
	
	LIFE.grid = nextGrid;
}

function calcNeighbours(grid, i, j) {
	var neighbours = 0;
	neighbours += i > 0 && j > 0				? grid[i-1][j-1] : 0;
	neighbours += i > 0							? grid[i-1][j] : 0;
	neighbours += i > 0 && j+1 < grid[0].length	? grid[i-1][j+1] : 0;
	
	neighbours += j > 0							? grid[i][j-1] : 0;
	neighbours += j+1 < grid[0].length && j > 0	? grid[i][j+1] : 0;
	
	neighbours += i+1 < grid.length && j>0		? grid[i+1][j-1] : 0;
	neighbours += i+1 < grid.length				? grid[i+1][j] : 0;
	neighbours += i+1 < grid.length
						&& j+1 < grid[0].length	? grid[i+1][j+1] : 0;
						
	return neighbours;
}

/**
 * Stop running life
 */
function stopRunning() {
	window.clearInterval(LIFE.intervalId);
	LIFE.running = false;
}

/**
 * Fill the grid with some random values to seed life
 * @param grid
 */
function randomGrid(grid) {
	var i,
		j;
	
	for (i=0; i < grid.length; ++i) {
		for (j=0; j < grid[0].length; ++j) {
			grid[i][j] = Math.random() > LIFE.randomFactor ? 1 : 0;
		}
	}
	
	return grid;
}