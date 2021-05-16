import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_TODOS = gql`
	query GetDBTodos {
		getAllTodos {
			_id
			id
			name
			owner
			items {
				_id
				id
				description
				due_date
				assigned_to
				completed
			}
		}
	}
`;
export const GET_MAPS = gql`
	query GetMaps {
		getAllMaps {
			_id
			userID
			name
			parentRegion
			capital
			leader
			numSubregions
			landmarks
			index
			subregions
		}
	}
`;
export const GET_SUBREGIONS_BY_ID = gql`
	query GetSubregionsById($regionId: String!) {
		getSubregionsById(regionId: $regionId) {
			_id
			userID
			name
			parentRegion
			capital
			leader
			numSubregions
			landmarks
			index
			subregions
		}
	}
`;
export const GET_REGION = gql`
	query GetRegion($regionId: String!) {
		getRegion(regionId: $regionId) {
			_id
			userID
			name
			parentRegion
			capital
			leader
			numSubregions
			landmarks
			index
			subregions
		}
	}
`;
export const GET_PARENT = gql`
	query GetParent($region_id: String!) {
		getParent(region_id: $region_id) {
			_id
			userID
			name
			parentRegion
			capital
			leader
			numSubregions
			landmarks
			index
			subregions
		}
	}
`;
export const GET_LANDMARKS = gql`
	query GetLandmarks($region_id: String!) {
		getLandmarks(region_id: $region_id)
	}
`;
export const GET_POSSIBLE_PARENTS = gql`
	query GetPossibleParents($region_id: String!) {
		getPossibleParents(region_id: $region_id) {
			_id
			userID
			name
			parentRegion
			capital
			leader
			numSubregions
			landmarks
			index
			subregions
		}
	}
`;
export const GET_SIBLING_REGIONS = gql`
	query GetSiblingRegions($region_id: String!) {
		getSiblingRegions(region_id: $region_id)
	}
`;
export const GET_REGION_PATH = gql`
	query GetRegionPath($region_id: String) {
		getRegionPath(region_id: $region_id) {
			_id
			userID
			name
			parentRegion
			capital
			leader
			numSubregions
			landmarks
			index
			subregions
		}
	}
`;
