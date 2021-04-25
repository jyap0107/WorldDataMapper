const { model, Schema, ObjectId } = require('mongoose');
const regionSchema = new Schema(
	{
		id: {
			type: ObjectId,
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
			required: true
		},
		leader: {
			type: String,
			required: true
		},
		numSubRegions: {
			type: Number,
			required: true
		},
		landmarks: {
			type: [String]
		},
		flag: {
			type: String,
			required: true
		}
		
	},
	{ timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;