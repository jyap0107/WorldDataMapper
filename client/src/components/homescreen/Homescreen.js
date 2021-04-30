import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../screens/Login';
import Maps								from '../main/Maps';
import RegionSpreadsheet				from '../main/RegionSpreadsheet'
import DeleteMap						from '../modals/DeleteMap.js';
import CreateAccount 					from '../screens/CreateAccount';
import UpdateAccount					from '../screens/UpdateAccount';
import { GET_MAPS }						from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { BrowserRouter as Router, HashRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
	
const Homescreen = (props) => {

	
	const [showDeleteModal, setDeleteModal] = useState(false);
	const [currentRegion, setCurrentRegion] = useState("");

	//#region Hooks
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);

	// const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	// if(loading) { console.log(loading, 'loading'); }
	// if(error) { console.log(error, 'error'); }
	// if(data) { todolists = data.getAllTodos; }
	//#endregion

	const auth = props.user === null ? false : true;

	let maps = [];
	const { loading, error, data, refetch } = useQuery(GET_MAPS);
	if (loading) { console.log(loading, 'loading');}
	if (error) { console.log(error, 'error');}
	if (data) { maps = data.getAllMaps;}
	
	let regionItem = maps.find(map => map._id == currentRegion);

	const setShowDeleteModal = () => {
		setDeleteModal(!showDeleteModal);
	}
	const handleSetCurrentRegion = (regionId) => {
		console.log(regionId);
		setCurrentRegion(regionId);
		console.log(currentRegion);
	}

	//#region old code
	// const refetchTodos = async (refetch) => {
	// 	const { loading, error, data } = await refetch();
	// 	if (data) {
	// 		todolists = data.getAllTodos;
	// 		if (activeList._id) {
	// 			let tempID = activeList._id;
	// 			let list = todolists.find(list => list._id === tempID);
	// 			setActiveList(list);
	// 		}
	// 	}
	// }

	// const tpsUndo = async () => {
	// 	const retVal = await props.tps.undoTransaction();
	// 	refetchTodos(refetch);
	// 	return retVal;
	// }

	// const tpsRedo = async () => {
	// 	const retVal = await props.tps.doTransaction();
	// 	refetchTodos(refetch);
	// 	return retVal;
	// }


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	// const addItem = async () => {
	// 	let list = activeList;
	// 	const items = list.items;
	// 	const lastID = items.length >= 1 ? items[items.length - 1].id + 1 : 0;
	// 	const newItem = {
	// 		_id: '',
	// 		id: lastID,
	// 		description: 'No Description',
	// 		due_date: 'No Date',
	// 		assigned_to: props.user._id,
	// 		completed: false
	// 	};
	// 	let opcode = 1;
	// 	let itemID = newItem._id;
	// 	let listID = activeList._id;
	// 	let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
	// 	props.tps.addTransaction(transaction);
	// 	tpsRedo();
	// };


	// const deleteItem = async (item, index) => {
	// 	let listID = activeList._id;
	// 	let itemID = item._id;
	// 	let opcode = 0;
	// 	let itemToDelete = {
	// 		_id: item._id,
	// 		id: item.id,
	// 		description: item.description,
	// 		due_date: item.due_date,
	// 		assigned_to: item.assigned_to,
	// 		completed: item.completed
	// 	}
	// 	let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
	// 	props.tps.addTransaction(transaction);
	// 	tpsRedo();
	// };

	// const editItem = async (itemID, field, value, prev) => {
	// 	let flag = 0;
	// 	if (field === 'completed') flag = 1;
	// 	let listID = activeList._id;
	// 	let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
	// 	props.tps.addTransaction(transaction);
	// 	tpsRedo();

	// };

	// const reorderItem = async (itemID, dir) => {
	// 	let listID = activeList._id;
	// 	let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
	// 	props.tps.addTransaction(transaction);
	// 	tpsRedo();

	// };

	// const createNewList = async () => {
	// 	const length = todolists.length
	// 	const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
	// 	let list = {
	// 		_id: '',
	// 		id: id,
	// 		name: 'Untitled',
	// 		owner: props.user._id,
	// 		items: [],
	// 	}
	// 	const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
	// 	await refetchTodos(refetch);
	// 	if(data) {
	// 		let _id = data.addTodolist;
	// 		handleSetActive(_id);
	// 	}
	// };

	// const deleteList = async (_id) => {
	// 	DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
	// 	refetch();
	// 	setActiveList({});
	// };

	// const updateListField = async (_id, field, value, prev) => {
	// 	let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
	// 	props.tps.addTransaction(transaction);
	// 	tpsRedo();

	// };

	// const handleSetActive = (id) => {
	// 	const todo = todolists.find(todo => todo.id === id || todo._id === id);
	// 	setActiveList(todo);
	// };

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	// const setShowLogin = () => {
	// 	toggleShowDelete(false);
	// 	toggleShowCreate(false);
	// 	toggleShowLogin(!showLogin);
	// };

	// const setShowCreate = () => {
	// 	toggleShowDelete(false);
	// 	toggleShowLogin(false);
	// 	toggleShowCreate(!showCreate);
	// };

	// const setShowDelete = () => {
	// 	toggleShowCreate(false);
	// 	toggleShowLogin(false);
	// 	toggleShowDelete(!showDelete)
	// }

	//#endregion
	return (
		<WLayout wLayout="header">
			<Router>
			<WLHeader>
				<WNavbar color="colored" className="navbar">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth}
							user={props.user} 
							setCurrentRegion={setCurrentRegion}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<WLMain className="screen">
				<div>
					<Switch>
						{!auth && <Route path="/login" render={
							() => <Login
								fetchUser={props.fetchUser}/>
								}
							/>}
						{!auth && <Route path="/createAccount" render={
							() => <CreateAccount
								fetchUser={props.fetchUser}
								user={props.user}/>
								}
							/>}
						{auth && <Route path="/updateAccount" render={
							() => <UpdateAccount
							fetchUser={props.fetchUser}
								user={props.user}/>}
							/>}
						{auth && <Route path="/maps" render= {
							() => <Maps
								fetchUser={props.fetchUser}
								user={props.user}
								maps={maps}
								refetchMaps={refetch}
								setShowDeleteModal={setShowDeleteModal}
								setCurrentRegion={setCurrentRegion}
								handleSetCurrentRegion={handleSetCurrentRegion}/>
								}
							/>}
						{auth && <Route path="/:currentRegion" render= {
							() => <RegionSpreadsheet
							fetchUser={props.fetchUser}
							user={props.user}
							maps={maps}
							setCurrentRegion={setCurrentRegion}
							/>}
						/>}
					</Switch>

				</div>


			</WLMain>
			</Router>
		</WLayout>
	);
};

export default Homescreen;
