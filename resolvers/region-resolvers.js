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
        },
        getRegionsById: async (_, args) => {
            console.log("jfjadfnasdkfnasdkfnaksdfnka");
            const { regionIds } = args;
            let regions = [];
            for (let i = 0; i < regionIds.length; i++) {
                console.log(regionIds[i]);
                let region = await Region.findOne({_id: regionIds[i]});
                console.log(region);
                regions.push(region);
            }
            console.log(regions);
            return regions;
        }
    },
    Mutation: {
        addRegion: async(_, args) => {
            const { region, isMap } = args;
            const objectId = new ObjectId();
            const { _id, userID, name, parentRegion, capital, leader, numSubregions, landmarks, index, subregions } = region;
            console.log(subregions);
            if (isMap) {
                const newMap = new Region({
                    _id: objectId,
                    userID: userID,
                    name: name,
                    parentRegion: parentRegion,
                    capital: capital,
                    leader: leader,
                    numSubregions: numSubregions,
                    landmarks: landmarks,
                    index: index,
                    subregions: [],
                });
                const updated = await newMap.save();
                // If parentRegion info is added, then you also have to alter the subregions field of the parentRegion
                if (updated) return objectId;
                else return ("Could not add Map...for some reason.");
            }
            else {
                const newSubregion = new Region({
                    _id: objectId,
                    userID: userID,
                    name: name,
                    parentRegion: parentRegion,
                    capital: capital,
                    leader: leader,
                    numSubregions: numSubregions,
                    landmarks: landmarks,
                    index: index,
                    subregions: [],
                })
                const updated1 = await newSubregion.save();
                // Update old subregions

                const oldRegion = await Region.findOne({_id: parentRegion})
                if (!oldRegion) return "not found";
                let subregionsToUpdate = oldRegion.subregions;
		        subregionsToUpdate.push(newSubregion._id);
                console.log("SUB TO UPDATE");
                console.log(subregionsToUpdate);
			    const updated2 = await Region.updateOne({_id: parentRegion}, { subregions: subregionsToUpdate });
                if (updated1 || updated2) return objectId;
                else return ("Could not add? Idk dababy");
            }
        },
        deleteMap: async(_, args) => {
            const { map_id } = args;
            const objectId = new ObjectId(map_id);
            const found = await Region.findOne({_id: objectId})
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