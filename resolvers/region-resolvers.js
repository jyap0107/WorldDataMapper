const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { 
                console.log("No Id");
                return([])
            }
			const maps = await Region.find({userID: _id, parentRegion: null});
			if(maps) return (maps);
        }
    },
    Mutation: {
        addMap: async(_, args) => {
            const { map } = args;
            console.log(map);
            const objectId = new ObjectId();
            console.log(map);
            const { _id, userID, name, capital, leader, numSubregions, landmarks, index } = map;
            const newMap = new Region({
                _id: objectId,
                userID: userID,
                name: name,
                capital: capital,
                leader: leader,
                numSubregions: numSubregions,
                landmarks: landmarks,
                index: index
            });
            const updated = await newMap.save();
            if (updated) return objectId;
            else return ("Could not add Map...for some reason.");
        },
        deleteMap: async(_, args) => {
            const { map_id } = args;
            const objectId = new ObjectId(map_id);
            const deleted = await Region.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
        },
        editRegionField: async(_, args) => {
            const { region_id, field, value } = args;
            console.log(region_id);
            console.log(field);
            console.log(value);
            const objectId = new ObjectId(region_id);
            const updated = await Region.updateOne({_id: objectId}, {[field]: value});
            if (updated) return true;
            else return false;
        }
        // 		updateTodolistField: async (_, args) => {
// 			const { field, value, _id } = args;
// 			const objectId = new ObjectId(_id);
// 			const updated = await Todolist.updateOne({_id: objectId}, {[field]: value});
// 			if(updated) return value;
// 			else return "";
// 		},

        // 		addTodolist: async (_, args) => {
// 			const { todolist } = args;
// 			const objectId = new ObjectId();
// 			const { id, name, owner, items } = todolist;
// 			const newList = new Todolist({
// 				_id: objectId,
// 				id: id,
// 				name: name,
// 				owner: owner,
// 				items: items
// 			});
// 			const updated = await newList.save();
// 			if(updated) return objectId;
// 			else return ('Could not add todolist');
// 		},
    }
}