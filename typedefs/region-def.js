const { gql } = require('apollo-server');

const typeDefs = gql `
	type Region {
		_id: String!
        userID: String!
		name: String!
		parentRegion: String
        capital: String
        leader: String
        numSubregions: Int!
        landmarks: [String]
        index: Int
        flag: String
        subregions: [String]
	}
	extend type Query {
		getAllMaps: [Region]
        getSubregionsById(regionId: String!): [Region]
        getRegion(regionId: String!): Region
        getParent(region_id: String!): Region
        getLandmarks(region_id: String!): [String]!
        getPossibleParents(region_id: String!): [Region]
	}
	extend type Mutation {
        addRegion(region: RegionInput!, isMap: Boolean!, index: Int): String
        addRegions(parentRegion: String!, regions: [RegionInput]!, index: Int): String
        deleteRegion(region_id: String!, isMap: Boolean): [Region]
        editRegionField(region_id: String!, field: String!, value: String!): Boolean
        recentMapOnTop(region_id: String!): Boolean
        sortCol(region_id: String!, field: String!, sortAsc: Boolean): [String]
        setOrder(region_id: String!, order: [String]!): Boolean
        addLandmark(region_id: String!, landmark: String!, index: Int): String
        deleteLandmark(region_id: String!, value: String!): String
        editLandmark(region_id: String!, prevValue: String!, newValue: String!): String
        changeParentRegion(region_id: String!, newParent: String!): Boolean
	}
    input RegionInput {
        _id: String
        userID: String
		name: String
		parentRegion: String
        capital: String
        leader: String
        numSubregions: Int
        landmarks: [String]
        index: Int
        flag: String
        subregions: [String]
    }

`;

module.exports = { typeDefs: typeDefs }