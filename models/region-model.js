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
			type: this
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
		}
	},
	{ timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;