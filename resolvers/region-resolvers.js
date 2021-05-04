const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const { searchIds } = require('../utils/recursive-search');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
            const stringId = req.userId;
			if(!_id) { 
                console.log("No Id");
                return([])
            }
			const maps2 = await Region.find({userID: _id, parentRegion: null});
            const maps = await Region.aggregate([{ $match: {userID: stringId, parentRegion: null}},]).sort({index: 1});
			if(maps) return (maps);
        },
        getSubregionsById: async (_, args) => {
            const { regionId } = args;
            let subregionsIds = await Region.find({parentRegion: regionId});
            let subregions = [];
            for (let i = 0; i < subregionsIds.length; i++) {
                let region = await Region.findOne({_id: subregionsIds[i]});
                subregions.push(region);
            }
            return subregions;
        },
        getRegionName: async (_, args) => {
            const { regionId} = args;
            let subregion = await Region.findOne({_id: regionId});
            console.log("SUBREGION name");
            console.log(subregion);
            if (subregion) return subregion.name;
            else return "";
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
                let numSubregions2 = oldRegion.numSubregions + 1;
		        subregionsToUpdate.push(newSubregion._id);
                console.log(numSubregions2);
			    const updated2 = await Region.updateOne({_id: parentRegion}, { "$set": { subregions: subregionsToUpdate, numSubregions: numSubregions2 }});
                if (updated1 || updated2) return objectId;
                else return ("Could not add? Idk dababy");
            }
        },
        deleteMap: async(_, args) => {
            const { map_id } = args;
            const objectId = new ObjectId(map_id);
            const found = await Region.findOne({_id: objectId})
            // const deleted = await Region.deleteOne({_id: objectId});
            let everyId = await searchIds([], map_id);
            console.log(everyId);
            const deleted = await Region.deleteMany({_id: { $in: everyId}});
            if (deleted) return true;
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
        },
        recentMapOnTop: async(_, args, { req }) => {
            console.log("REDDIT MOMENT");
            const { region_id } = args;
            const userId = new ObjectId(req.userId);
            const regionId = new ObjectId(region_id);
            const maps = await Region.find({userID: userId, parentRegion: null});
            // After getting all the maps, find the recent map ID and set to 0.
            const topMap = await Region.find({_id: region_id});
            for (let i = 0; i < maps.length; i++) {
                if (maps[i]._id == region_id) {
                    maps[i]._id = 0;
                }
                else {
                    maps[i].index++;
                }
            }
            console.log(maps);
            const updateMaps = await Region.updateMany({userID: userId, parentRegion: null}, {$inc:{'index': 1}});
            const updateTopMap = await Region.updateOne({userID: userId, parentRegion: null, _id: regionId}, {$set:{'index': 0}});
            return true;
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
