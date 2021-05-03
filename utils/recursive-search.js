const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

const searchIds = async (baseArray, rootID) => {
    await searchHelper(baseArray, rootID);
    return baseArray;
}
const searchHelper = async (baseArray, rootID) => {
    baseArray.push(rootID);
    const objectId = new ObjectId(rootID)
    const region = await Region.findOne({_id: objectId});
    const subregions = region.subregions;
    if (subregions) {
        for (let i = 0; i < subregions.length; i++) {
            await searchIds(baseArray, subregions[i]);
        }
    }
}

module.exports = {searchIds};