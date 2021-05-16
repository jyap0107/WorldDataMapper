import React, { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import MapEntry from './MapEntry';
import DeleteMap						from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WGrid, WRow, WCol, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';
import { Link, useParams} from 'react-router-dom';
import RegionViewer from './RegionViewer';
import SubregionEntry from './SubregionEntry';
import { GET_SUBREGIONS_BY_ID }             from '../../cache/queries';
import { GET_REGION }                  from '../../cache/queries';
import { AddSubregion_Transaction, DeleteSubregion_Transaction, EditSubregionField_Transaction, SortCol_Transaction } from '../../utils/jsTPS'

const RegionSpreadsheet = (props) => {

    const { currentRegion } = useParams();
    const [AddRegion] = useMutation(mutations.ADD_REGION);
    const [DeleteSubregion] = useMutation(mutations.DELETE_REGION);
    const [AddMultipleRegions] = useMutation(mutations.ADD_MULTIPLE_REGIONS);
    const [EditField] = useMutation(mutations.EDIT_REGION_FIELD);
    const [SortCol] = useMutation(mutations.SORT_COL);
    const [SetOrder] = useMutation(mutations.SET_SUBREGIONS_ORDER);

    const [canUndo, setUndo] = useState(false);
    const [canRedo, setRedo] = useState(false);
    const [nameAsc, setNameAsc] = useState(false);
    const [capitalAsc, setCapitalAsc] = useState(false);
    const [leaderAsc, setLeaderAsc] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRegionId, setDeleteRegionId] = useState("");


    const [getSubregions, {loading, data, refetch}] = useLazyQuery(GET_SUBREGIONS_BY_ID);
    const regionData = useQuery(GET_REGION, {variables: {regionId: currentRegion}});
    // const {loading, data, refetch} = useQuery(GET_SUBREGIONS_BY_ID, {variables: {regionId: currentRegion}}, {fetchPolicy: 'cache-and-network'});
    


    useEffect(() => {
            getSubregions({variables: {regionId: currentRegion}}, {fetchPolicy: 'cache-and-network'});
            props.setCurrentRegion(currentRegion);
        }, [getSubregions, currentRegion, props.setCurrentRegion])

    const regionViewer = `/${currentRegion}/view`
    if (data && regionData && regionData.data) {
        let tps = props.tps;
        let name = regionData.data.getRegion.name;
        let parent = regionData.data.getRegion.parentRegion;
        const subregions = data.getSubregionsById;
        const linkTo = {
            pathname: `/${currentRegion}/view`,
            subregions: {subregions}
        };
        const createNewSubregion = async () => {

            const length = subregions ? subregions.length : 0;
            const index = length > 0 ? subregions[length - 1].index + 1 : 0;
            console.log(index);
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
            let transaction = new AddSubregion_Transaction(map, index, false, AddRegion, DeleteSubregion);
            props.tps.addTransaction(transaction);
            await redo();
        }
        
        const deleteSubregion = async (_id, index) => {
            let transaction = new DeleteSubregion_Transaction(_id, index, DeleteSubregion, AddMultipleRegions);
            props.tps.addTransaction(transaction);
            await redo();
            await refetch();
        }
        const editSubregionField = async (_id, field, prevValue, newValue) => {
            let transaction = new EditSubregionField_Transaction(_id, field, prevValue, newValue, EditField);
            props.tps.addTransaction(transaction);
            await redo();
        }
        const sortName = () => {
            if (subregions.length > 0) {
                sortCol(nameAsc, "name");
                setNameAsc(!nameAsc);
            }
        }
        const sortCapital = () => {
            if (subregions.length > 0) {
                sortCol(capitalAsc, "capital");
                setCapitalAsc(!capitalAsc);
            }
        }
        const sortLeader = () => {
            if (subregions.length > 0) {
                sortCol(leaderAsc, "leader");
                setLeaderAsc(!leaderAsc);
            }
        }
        const sortCol = async (sortAsc, field) => {
            let transaction = new SortCol_Transaction(currentRegion, field, sortAsc, SortCol, SetOrder)
            props.tps.addTransaction(transaction);
            await redo();
            await refetch();
        }
        const undo = async () => {
            await props.tps.undoTransaction();
            setRedo(true);
            if (props.tps.hasTransactionToUndo()) {
                setUndo(true);
            }
            else {
                setUndo(false);
            }
            await refetch();
        }
        const redo = async () => {
            await props.tps.doTransaction();
            setUndo(true);
            if (props.tps.hasTransactionToRedo()) {
                setRedo(true);
            }
            else {
                setRedo(false);
            }
            await refetch();
        }
        console.log(subregions);
        return(
            <div>
                <WCard className="region-spreadsheet-container">
                    <WLayout wLayout="header-content">
                        <div className="regions-header">
                            <span class="material-icons add-subregion-button" onClick={createNewSubregion} >add_box</span>
                            {canUndo ? 
                                <span class={"material-icons undo-subregion-button"} onClick={undo}>undo</span> :
                                <span class={"material-icons undo-subregion-button disabled-button"}>undo</span>
                            }
                            {!canRedo ?
                                <span class="material-icons redo-subregion-button disabled-button" >redo</span> :
                                <span class="material-icons redo-subregion-button" onClick={redo}>redo</span>
                                
                            }
                            
                            <span className="regions-header-text">Region:&nbsp; 
                            { parent ? 
                            <Link className="region-link" to={{pathname: `/${currentRegion}/view`, state: {subregions: subregions}}} style={{ color: '#205b9e'}}>{name}</Link> :
                            <span className="region-link" style={{color:'#205b9e'}}>{name}</span>
                            }
                        </span>
                        </div>
                        <WCContent>
                            <WLayout wLayout="header-content">
                                <WLHeader className="regions-table-header">
                                    <WRow>
                                    <WCol size="2" className="col name-col header-col" onClick={sortName}>
                                        <span className="test">NAME</span>
                                    </WCol>
                                    <WCol size="2" className="col capital-col header-col" onClick={sortCapital}>
                                        <div className="testing123">CAPITAL</div>
                                    </WCol>
                                    <WCol size="3" className="col leader-col header-col" onClick={sortLeader}>
                                        LEADER
                                    </WCol>
                                    <WCol size="1" className="col flag-col" >
                                        FLAG
                                    </WCol>
                                    <WCol size="4" className="col landmarks-col">
                                        LANDMARKS
                                    </WCol>
                                    </WRow>
                                </WLHeader>
                                <WCContent className="spreadsheet-content-container">
                                    { subregions.map((subregion) => <SubregionEntry 
                                    subregion={subregion} refetch={refetch}
                                    handleSetCurrentRegion={props.handleSetCurrentRegion}
                                    deleteSubregion={deleteSubregion}
                                    editSubregionField={editSubregionField}
                                    tps={tps}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setDeleteRegionId={setDeleteRegionId}
                                    />)}
                                </WCContent>
                            </WLayout>
                        </WCContent>
                    </WLayout>
                </WCard>
                {
                    showDeleteModal && (<DeleteSubregion showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} deleteSubregion={deleteSubregion}/>)
                }
            </div>
            
        );
            }
            else {
                return <div></div>
            }
}

export default RegionSpreadsheet;