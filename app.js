const submitBtn = document.getElementById("btn");
const grid = document.getElementById("grid");
const form = document.getElementById("dino-compare");

let getDinosData = async () => {
	const data = await fetch("/dino.json");
	const dinoData = await data.json();
	return dinoData.Dinos;
};

// es6 syntax
// class Dino {
//     constructor(data) {
//         this.species = data.species;
//         this.diet = data.diet;
//         this.fact = data.fact;
//         this.height = data.height;
//         this.weight = data.height;
//         this.when = data.when;
//         this.where = data.where;
//     }
// }

//do some proto inheerit`nce herre
// function being(diet, height, weight) {
// 	this.diet = diet.toLowerCase();
// 	this.height = height;
// 	this.weight = weight;
// }

// Dino.prototype = Being
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
		super(species, diet, height * 0.3048, weight * 0.453592);
		this.fact = fact;
		this.when = when;
		this.where = where;
	}
}

class Human extends Being {
	constructor(name, diet, height, weight) {
		super('human', diet, height, weight);
        this.name = name;
	}
}

// function Dino(data) {
// 	this.species = data.species;
// 	this.diet = data.diet; //to ensure that both form data and dino data is the same register
// 	this.fact = data.fact;
// 	this.height = data.height * 0.3048; //feet top meters
// 	this.weight = data.weight * 0.453592; //lb to kg
// 	this.when = data.when;
// 	this.where = data.where;
// }

// function Human(name, diet, height, weight) {
// 	this.species = "human";
// 	this.name = name;
// 	this.diet = diet; //to ensure that both form data and dino data is the same register
// 	this.height = height;
// 	this.weight = weight;
// }

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
    console.log(Math.random() * (facts.length - 1));
	return facts[Math.round(Math.random() * (facts.length - 1))];
};

function getHumanData() {
	return {
		name: document.getElementById("name").value,
		diet: document.getElementById("diet").value,
		weight: Number(document.getElementById("weight").value),
		height:
			Number(document.getElementById("meters").value) +
			0.01 * Number(document.getElementById("cm").value),
	};
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
	console.log(human);
	console.log(humanBeing);

	getDinosData().then((res) => {
		let dinos = res.map(
			(dino) => new Dino(dino.species, dino.diet, dino.height, dino.weight, dino.fact, dino.when, dino.where)
		); // consider function factories ?s

		console.log(dinos[0].getRandomFact(human));
		return dinos;
	});
});

// Create Human Object



// Generate Tiles for each Dino in Array
// how to generate tiles:

// DONT Hardcode tiles
// 1. create array of 9 with human, pigeon and 7 random dinos? hor to order?
// 2. create an html layout with human tile in the center and spots for 8 dino tiles?

// Add tiles to DOM

// Remove form from screen

// On button click, prepare and display infographic

// Add a submit event listener to the dino-compare form. Try to console.log the dinos data when the form is submitted.
// On form submit: hide the form and show the grid (you can get their ids from the HTML code). 'display: none;' is a good CSS property to use here.
// On form submit: loop through the dinos list and create an instance of the constructor/class for each entry. It will be used to create the tiles later. Log that new list.
// On form submit: get the data from the form. There is a number of ways to do it, but every input has an id and makes it easier to use getElementById.
