const { model, Schema, ObjectId } = require('mongoose');
const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		userID: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		parentRegion: {
			type: String
		},
		capital: {
			type: String,
		},
		leader: {
			type: String,
		},
		numSubregions: {
			type: Number,
			required: true
		},
		landmarks: {
			type: [String]
		},
		flag: {
			type: String,
		},
		index: {
			type: Number,
		},
		subregions: {
			type: [String],
		}
	},
	{ timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;