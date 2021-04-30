import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import DeleteMap						from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WGrid, WRow, WCol, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';
import { Link, useParams } from 'react-router-dom';
import RegionViewer from './RegionViewer'

const RegionSpreadsheet = (props) => {
    const { currentRegion } = useParams();
    const regionViewer = `/:${currentRegion}/view`
    const region = props.maps.find(map => map._id == currentRegion);

    /*
    Have a field for getAllRegions that checks for getting parentRegion, if specified, return all with specific parentRegion
    */

    



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
                    <div className="regions-header">
                        <span class="material-icons add-subregion-button" >add_box</span>
                        <span className="regions-header-text">Region:&nbsp; 
                        <Link className="region-link" to={regionViewer} style={{ color: '#205b9e'}}>{region.name}</Link></span>
                    </div>
                    <WCContent>
                        <WLayout wLayout="header-content">
                            <WLHeader className="regions-table-header">
                                <WRow>
                                <WCol size="2" className="col name-col">
                                    APPLE
                                </WCol>
                                <WCol size="2" className="col capital-col">
                                    APPLE
                                </WCol>
                                <WCol size="3" className="col leader-col">
                                    APPLE
                                </WCol>
                                <WCol size="1" className="col flag-col">
                                    APPLE
                                </WCol>
                                <WCol size="4" className="col landmarks-col">
                                    APPLE
                                </WCol>
                                </WRow>
                            </WLHeader>
                            <WCContent>
                                
                            </WCContent>
                        </WLayout>
                    </WCContent>
                </WLayout>
            </WCard> : <div></div>}
        </div>
        
    );
}

export default RegionSpreadsheet;