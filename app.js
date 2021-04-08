const submitBtn = document.getElementById("btn");
const form = document.getElementById("dino-compare");
const grid = document.getElementById("grid");

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
		super(species, diet, height * 0.3048, weight * 0.453592); //coefficients are to turn lb to kg, feet to m
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
	ratio = this.weight / human.weight;
	if (ratio > 1) {
		return `${this.species} is ${ratio} times heavier than ${human.name}`;
	} else if (ratio < 1) {
		return `${this.species} is ${1 / ratio} times heavier than ${human.name}`;
	} else {
		return `${this.species} and ${human.name} are the same height`;
	}
};

Dino.prototype.compareHeight = function compareHeight(human) {
	ratio = this.height / human.height;
	if (ratio > 1) {
		return `${this.species} is ${ratio} times taller than ${human.name}`;
	} else if (ratio < 1) {
		return `${this.species} is ${1 / ratio} times smaller than ${human.name}`;
	} else {
		return `${this.species} and ${human.name} are of the same weight`;
	}
};

Dino.prototype.compareDiet = function compareDiet(human) {
	if (this.diet === human.diet) {
		return `${this.species} is ${this.diet} just like ${human.name}`;
	} else {
		return `${this.species} is ${this.diet} unlike ${human.name}`;
	}
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

function getHumanData() {
	//make IIFE instead
	return {
		name: document.getElementById("name").value,
		diet: document.getElementById("diet").value,
		weight: Number(document.getElementById("weight").value),
		height:
			Number(document.getElementById("meters").value) +
			0.01 * Number(document.getElementById("cm").value),
	};
}

function toggleScreen() {
	form.classList.add("hide");
	grid.classList.remove("hide");
}

function generateTile(animal, human) {
	let tile = document.createElement("div");
	let name = document.createElement("h3");
	let image = document.createElement("img");
	let fact = document.createElement("p");

	name.innerHTML = animal instanceof Dino ? animal.species : animal.name; // name for human, species for other
	fact.innerHTML =
		animal.species !== "Pigeon" ? animal.getRandomFact(human) : animal.fact; // random for dinos, single for pegion
	image.setAttribute("src", `/images/${animal.species}.png`);
	image.setAttribute("alt", animal.species);

	tile.classList.add("grid-item");
	tile.appendChild(name);
	tile.appendChild(image);
	if (animal instanceof Dino) {
		tile.appendChild(fact); // do nor append fact to human tile
	}
	grid.appendChild(tile);
}

form.addEventListener("submit", function (e) {
	// Use IIFE to get human data from form (??) why??
	e.preventDefault();
	let human = getHumanData();
	let humanBeing = new Human(
		human.name,
		human.diet,
		human.height,
		human.weight
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

		dinos.forEach((dino) => generateTile(dino, humanBeing));
		generateTile(humanBeing, humanBeing);
	});

	toggleScreen();
});
