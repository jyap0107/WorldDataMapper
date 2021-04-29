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
			parentRegion {
				_id
			}
			capital
			leader
			numSubregions
			landmarks
		}
	}
`;
