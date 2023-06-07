
const DestinationModel = require('../../models/destinationModel');

function LikeButtonMongoClick(articleId) {
	console.log(articleId);
	// const likes = await DestinationModel.find({ id: articleId });
	// console.log(likes);
}

module.exports.LikeButtonMongoClick = LikeButtonMongoClick;