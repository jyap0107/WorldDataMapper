import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';

const Maps = (props) => {

    const [recentMap, setRecentMap] = useState({});
    const [input, setInput] = useState("");
    const [target, setTarget] = useState({});
    
    const [AddMap] = useMutation(mutations.ADD_MAP);

    const updateInput = async (event) => {
        const value = event.target.value;
        setTarget(event.target);
        await setInput(value);
    }

    const createNewMap = async () => {
        if (input != "") {
            console.log(input);
            let map = {
                _id: "",
                userID: props.user._id,
                name: input,
                capital: "",
                leader: "",
                numSubregions: 0,
                landmarks: "",
                flag: ""
            };
            const { data } = await AddMap({variables: {map: map}});
            target.value = "";
            setInput("");
            await props.refetchMaps();
        }

    }
    const printIt = () => {
        console.log(props.maps);
    }
    return (
        <div>
             <WCard className="maps-container" raised>
                <WLayout wLayout="header-content" className="example-layout-labels">
                    <WLHeader className="maps-header">
                        <div className="maps-header-text">Your Maps</div></WLHeader>
                    <WCContent className="maps-content">
                        <WCContent className="maps-list">
                            {
                                props.maps.map((entry) => (
                                    <MapEntry
                                        map={entry}
                                        key={entry._id}
                                        setDeleteModal={props.setDeleteModal}
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

        </div>
    );
};

export default Maps;