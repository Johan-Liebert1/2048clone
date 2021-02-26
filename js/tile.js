// const matrix = require("./matrix");
// const numToImageSrc = require("./mapping");

const scoreElement = document.getElementById("currentScore");
const highScoreElement = document.getElementById("highScore");

highScoreElement.innerText = localStorage.getItem("2048highScore")
	? localStorage.getItem("2048highScore")
	: 0;

class Tile {
	constructor() {
		this.numbers = [];
		this.score = 0;
		this.highScore = Number(highScoreElement.innerText);
	}

	getElements() {
		const numElements = document.getElementsByClassName("number");

		for (let num of numElements) {
			this.numbers.push(num);
		}
	}

	putRandomCellOnBoard() {
		const emptyCellIndex = matrix.randomEmptyCellIndex();

		if (emptyCellIndex === false) {
			return false;
		}

		const newCell = document.createElement("div");
		const numberValue = Math.random() > 0.9 ? 4 : 2;

		// newCell.innerText = numberValue;
		newCell.dataset.value = numberValue;
		newCell.classList.add("number");

		newCell.style.top = `${matrix.cells[emptyCellIndex].top}px`;
		newCell.style.left = `${matrix.cells[emptyCellIndex].left}px`;

		const newImage = document.createElement("img");
		newImage.src = numToImageSrc[numberValue];
		newCell.appendChild(newImage);

		newCell.style.animation = "growShrinkCell 200ms linear";

		newCell.style.WebkitAnimation = "growShrinkCell 200ms linear";

		matrix.cells[emptyCellIndex].number = newCell;

		matrix.gridElement.append(newCell);

		return true;
	}

	moveCells(fromCell, toCell) {
		const number = fromCell.number;

		if (toCell.number === null) {
			// target cell is empty fill with number
			number.style.top = `${toCell.top}px`;
			number.style.left = `${toCell.left}px`;
			toCell.number = number;

			toCell.number.innerHTML = "";
			const newImage = document.createElement("img");
			newImage.src = numToImageSrc[number.dataset.value];

			toCell.number.appendChild(newImage);

			fromCell.number = null;
		} else if (number.dataset.value === toCell.number.dataset.value) {
			// target cell has same number
			// merge both cell

			number.style.top = `${toCell.top}px`;
			number.style.left = `${toCell.left}px`;
			number.style.transform = "scale(0,0)";
			number.style.webkitTransform = "scale(0, 0)";

			// remove number DOM element after transition
			setTimeout(function () {
				matrix.gridElement.removeChild(number);
			}, 200);

			// double target cell's number
			const newNumberValue = toCell.number.dataset.value * 2;
			toCell.number.dataset.value = newNumberValue;

			toCell.number.innerHTML = "";

			const newImage = document.createElement("img");
			newImage.src = numToImageSrc[newNumberValue];
			toCell.number.appendChild(newImage);

			fromCell.number = null;

			// setting score

			this.score += newNumberValue;

			if (this.score >= this.highScore) {
				this.highScore = this.score;
				highScoreElement.innerText = this.highScore;
				localStorage.setItem("2048highScore", this.highScore);
			}

			scoreElement.innerText = this.score;

			if (newNumberValue === 2048) {
				matrix.gameOver = true;
				matrix.canPlay = false;

				const gameOver = document.getElementById("gameOver");
				const h1 = gameOver.querySelector("h1");
				const scoreNumber = gameOver.querySelector(".scoreNumber");

				scoreNumber.innerText = this.score;
				h1.innerText = "Game Over! You Win!";
				gameOver.style.display = "flex";
				gameOver.style.zIndex = 10;

				document
					.querySelector(".outerGrid")
					.removeEventListener("touchstart", handleTouchStart, false);

				document
					.querySelector(".outerGrid")
					.removeEventListener("touchmove", handleTouchMove, false);
			}
		}
	}
}

const tile = new Tile();
// module.exports = tile;
