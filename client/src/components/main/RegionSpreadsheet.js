import React, { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import DeleteMap						from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WGrid, WRow, WCol, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';
import { Link, useParams } from 'react-router-dom';
import RegionViewer from './RegionViewer';
import SubregionEntry from './SubregionEntry';
import { GET_REGIONS_BY_ID }             from '../../cache/queries';

const RegionSpreadsheet = (props) => {

    const [AddRegion] = useMutation(mutations.ADD_REGION);
    const { currentRegion } = useParams();
    const [getSubregions, {loading, data, refetch}] = useLazyQuery(GET_REGIONS_BY_ID);
    const region = useMemo(() => { return props.maps.find(map => map._id == currentRegion) }, [props.maps, currentRegion]);
    useEffect(() => {
        if (region) {
            getSubregions({variables: {regionIds: region.subregions}}); }
        }, [getSubregions, region])

    // const getRegionsById = useQuery(GET_REGIONS_BY_ID, {variables: {regionIds: [currentRegion]}});
    // if (getRegionsById.data) {
    //     console.log(getRegionsById.data.getRegionsById);
    const regionViewer = `/:${currentRegion}/view`

    if (region && data) {
        const subregions = data.getRegionsById;
        console.log(subregions);
        const createNewSubregion = async () => {
            const length = subregions ? subregions.length : 0;
            const index = length > 1 ? subregions[length - 1].index + 1 : 0;
            let map = {
                _id: "",
                userID: props.user._id,
                name: "No name",
                parentRegion: region._id,
                capital: "No Capital",
                leader: "No Leader",
                numSubregions: 0,
                landmarks: [],
                flag: "",
                index: index,
                subregions: [],
            };
            const { data } = await AddRegion({variables: {region: map, isMap: false}});
            await refetch();
        }
        return(
            <div>
                <WCard className="region-spreadsheet-container">
                    <WLayout wLayout="header-content">
                        <div className="regions-header">
                            <span class="material-icons add-subregion-button" onClick={createNewSubregion} >add_box</span>
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
                                <WCContent className="spreadsheet-content-container">
                                    { subregions.map((subregion) => <SubregionEntry subregion={subregion} refetch={refetch}/>)}
                                </WCContent>
                            </WLayout>
                        </WCContent>
                    </WLayout>
                </WCard>
            </div>
            
        );
            }
            else {
                return <div></div>
            }
}

export default RegionSpreadsheet;