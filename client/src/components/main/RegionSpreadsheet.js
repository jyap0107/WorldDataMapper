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
import { GET_SUBREGIONS_BY_ID }             from '../../cache/queries';
import { GET_REGION_NAME }                  from '../../cache/queries';

const RegionSpreadsheet = (props) => {

    const [AddRegion] = useMutation(mutations.ADD_REGION);
    const { currentRegion } = useParams();
    const [getSubregions, {loading, data, refetch}] = useLazyQuery(GET_SUBREGIONS_BY_ID);
    const regionNameData = useQuery(GET_REGION_NAME, {variables: {regionId: currentRegion}});
    useEffect(() => {
            getSubregions({variables: {regionId: currentRegion}});
        }, [getSubregions, currentRegion])

    const regionViewer = `/:${currentRegion}/view`
    if (data && regionNameData) {
        const name = regionNameData.data.getRegionName;
        const subregions = data.getSubregionsById;
        const createNewSubregion = async () => {
            const length = subregions ? subregions.length : 0;
            const index = length > 1 ? subregions[length - 1].index + 1 : 0;
            let map = {
                _id: "",
                userID: props.user._id,
                name: "No name",
                parentRegion: currentRegion,
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
                            <Link className="region-link" to={regionViewer} style={{ color: '#205b9e'}}>{name}</Link></span>
                        </div>
                        <WCContent>
                            <WLayout wLayout="header-content">
                                <WLHeader className="regions-table-header">
                                    <WRow>
                                    <WCol size="2" className="col name-col">
                                        Name
                                    </WCol>
                                    <WCol size="2" className="col capital-col">
                                        Capital
                                    </WCol>
                                    <WCol size="3" className="col leader-col">
                                        Leader
                                    </WCol>
                                    <WCol size="1" className="col flag-col">
                                        Flag
                                    </WCol>
                                    <WCol size="4" className="col landmarks-col">
                                        Landmarks
                                    </WCol>
                                    </WRow>
                                </WLHeader>
                                <WCContent className="spreadsheet-content-container">
                                    { subregions.map((subregion) => <SubregionEntry 
                                    subregion={subregion} refetch={refetch}
                                    handleSetCurrentRegion={props.handleSetCurrentRegion}/>)}
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