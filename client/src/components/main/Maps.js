import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import DeleteMap					from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';
import globe from '../../utils/globe.jpg';


const Maps = (props) => {

    const [recentMap, setRecentMap] = useState({});
    const [input, setInput] = useState("");
    const [target, setTarget] = useState({});
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [deleteMapId, setDeleteMapId] = useState("");
    
    const [AddRegion] = useMutation(mutations.ADD_REGION);
    const [DeleteMapMutation] = useMutation(mutations.DELETE_REGION);
    const [EditRegionField] = useMutation(mutations.EDIT_REGION_FIELD);

    useEffect(() => props.setCurrentRegion(""))

    const updateInput = async (event) => {
        const value = event.target.value;
        setTarget(event.target);
        await setInput(value);
    }

    const createNewMap = async () => {
        if (input == "") {
            alert("Please Enter a Map Name Before Creating A Map");
        }
        if (input != "") {
            const length = props.maps.length
            const index = length > 0 ? props.maps[length - 1].index + 1 : 0;
            let map = {
                _id: "",
                userID: props.user._id,
                name: input,
                parentRegion: null,
                capital: "",
                leader: "",
                numSubregions: 0,
                landmarks: [],
                flag: "",
                index: index,
                subregions: [],
            };

            const { data } = await AddRegion({variables: {region: map, isMap: true}});
            target.value = "";
            setInput("");
            await props.refetchMaps();
        }

    }
    const setShowDeleteModal = () => {
		setDeleteModal(!showDeleteModal);
	}
    const deleteMap = async () => {
        const { data } = await DeleteMapMutation({variables: {region_id: deleteMapId, isMap: true}});
        await props.refetchMaps();

    }
    const editField = async (regionId, field, name) => {
        const { data } = await EditRegionField({variables: {region_id: regionId, field: field, value: name}})
        await props.refetchMaps();
    }
    return (
        <div>
             <WCard className="maps-container" raised>
                <WLayout wLayout="header-content">
                    <WLHeader className="maps-header">
                        <div className="maps-header-text">Your Maps</div></WLHeader>
                    <WCContent className="maps-content">
                        <WCContent className="maps-list">
                            {
                                props.maps.map((entry) => (
                                    <MapEntry
                                        map={entry}
                                        key={entry._id}
                                        setShowDeleteModal={setShowDeleteModal}
                                        deleteMap={deleteMap}
                                        setDeleteMapId={setDeleteMapId}
                                        editField={editField}
                                        setCurrentRegion={props.setCurrentRegion}
                                        handleSetCurrentRegion={props.handleSetCurrentRegion}
                                        refetchMaps={props.refetchMaps}
                                    />
                                ))
                            }
                        </WCContent>
                        <WCContent className="maps-side">
                            <div className="map-image"><img src={globe} className="globe" alt="logo"/></div>
                            <WCFooter className="map-creation">
                                <WButton className="map-button" color="custom-color" size="medium" className = "map-create" onClick = {createNewMap} clickAnimation="ripple-light" hoverAnimation="darken">Add Map</WButton>
                                <div className="map-input-wrapper">
                                    <input className="map-input" defaultValue={input} placeHolder="Input Map Name" onBlur={updateInput}></input>
                                </div>
                            </WCFooter>
                        </WCContent>
                    </WCContent>
                </WLayout>
            </WCard>
			{
			showDeleteModal && (<DeleteMap showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} deleteMap={deleteMap}/>)
        }
        </div>
    );
};

export default Maps;