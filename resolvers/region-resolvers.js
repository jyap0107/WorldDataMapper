const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
            console.log("ID?");
            console.log(_id);
			if(!_id) { 
                console.log("No Id");
                return([])
            }
			const maps = await Region.find({userID: _id, parentRegion: null});
            console.log(maps);
			if(maps) return (maps);
        }
    },
    Mutation: {
        addMap: async(_, args) => {
            const { map } = args;
            console.log(map);
            const objectId = new ObjectId();
            console.log(map);
            const { _id, userID, name, capital, leader, numSubregions, landmarks } = map;
            const newMap = new Region({
                _id: objectId,
                userID: userID,
                name: name,
                capital: capital,
                leader: leader,
                numSubregions: numSubregions,
                landmarks: landmarks
            });
            const updated = await newMap.save();
            if (updated) return objectId;
            else return ("Could not add Map...for some reason.");
        }

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