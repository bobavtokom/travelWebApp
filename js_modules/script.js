const {LocalStorage} = require("node-localstorage");

var localStorage = new LocalStorage('./scratch'); 

const GetLikesByArticleId = id => {
	const storageKey = 'likes-' + id;
    console.log(storageKey+' '+localStorage.getItem(storageKey));
	return parseInt(localStorage.getItem(storageKey)) || 0;
}

const SetLikesByArticleId = (id, value) => {
	const storageKey = 'likes-' + id;
	localStorage.setItem(storageKey, value);
}

const GetDislikesByArticleId = id => {
	const storageKey = 'dislikes-' + id;
	return parseInt(localStorage.getItem(storageKey)) || 0;
}

const SetDislikesByArticleId = (id, value) => {
	const storageKey = 'dislikes-' + id;
	localStorage.setItem(storageKey, value);
}

module.exports.GetLikesByArticleId = GetLikesByArticleId;
module.exports.GetDislikesByArticleId = GetDislikesByArticleId;