// const matrix = require("./matrix");
window.onload = function () {
	matrix.init();
};

let xDown = null;
let yDown = null;

function getTouches(evt) {
	return evt.touches;
}

function handleTouchStart(evt) {
	evt.preventDefault();
	const firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	let direction = null;
	evt.preventDefault();

	let xUp = evt.touches[0].clientX;
	let yUp = evt.touches[0].clientY;

	let xDiff = xDown - xUp;
	let yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		/*most significant*/
		if (xDiff > 0) {
			/* left swipe */
			direction = "LEFT";
		} else {
			/* right swipe */
			direction = "RIGHT";
		}
	} else {
		if (yDiff > 0) {
			/* up swipe */
			direction = "UP";
		} else {
			/* down swipe */
			direction = "DOWN";
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;

	if (direction !== null) {
		matrix.slide(direction);
	}

	return false;
}

document.addEventListener("keydown", function (e) {
	let direction = null;
	e.preventDefault();

	if (e.key === "ArrowUp") {
		direction = "UP";
	} else if (e.key === "ArrowRight") {
		direction = "RIGHT";
	} else if (e.key === "ArrowDown") {
		direction = "DOWN";
	} else if (e.key === "ArrowLeft") {
		direction = "LEFT";
	}

	if (direction !== null) {
		matrix.slide(direction);
	}

	return false;
});

document.getElementById("tryAgain").addEventListener("click", function () {
	window.location.reload();
});

document
	.querySelector(".outerGrid")
	.addEventListener("touchstart", handleTouchStart, false);

document
	.querySelector(".outerGrid")
	.addEventListener("touchmove", handleTouchMove, false);
