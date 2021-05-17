const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

const searchIds = async (baseArray, rootID, field) => {
    if (field == "subregions") {
        await subregionSearchHelper(baseArray, rootID);
    }
    if (field == "landmarks") {
        await landmarkSearchHelper(baseArray, rootID);
    }
    return baseArray;
}
const subregionSearchHelper = async (baseArray, rootID) => {
    baseArray.push(rootID);
    const objectId = new ObjectId(rootID)
    const region = await Region.findOne({_id: objectId});
    const subregions = region.subregions;
    if (subregions) {
        for (let i = 0; i < subregions.length; i++) {
            await subregionSearchHelper(baseArray, subregions[i]);
        }
    }
}

const landmarkSearchHelper = async (baseArray, rootID) => {
    const objectId = new ObjectId(rootID)
    const region = await Region.findOne({_id: objectId});
    const landmarks = region.landmarks;
    if (landmarks) {
        baseArray.push(...landmarks);
    }
    const subregions = region.subregions;
    if (subregions) {
        for (let i = 0; i < subregions.length; i++) {
            await landmarkSearchHelper(baseArray, subregions[i]);
        }
    }
}

const findOtherSubregions = async (rootRegion, baseArray, baseRegion, parent) => {
    await findOtherSubregionsHelper(rootRegion, baseArray, baseRegion, parent);
    return baseArray;
}
const findOtherSubregionsHelper = async (rootRegion, baseArray, baseRegion, parentRegion) => {
    const root = rootRegion.toString();
    const parent = parentRegion.toString();
    const base = baseRegion.toString();
    if (root != base) {
        baseArray.push(rootRegion);
        for (let i = 0; i < rootRegion.subregions.length; i++) {
            const region = await Region.findOne({_id: rootRegion.subregions[i]});
            await findOtherSubregionsHelper(region, baseArray, baseRegion, parentRegion);
        }
    }
}
const regionPath = async (rootRegion) => {
    let path = [];
    await regionPathHelper(rootRegion, path);
    return path;
}
const regionPathHelper = async (rootRegion, path) => {
    const objectId = new ObjectId(rootRegion);
    const region = await Region.findOne({_id: objectId});
    path.unshift(region);
    if (region.parentRegion != null) {
        await regionPathHelper(region.parentRegion, path);
    }
}
const findLandmarks = async (rootObject) => {
    let landmarkList = [];
    await findLandmarksHelper(rootObject, landmarkList);
    return landmarkList;
} 
const findLandmarksHelper = async (rootObject, landmarkList) => {
    if (rootObject.landmarks) {
        landmarkList.push(...rootObject.landmarks);
    }
    const subregions = rootObject.subregions;
    for (let i = 0; i < subregions.length; i++) {
        const objectId = new ObjectId(subregions[i]);
        const region = await Region.findOne({_id: objectId});
        console.log(region);
        await findLandmarksHelper(region, landmarkList);
    }
}
module.exports = {searchIds, findOtherSubregions, regionPath, findLandmarks};