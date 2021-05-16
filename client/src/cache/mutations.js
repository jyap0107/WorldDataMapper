import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
		}
	}
`;
export const UPDATE_ACCOUNT = gql`
	mutation UpdateAccount($email: String!, $password: String!, $name: String!) {
		updateAccount(email: $email, password: $password, name: $name) {
			email
			password
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_ITEM = gql`
	mutation AddItem($item: ItemInput!, $_id: String!, $index: Int!) {
	  	addItem(item: $item, _id: $_id, index: $index)
	}
`;

export const DELETE_ITEM = gql`
	mutation DeleteItem($itemId: String!, $_id: String!) {
		deleteItem(itemId: $itemId, _id: $_id) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const UPDATE_ITEM_FIELD = gql`
	mutation UpdateItemField($_id: String!, $itemId: String!, $field: String!, $value: String!, $flag: Int!) {
		updateItemField(_id: $_id, itemId: $itemId, field: $field, value: $value, flag: $flag) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const REORDER_ITEMS = gql`
	mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
		reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const ADD_TODOLIST = gql`
	mutation AddTodolist($todolist: TodoInput!) {
		addTodolist(todolist: $todolist) 
	}
`;

export const DELETE_TODOLIST = gql`
	mutation DeleteTodolist($_id: String!) {
		deleteTodolist(_id: $_id)
	}
`;

export const UPDATE_TODOLIST_FIELD = gql`
	mutation UpdateTodolistField($_id: String!, $field: String!, $value: String!) {
		updateTodolistField(_id: $_id, field: $field, value: $value)
	}
`;

export const ADD_REGION = gql`
	mutation addRegion($region: RegionInput!, $isMap: Boolean!, $index: Int) {
		addRegion(region: $region, isMap: $isMap, index: $index)
	}
`;
export const ADD_MULTIPLE_REGIONS = gql`
	mutation addRegions($parentRegion: String!$regions: [RegionInput]!) {
		addRegions(parentRegion: $parentRegion, regions: $regions)
	}
`
export const DELETE_REGION = gql`
	mutation DeleteRegion($region_id: String!, $isMap: Boolean) {
		deleteRegion(region_id: $region_id, isMap: $isMap) {
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
export const EDIT_REGION_FIELD = gql`
	mutation EditRegionField($region_id: String!, $field: String!, $value: String!) {
		editRegionField(region_id: $region_id, field: $field, value: $value)
	}
`;
export const RECENT_MAP_ON_TOP = gql`
	mutation RecentMapOnTop($region_id: String!) {
		recentMapOnTop(region_id: $region_id)
	}
`;
export const SORT_COL = gql`
	mutation SortCol($region_id: String!, $field: String!, $sortAsc: Boolean!) {
		sortCol(region_id: $region_id, field: $field, sortAsc: $sortAsc)
	}
`;
export const SET_SUBREGIONS_ORDER = gql`
	mutation SetOrder($region_id: String!, $order: [String]!) {
		setOrder(region_id: $region_id, order: $order)
	}
`;
export const ADD_LANDMARK = gql`
	mutation AddLandmark($region_id: String!, $landmark: String!, $index: Int) {
		addLandmark(region_id: $region_id, landmark: $landmark, index: $index)
	}
`;
export const DELETE_LANDMARK = gql`
	mutation DeleteLandmarks($region_id: String!, $value: String!) {
		deleteLandmark(region_id: $region_id, value: $value)
	}
`;
export const EDIT_LANDMARK = gql`
	mutation EditLandmarks($region_id: String!, $prevValue: String!, $newValue: String!) {
		editLandmark(region_id: $region_id, prevValue: $prevValue, newValue: $newValue)
	}
`;