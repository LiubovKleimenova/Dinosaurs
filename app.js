const form = document.getElementById("dino-compare");
const grid = document.getElementById("grid");
const backBtn = document.getElementById("back-btn");
const WEIGHT_COEFFICIENT = 0.453592;
const HEIGHT_COEFFICIENT = 0.3048;

class Being {
	constructor(species, diet, height, weight) {
		this.species = species;
		this.diet = diet.toLowerCase();
		this.height = height;
		this.weight = weight;
	}
}

class Dino extends Being {
	constructor(species, diet, height, weight, fact, when, where) {
		super(
			species,
			diet,
			height * HEIGHT_COEFFICIENT,
			weight * WEIGHT_COEFFICIENT
		);
		this.fact = fact;
		this.when = when;
		this.where = where;
	}
}

class Human extends Being {
	constructor(name, diet, height, weight) {
		super("human", diet, height, weight);
		this.name = name;
	}
}

Dino.prototype.compareWeight = function compareWeight(human) {
	ratio = (this.weight / human.weight).toFixed(1);
	if (ratio > 1) {
		return `${this.species} is ${ratio} times heavier than ${human.name}`;
	} else if (ratio < 1) {
		return `${this.species} is ${1 / ratio} times heavier than ${human.name}`;
	} else {
		return `${this.species} and ${human.name} are the same height`;
	}
};

Dino.prototype.compareHeight = function compareHeight(human) {
	ratio = (this.height / human.height).toFixed(1);
	if (ratio > 1) {
		return `${this.species} is ${ratio} times taller than ${human.name}`;
	} else if (ratio < 1) {
		return `${this.species} is ${1 / ratio} times smaller than ${human.name}`;
	} else {
		return `${this.species} and ${human.name} are of the same weight`;
	}
};

Dino.prototype.compareDiet = function compareDiet(human) {
	return this.diet === human.diet
		? `${this.species} is ${this.diet} just like ${human.name}`
		: `${this.species} is ${this.diet} unlike ${human.name}`;
};

Dino.prototype.getRandomFact = function getRandomFact(human) {
	let facts = [
		`${this.species} lived in ${this.where}`,
		`${this.species} lived during ${this.when} Period`,
		this.fact,
		this.compareDiet(human),
		this.compareHeight(human),
		this.compareWeight(human),
	];
	return facts[Math.round(Math.random() * (facts.length - 1))];
};

async function getDinosData() {
	const data = await fetch("/dino.json");
	const dinoData = await data.json();
	return dinoData.Dinos;
}

function toggleScreen() {
	form.classList.toggle("hide");
	grid.classList.toggle("hide");
	backBtn.classList.toggle("hide");
}

function generateTile(animal, human) {
	let tile = document.createElement("div");
	let name = document.createElement("h3");
	let image = document.createElement("img");
	let fact = document.createElement("p");

	name.innerHTML = animal instanceof Dino ? animal.species : animal.name;
	fact.innerHTML =
		animal instanceof Dino && animal.species !== "Pigeon"
			? animal.getRandomFact(human)
			: animal.fact;
	image.setAttribute("src", `/images/${animal.species}.png`);
	image.setAttribute("alt", animal.species);

	tile.classList.add("grid-item");
	tile.appendChild(name);
	tile.appendChild(image);
	if (animal instanceof Dino) {
		tile.appendChild(fact);
	}
	grid.appendChild(tile);
}

form.addEventListener("submit", function (e) {
	e.preventDefault();

	// use IIFE to make human data ptivate
	let humanData = (function () {
		let name = document.getElementById("name").value;
		let diet = document.getElementById("diet").value;
		let weight = Number(document.getElementById("weight").value);
		let height =
			Number(document.getElementById("meters").value) +
			0.01 * Number(document.getElementById("cm").value);

		return {
			name: name,
			diet: diet,
			weight: weight,
			height: height,
		};
	})();

	let human = new Human(
		humanData.name,
		humanData.diet,
		humanData.height,
		humanData.weight
	);

	getDinosData().then((res) => {
		let dinos = res.map(
			(dino) =>
				new Dino(
					dino.species,
					dino.diet,
					dino.height,
					dino.weight,
					dino.fact,
					dino.when,
					dino.where
				)
		);

		dinos.forEach((dino) => generateTile(dino, human));
		generateTile(human, human);
	});

	toggleScreen();
});

backBtn.addEventListener("click", function () {
	toggleScreen();
	grid.innerHTML = "";
});
