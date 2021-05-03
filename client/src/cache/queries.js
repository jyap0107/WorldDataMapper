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
export const GET_REGION_NAME = gql`
	query GetRegionName($regionId: String!) {
		getRegionName(regionId: $regionId)
	}
`;
