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
        getRegionName(regionId: String!): String
	}
	extend type Mutation {
        addRegion(region: RegionInput!, isMap: Boolean!): String
        deleteMap(map_id: String!): Boolean
        editRegionField(region_id: String!, field: String!, value: String!): Boolean
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