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

// const findOtherSubregionsFromMaps = async (maps, baseArray, baseRegion) => {
//     let temp = await Region.findOne({_id: baseRegion});
//     const parent = temp.parentRegion;
//     // Look through all maps
//     for (let i = 0; i < maps.length; i++) {
//         // Look through each maps' subregions
//         for (let j = 0; j < maps[i].subregions.length; i++) {
//             const subregion = maps[i].subregions[j];
//             // If the subregion ID doesnt match parent or baseRegion, then we can find it and add it.
//             // Then also use that region to search further.
//             if (subregion != baseRegion && subregion != parent) {
//                 const region = await Region.findOne({_id: subregion});
//                 baseArray.push(region);
//                 await findOtherSubregionsFromRegion(region, baseArray, baseRegion, parent);
//             }
//         }
//     }
//     return baseArray;
// }
const findOtherSubregions = async (rootRegion, baseArray, baseRegion, parent) => {
    await findOtherSubregionsHelper(rootRegion, baseArray, baseRegion, parent);
    return baseArray;
}
const findOtherSubregionsHelper = async (rootRegion, baseArray, baseRegion, parentRegion) => {
    const root = rootRegion.toString();
    const parent = parentRegion.toString();
    const base = baseRegion.toString();
    if (root != base && root != parent) {
        baseArray.push(rootRegion);
        for (let i = 0; i < rootRegion.subregions.length; i++) {
            const region = await Region.findOne({_id: rootRegion.subregions[i]});
            await findOtherSubregionsHelper(region, baseArray, baseRegion, parentRegion);
        }
    }

}

module.exports = {searchIds, findOtherSubregions};