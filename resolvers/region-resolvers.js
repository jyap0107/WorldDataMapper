const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const { searchIds, findOtherSubregions, regionPath, findLandmarks} = require('../utils/recursive-search');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
            const stringId = req.userId;
			if(!_id) { 
                return([])
            }
			const maps2 = await Region.find({userID: _id, parentRegion: null});
            const maps = await Region.aggregate([{ $match: {userID: stringId, parentRegion: null}},]).sort({index: 1});
			if(maps) return (maps);
        },
        getSubregionsById: async (_, args) => {
            const { regionId } = args;
            const objectId = new ObjectId(regionId);
            const region = await Region.findOne({_id: regionId});
            const subregionsIds = region.subregions;
            let subregions = [];
            for (let i = 0; i < subregionsIds.length; i++) {
                let region = await Region.findOne({_id: subregionsIds[i]});
                subregions.push(region);
            }
            return subregions;
        },
        getRegion: async (_, args) => {
            const { regionId} = args;
            let subregion = await Region.findOne({_id: regionId});
            return subregion
        },
        getParent: async (_, args) => {
            const { region_id} = args;
            let subregion = await Region.findOne({_id: region_id});
            const parentId = subregion.parentRegion;
            const parentObjId = new ObjectId(parentId);
            const parent = Region.findOne({_id: parentObjId});
            return parent;
        },
        getLandmarks: async (_, args) => {
            const {region_id} = args;
            let landmarks = await searchIds([], region_id, "landmarks");
            return landmarks;
        },
        getPossibleParents: async (_, args, { req }) => {
            const {region_id} = args;
            const _id = new ObjectId(req.userId)
            const objectId = new ObjectId(region_id);
            const baseRegion = await Region.findOne({_id: objectId});
            const parent = baseRegion.parentRegion;
            const parentRegion = await Region.findOne({_id: parent});
            const maps = await Region.find({userID: _id, parentRegion: null})
            // Find all maps, then recursively search downward. If the ID matches objectID, stop the search of
            // that branch.
            let possibleParents = [];
            for (let i = 0; i < maps.length; i++) {
                let possibilities = await findOtherSubregions(maps[i], [], baseRegion, parentRegion);
                // console.log("Here is a possibility");
                // console.log(possibilities);
                possibleParents.push(...possibilities);
            }
            possibleParents.flat();
            // console.log("List of possible parents: ");
            // console.log(possibleParents);
            return possibleParents;
        },
        getSiblingRegions: async  (_, args) => {
            const {region_id} = args;
            const objectId = new ObjectId(region_id);
            const region = await Region.findOne({_id: objectId});
            const parent = await Region.findOne({_id: region.parentRegion});

            return parent.subregions;
        },
        getRegionPath: async (_, args) => {
            const {region_id} = args;
            const objectId = new ObjectId(region_id);
            const region = await Region.findOne({_id: objectId});
            if (region.parentRegion == null) {
                return [];
            }
            else {
                const path = await regionPath(region.parentRegion);
                return path;
            }
        },
        getAllLandmarks: async (_, __, {req}) => {
            const userId = new Object(req.userId);
            const maps = await Region.find({userID: userId, parentRegion: null});
            let landmarkList = [];
            for (let i = 0; i < maps.length; i++) {
                let landmarks = await findLandmarks(maps[i]);
                landmarkList.push(...landmarks);
            }
            console.log("yea");
            return landmarkList;

        }
    },
    Mutation: {
        addRegion: async(_, args) => {
            const { region, isMap } = args;
            const objectId = new ObjectId();
            const { _id, userID, name, parentRegion, capital, leader, numSubregions, landmarks, index, subregions } = region;
            // console.log(subregions);
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
                // console.log(numSubregions2);
			    const updated2 = await Region.updateOne({_id: parentRegion}, { "$set": { subregions: subregionsToUpdate, numSubregions: numSubregions2 }});
                if (updated1 || updated2) return objectId;
                else return ("Could not add? Idk dababy");
            }
        },
        addRegions: async(_, args) => {
            console.log("adding multiple");
            const { parentRegion, regions, index } = args;
            const inserted = await Region.insertMany(regions);
            const objectId = new ObjectId(parentRegion);
            const parentObj = await Region.findOne({_id: objectId})
            for (let i = 0; i < regions.length; i++) {
                if (regions[i].parentRegion == parentObj.parentRegion) {
                    const found = await Region.findOne({_id: parentObj.parentRegion})
                    let subregions = found.subregions;
                    subregions.splice(index, 0, regions[i]._id)
                    console.log(subregions);
                    const updated = await Region.updateOne({_id: parentObj.parentRegion}, { "$set" : { subregions: subregions}});
                }
            }
            const parent = await Region.updateOne({_id: objectId}, {$inc:{'numSubregions': 1}});
            return "yes";
        },
        deleteRegion: async(_, args) => {
            const { region_id, isMap } = args;
            const objectId = new ObjectId(region_id);
            const found = await Region.findOne({_id: objectId})

            // const deleted = await Region.deleteOne({_id: objectId});
            let everyId = await searchIds([], region_id, "subregions");
            // console.log(everyId);
            const deletedSubregions = await Region.find({_id: { $in: everyId}});
            const deleted = await Region.deleteMany({_id: { $in: everyId}});

            // Also have to delete it from parent, if exists.
            if (!isMap) {
                const parent = await Region.findOne({_id: found.parentRegion});
                let subregions = parent.subregions.filter(id => id != objectId);
                let numOfSubregions = parent.numSubregions - 1;
                const updated2 = await Region.updateOne({_id: found.parentRegion}, { "$set": { subregions: subregions, numSubregions: numOfSubregions}});
            }
            if (deleted) return deletedSubregions;
            else return [];
        },
        editRegionField: async(_, args) => {
            const { region_id, field, value } = args;
            const objectId = new ObjectId(region_id);
            const updated = await Region.updateOne({_id: objectId}, {[field]: value});
            if (updated) return true;
            else return false;
        },
        recentMapOnTop: async(_, args, { req }) => {
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
            const updateMaps = await Region.updateMany({userID: userId, parentRegion: null}, {$inc:{'index': 1}});
            const updateTopMap = await Region.updateOne({userID: userId, parentRegion: null, _id: regionId}, {$set:{'index': 0}});
            return true;
        },
        sortCol: async (_, args) => {
            const { region_id, field, sortAsc} = args;
            const regionId = new ObjectId(region_id);
            const region = await Region.findOne({_id: regionId});
            let subregionsIds = region.subregions;
            let subregions = [];
            for (let i = 0; i < subregionsIds.length; i++) {
                let subregion = await Region.findOne({_id: subregionsIds[i]});
                subregions.push(subregion);
            }
            if (field == "name") {
                if (sortAsc) {
                    subregions.sort((region1, region2) => {
                        let first = region1.name;
                        let second = region2.name;
                        return (first < second) ? -1 : (first > second) ? 1 : 0;
                    })
                }
                else {
                    subregions.sort((region1, region2) => {
                        let first = region1.name;
                        let second = region2.name;
                        return (first > second) ? -1 : (first < second) ? 1 : 0;
                    })
                }
            }
            if (field == "capital") {
                if (sortAsc) {
                    subregions.sort((region1, region2) => {
                        let first = region1.capital;
                        let second = region2.capital;
                        return (first < second) ? -1 : (first > second) ? 1 : 0;
                    })
                }
                else {
                    subregions.sort((region1, region2) => {
                        let first = region1.capital;
                        let second = region2.capital;
                        return (first > second) ? -1 : (first < second) ? 1 : 0;
                    })
                }
            }
            if (field == "leader") {
                if (sortAsc) {
                    subregions.sort((region1, region2) => {
                        let first = region1.leader;
                        let second = region2.leader;
                        return (first < second) ? -1 : (first > second) ? 1 : 0;
                    })
                }
                else {
                    subregions.sort((region1, region2) => {
                        let first = region1.leader;
                        let second = region2.leader;
                        return (first > second) ? -1 : (first < second) ? 1 : 0;
                    })
                }
            }
            const newSubregions = subregions.map((subregion) => subregion._id);
            const values = subregions.map((subregion) => subregion[field]);
            const updated = await Region.updateOne({_id: regionId}, { "$set" : {subregions: newSubregions}});
            return subregionsIds;

        },
        setOrder: async (_, args) => {
            const {region_id, order} = args;
            const objectId = new ObjectId(region_id);
            const updated = await Region.updateOne({_id: objectId}, { "$set" : {subregions: order}});
            return true;
        },
        addLandmark: async (_, args) => {
            const {region_id, landmark, index} = args;
            const objectId = new ObjectId(region_id);
            console.log(index);
            if (index == null) {
                const updated = await Region.updateOne({_id: objectId}, { $push: { landmarks: landmark}});
            }
            else {
                const found = await Region.findOne({_id: objectId});
                let landmarks = found.landmarks;
                console.log(landmarks);
                landmarks.splice(index, 0, landmark)
                console.log(landmarks);
                const updated = await Region.updateOne({_id: objectId}, {"$set" : {landmarks: landmarks}});
            }
            return landmark;
        },
        deleteLandmark: async (_, args) => {
            const {region_id, value} = args;
            const objectId = new ObjectId(region_id);
            const updated = await Region.updateOne({_id: objectId}, { $pull: { landmarks: value}});
            return "";

        },
        editLandmark: async (_, args) => {
            const {region_id, prevValue, newValue} = args;
            const objectId = new ObjectId(region_id);
            const updated = await Region.updateOne({_id: objectId, landmarks: prevValue }, { "$set" : { "landmarks.$" : newValue}})
        },
        changeParentRegion: async (_, args) => {
            const {region_id, newParent} = args;
            const objectId = new ObjectId(region_id);
            // Set region_id's parent to newParent
            const updated = await Region.updateOne({_id: objectId}, { "$set" : {parentRegion: newParent}});
            const region = await Region.findOne({_id: objectId});
            // Using region, get it,  then get its parentRegion, turn into objectId, find update it.
            const parent = region.parentRegion;
            const parentId = new ObjectId(parent);
            // Pull region_id as a subregion from its parent.
            const updated2 = await Region.updateOne({_id: parentId}, {$pull: { subregions: region_id}});
            // Lastly, find the newParent and add to its list of subregions
            const parentObjId = new ObjectId(newParent);
            const updated3 = await Region.updateOne({_id: parentObjId}, { $push: { subregions: region_id}})
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
