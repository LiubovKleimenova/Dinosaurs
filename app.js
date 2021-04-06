const submitBtn = document.getElementById("btn");
const grid = document.getElementById("grid");
const form = document.getElementById('dino-compare');

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

function Dino(data) {
	this.species = data.species;
	this.diet = data.diet.toLowerCase(); //to ensure that both form data and dino data is the same register
	this.fact = data.fact;
	this.height = data.height * 0.3048; //feet top meters
	this.weight = data.weight * 0.453592; //lb to kg
	this.when = data.when;
	this.where = data.where;
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

getDinosData().then((res) => {
	let dinos = res.map((dino) => new Dino(dino)); // consider function factories ?
	//let dinos = res.map(dino => Object.create(dino));
	console.log(dinos[0].compareDiet({ name: "luba", diet: "herbavor" }));
	return dinos;
});

submitBtn.addEventListener('click', function() {
    
})

// Create Human Object

// Use IIFE to get human data from form (??)

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
