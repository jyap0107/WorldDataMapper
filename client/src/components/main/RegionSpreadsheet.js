import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import DeleteMap						from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';
import { Link, useParams } from 'react-router-dom';

const RegionSpreadsheet = (props) => {
    const { currentRegion } = useParams();
    const region = props.maps.find(map => map._id == currentRegion);
    console.log(props.maps);

    const printValues = () => {
        console.log(region);
        console.log(props.maps);
    }
    return(
        <div>
            { region ? 
            <WCard className="region-spreadsheet-container">
                <WLayout wLayout="header-content">
                    <WLHeader className="regions-header">
                        <div className="regions-header-text">Region: 
                        <Link>{region.name}</Link></div>
                    </WLHeader>
                    <WCContent>
                        <WLayout wLayout="header-content">
                            <WLHeader className="maps-header">
                                <div className="maps-header-text" onClick={printValues}>Your Maps</div>
                            </WLHeader>
                            <WCContent>
                                <div>

                                </div>
                            </WCContent>
                        </WLayout>
                    </WCContent>
                </WLayout>
            </WCard> : <div></div>}
        </div>
        
    );
}

export default RegionSpreadsheet;