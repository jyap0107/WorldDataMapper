import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import DeleteMap						from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';

const Maps = (props) => {

    const [recentMap, setRecentMap] = useState({});
    const [input, setInput] = useState("");
    const [target, setTarget] = useState({});
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [deleteMapId, setDeleteMapId] = useState("");
    
    const [AddMap] = useMutation(mutations.ADD_MAP);
    const [DeleteMapMutation] = useMutation(mutations.DELETE_MAP);
    const [EditRegionField] = useMutation(mutations.EDIT_REGION_FIELD);

    const updateInput = async (event) => {
        const value = event.target.value;
        setTarget(event.target);
        await setInput(value);
    }

    const createNewMap = async () => {
        if (input != "") {
            const length = props.maps.length
            const index = length > 1 ? props.maps[length - 1].index + 1 : 0;
            console.log(input);
            let map = {
                _id: "",
                userID: props.user._id,
                name: input,
                capital: "",
                leader: "",
                numSubregions: 0,
                landmarks: "",
                flag: "",
                index: index,
            };
            const { data } = await AddMap({variables: {map: map}});
            target.value = "";
            setInput("");
            await props.refetchMaps();
        }

    }
    const setShowDeleteModal = () => {
		setDeleteModal(!showDeleteModal);
	}
    const deleteMap = async () => {
        console.log(deleteMapId);
        const { data } = await DeleteMapMutation({variables: {map_id: deleteMapId}});
        await props.refetchMaps();

    }
    const editField = async (regionId, field, name) => {
        console.log("YEAHHHHHHHHHHH");
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
                                    />
                                ))
                            }
                        </WCContent>
                        <WCContent className="maps-side">
                            <div className="map-image">IMAGE</div>
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