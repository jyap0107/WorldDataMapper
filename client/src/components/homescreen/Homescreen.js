import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../screens/Login';
import Maps								from '../main/Maps';
import RegionSpreadsheet				from '../main/RegionSpreadsheet'
import CreateAccount 					from '../screens/CreateAccount';
import UpdateAccount					from '../screens/UpdateAccount';
import Breadcrumbs						from '../navbar/Breadcrumbs';
import SiblingNavigator					from '../navbar/SiblingNavigator';
import { GET_MAPS }						from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { BrowserRouter as Router, HashRouter, Switch, Route, Redirect, Link, useLocation } from 'react-router-dom';
import RegionViewer from '../main/RegionViewer';
import Welcome from '../main/Welcome';
	
const Homescreen = (props) => {

	
	const [showDeleteModal, setDeleteModal] = useState(false);
	const [currentRegion, setCurrentRegion] = useState("");
	const [regionItem, setRegionitem] = useState(null);
	const [isViewer, setIsViewer] = useState(false);
	const [currentParent, setCurrentParent] = useState("");

	const auth = props.user === null ? false : true;
	
	let maps = [];
	const { loading, error, data, refetch } = useQuery(GET_MAPS);
	if (loading) { console.log(loading, 'loading');}
	if (error) { console.log(error, 'error');}
	if (data) { maps = data.getAllMaps;}
	

	const setShowDeleteModal = () => {
		setDeleteModal(!showDeleteModal);
	}
	const handleSetCurrentRegion = (regionId) => {
		setCurrentRegion(regionId);
	}

	
	return (
		<WLayout wLayout="header">
			<Router>
			<WLHeader>
				<WNavbar color="colored" className="navbar">
					<ul>
						<WNavItem>
							<Logo user={props.user} setCurrentRegion={setCurrentRegion} />
						</WNavItem>
					</ul>
					{auth ?
					<ul>
						<WNavItem>
							<Breadcrumbs user={props.user} currentRegion={currentRegion} handleSetCurrentRegion={handleSetCurrentRegion}
							currentParent={currentParent}/>
						</WNavItem>
					</ul> : <></>}
					{isViewer && auth ? 
					<ul>
						<WNavItem>
							<SiblingNavigator user={props.user} currentRegion={currentRegion} setCurrentRegion={setCurrentRegion}
							currentParent={currentParent}/>
						</WNavItem>
					</ul> :
					<></>
					}
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
								fetchUser={props.fetchUser}
								refetch={refetch}/>
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
								handleSetCurrentRegion={handleSetCurrentRegion}
								key={props.user}
								setIsViewer={setIsViewer}/>
								
								}
							/>}
						{auth && <Route path="/:currentRegion/subregions" render= {
							() => <RegionSpreadsheet
							fetchUser={props.fetchUser}
							user={props.user}
							maps={maps}
							setCurrentRegion={setCurrentRegion}
							regionItem={regionItem}
							handleSetCurrentRegion={handleSetCurrentRegion}
							key={currentRegion}
							tps={props.tps}
							setIsViewer={setIsViewer}
							/>}
						/>}
						{auth && <Route path="/:currentRegion/view" render= {() => <RegionViewer
							fetchUser={props.fetchUser}
							user={props.user}
							maps={maps}
							key={currentRegion}
							tps={props.tps}
							setCurrentRegion={setCurrentRegion}
							setIsViewer={setIsViewer}
							setCurrentParent={setCurrentParent}
							/>}
						/>}
						<Route exact path="/"> {auth ? <Redirect to="/maps"></Redirect> : <Redirect to="/welcome"></Redirect>}</Route>
						<Route path="/welcome" render={() => <Welcome/>}></Route>
					</Switch>

				</div>


			</WLMain>
			</Router>
		</WLayout>
	);
};

export default Homescreen;
