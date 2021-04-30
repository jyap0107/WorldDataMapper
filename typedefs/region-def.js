const { gql } = require('apollo-server');

const typeDefs = gql `
	type Region {
		_id: String!
        userID: String!
		name: String!
		parentRegion: Region
        capital: String
        leader: String
        numSubregions: Int!
        landmarks: [String]
        index: Int
        flag: String
	}
	extend type Query {
		getAllMaps: [Region]
	}
	extend type Mutation {
        addMap(map: RegionInput!): String
        deleteMap(map_id: String!): Boolean
        editRegionField(region_id: String!, field: String!, value: String!): Boolean
	}
    input RegionInput {
        _id: String
        userID: String
		name: String
		parentRegion: RegionInput
        capital: String
        leader: String
        numSubregions: Int
        landmarks: [String]
        index: Int
        flag: String
    }

`;

module.exports = { typeDefs: typeDefs }