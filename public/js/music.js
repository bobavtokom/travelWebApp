import mongoose from "mongoose";

import "../../models/DestinationModel";

function play() {
    document.getElementById("music").play();
    document.getElementById("play").style.display = "none";
    document.getElementById("pause").style.display = "block";
}

function pause() {
    document.getElementById("music").pause();
    document.getElementById("play").style.display = "block";
    document.getElementById("pause").style.display = "none";
}

function like (event) {
	let parentDiv = event.target.closest('div');
	let divId = parentDiv.id;
	let likeSpan = parentDiv.querySelector('span');
	let likespanvalue = parseInt(likeSpan.innerHTML);
	    likespanvalue += 1;
		likeSpan.innerHTML = likespanvalue;
		console.log(likespanvalue);
		worldTravel.likes = likespanvalue;
}