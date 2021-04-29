import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WLSide, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';

const Maps = (props) => {

    const [recentMap, setRecentMap] = useState({});
    
    
    const [AddMap] = useMutation(mutations.ADD_MAP);

    const createNewMap = async () => {
        let map = {
            _id: "",
            userID: props.user._id,
            name: "",
            capital: "",
            leader: "",
            numSubregions: 0,
            landmarks: "",
            flag: ""
        }
        console.log(map);
        const { data } = await AddMap({variables: {map: map}});
    }
    const printIt = () => {
        console.log("poop");
    }
    return (
        <div>
             <WCard className="maps-container" raised>
                <WLayout wLayout="header-lside" className="example-layout-labels">
                    <WLHeader className="maps-header">
                        <div className="maps-header-text">Your Maps</div></WLHeader>
                    <WLSide side="left" className="maps-list">Side<label>272 x h</label>
                        <WButton onClick = {createNewMap} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">AddMap</WButton>
                    </WLSide>
                    <WLMain className="maps-side">Main<label>w x h</label></WLMain>
                </WLayout>
            </WCard>
        </div>
    );
};

export default Maps;