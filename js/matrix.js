// const tile = require("./tile");

class Matrix {
	constructor() {
		this.gridElement = document.querySelector(".grid");
		this.cells = [];
		this.canPlay = false;
		this.gameOver = false;
		this.directionHelpers = {
			// roots are the first row's or column's indexes of swipe direction
			UP: [1, 2, 3, 4],
			RIGHT: [4, 8, 12, 16],
			DOWN: [13, 14, 15, 16],
			LEFT: [1, 5, 9, 13]
		};
	}

	init() {
		const cellElements = document.querySelectorAll(".cell");

		cellElements.forEach((el, cellIndex) => {
			this.cells[cellIndex + 1] = {
				element: el,
				top: el.offsetTop,
				left: el.offsetLeft,
				number: null
			};
		});

		tile.putRandomCellOnBoard();
		this.canPlay = true;
	}

	randomEmptyCellIndex() {
		let emptyCellFound = false;

		this.cells.forEach(cell => {
			if (cell.number === null) {
				emptyCellFound = true;
				return;
			}
		});

		if (!emptyCellFound) {
			this.canPlay = !this.isGameOver();
			return this.canPlay;
		}

		while (true) {
			let rand = Math.floor(Math.random() * (this.cells.length - 1)) + 1;
			if (this.cells[rand].number === null) {
				return rand;
			}
		}
	}

	isGameOver() {
		let newGrid = [];

		for (let i = 1; i < this.cells.length; i++) {
			let cell = this.cells[i];
			let row = Math.floor((i - 1) / 4);

			if (i % 4 === 1) newGrid.push([]);

			console.log(newGrid, row);

			if (!cell.number) {
				newGrid[row].push(0);
				return false;
			} else {
				newGrid[row].push(cell.number.dataset?.value);
			}
		}

		let colAdder = [-1, 0, 1];
		let rowAdder = [[0], [-1, 1], [0]];

		for (let row = 0; row < newGrid.length; row++) {
			for (let col = 0; col < newGrid.length; col++) {
				for (let index = 0; index < colAdder.length; index++) {
					let ca = colAdder[index];
					if (col + ca > -1 && col + ca < newGrid.length) {
						for (let ra of rowAdder[index]) {
							if (row + ra > -1 && row + ra < newGrid.length) {
								if (newGrid[row + ra][col + ca] === newGrid[row][col]) {
									return false;
								}
							}
						}
					}
				}
			}
		}
		console.log(newGrid);

		return true;
	}

	slide(direction) {
		if (!this.canPlay || this.gameOver) {
			return false;
		}

		// set canPlay to false to prevent continous slides
		this.canPlay = false;

		const helpers = this.directionHelpers[direction];

		let adder = direction === "RIGHT" || direction === "DOWN" ? -1 : 1;

		adder *= direction === "UP" || direction === "DOWN" ? 4 : 1;

		// start loop with root index
		for (let i = 0; i < helpers.length; i++) {
			const root = helpers[i];

			// adder or decrement through grid from root
			// j starts from 1 bc no need to check root cell
			for (let j = 1; j < 4; j++) {
				const cellIndex = root + j * adder;
				const cell = this.cells[cellIndex];

				if (cell.number !== null) {
					let moveToCell = null;

					// check if cells below(to root) this cell empty or has same number
					// to decide to move or stay
					// k starts from j-1 first cell below j
					// k ends by 0 which is root cell
					for (let k = j - 1; k >= 0; k--) {
						const nextCellIndex = root + k * adder;
						const nextCell = this.cells[nextCellIndex];

						if (nextCell.number === null) {
							// the cell is empty, move to and check next cell
							moveToCell = nextCell;
						} else if (
							cell.number.dataset.value === nextCell.number.dataset.value
						) {
							// the cell has same number, move, merge and stop
							moveToCell = nextCell;
							break;
						} else {
							// next cell is not empty and not same with moving number(number is moving cell is not)
							// number can't go further
							break;
						}
					}

					if (moveToCell !== null) {
						tile.moveCells(cell, moveToCell);
					}
				}
			}
		}

		// spawn a new number and make game canPlay
		setTimeout(this.timeoutFunction, 200);
	}

	timeoutFunction() {
		if (tile.putRandomCellOnBoard()) {
			matrix.canPlay = true;
		} else {
			this.gameOver = this.isGameOver();

			if (this.gameOver) {
				const gameOver = document.getElementById("gameOver");
				const scoreNumber = gameOver.querySelector(".scoreNumber");

				scoreNumber.innerText = tile.score;
				gameOver.style.display = "flex";
				gameOver.style.zIndex = 10;
			}
		}
	}
}

const matrix = new Matrix();

// module.exports = matrix;
