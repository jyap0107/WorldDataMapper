import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import LandmarkEntry from './LandmarkEntry';
import DeleteMap						from '../modals/DeleteMap.js';
import * as mutations 					from '../../cache/mutations';
import { GET_REGION, GET_SUBREGIONS_BY_ID, GET_LANDMARKS, GET_POSSIBLE_PARENTS, GET_PARENT }                   from '../../cache/queries';
import { WLHeader, WCContent, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';
import WCFooter from 'wt-frontend/build/components/wcard/WCFooter';
import { Link, useParams, useLocation } from 'react-router-dom';
import { AddLandmark_Transaction, DeleteLandmark_Transaction, EditLandmark_Transaction, ChangeParentRegion_Transaction} from '../../utils/jsTPS'

const RegionViewer = (props) => {

    const { currentRegion } = useParams();
    const { data: regionData, refetch } = useQuery( GET_REGION, {variables: {regionId: currentRegion}}, {fetchPolicy: "network-only"});
    const { data: subregions } = useQuery(GET_SUBREGIONS_BY_ID, {variables: {regionId: currentRegion}})
    const { data: landmarksData, refetch: refetchLandmarks} = useQuery(GET_LANDMARKS, {variables: {region_id: currentRegion}, fetchPolicy: 'network-only'});
    const { data: possibleParentsData, refetch: refetchParents} = useQuery(GET_POSSIBLE_PARENTS, {variables: {region_id: currentRegion}});
    const { data: parentData, refetch: refetchParent } = useQuery( GET_PARENT, {variables: {region_id: currentRegion}}, {fetchPolicy: "cache-and-network"});

    const [input, setInput] = useState("");
    const [target, setTarget] = useState({});
    const [canUndo, setUndo] = useState(false);
    const [canRedo, setRedo] = useState(false);
    const [editingParent, setEditingParent] = useState(false);
    const [parentName, setParentName] = useState("");
    
    const [editLandmark] = useMutation(mutations.EDIT_LANDMARK);
    const [deleteLandmark] = useMutation(mutations.DELETE_LANDMARK);
    const [addLandmark] = useMutation(mutations.ADD_LANDMARK)
    const [changeParentRegion] = useMutation(mutations.CHANGE_PARENT_REGION);


    console.log(useLocation());
    useEffect(() => props.setCurrentRegion(currentRegion))
    if (regionData && subregions && landmarksData && possibleParentsData && parentData) {;
        const region = regionData.getRegion;
        const landmarks = landmarksData.getLandmarks;
        const localLandmarks = region.landmarks;
        const numSubregions = subregions.getSubregionsById.length;
        const numLandmarks = landmarks.length
        const possibleParents = possibleParentsData.getPossibleParents;
        const parent = parentData.getParent;

        const updateInput = async (e) => {
            const value = e.target.value;
            setTarget(e.target);
            await setInput(value);
        }
        const toggleParentOptions = () => {
            setEditingParent(!editingParent);
            console.log("toggle");
        }

        const createLandmark = async () => {
            if (input == "") {
                alert("Please enter a landmark.");
            }
            else if (landmarks.includes(input)) {
                alert("You may not include duplicate landmarks. Please enter another landmark.")
            }
            else {
                const transaction = new AddLandmark_Transaction(currentRegion, input, addLandmark, deleteLandmark);
                props.tps.addTransaction(transaction);
                await redo();
            }
            target.value = "";
            setInput("");
            await refetchLandmarks();
            await refetch();

        }
        const editLandmarkName = async (prevValue, newValue) => {
            const transaction = new EditLandmark_Transaction(currentRegion, prevValue, newValue, editLandmark);
            props.tps.addTransaction(transaction);
            await redo();
        }
        const removeLandmark = async (region_id, value) => {
            let index = localLandmarks.indexOf(value);
            console.log(index);
            const transaction = new DeleteLandmark_Transaction(currentRegion, value, index, deleteLandmark, addLandmark);
            props.tps.addTransaction(transaction);
            await redo();
        }
        const handleParentChange = async (e) => {
            const value = e.target.value;
            console.log(value);
            // const { data: changedParent} = await changeParentRegion({variables: {region_id: currentRegion, newParent: value}});
            const transaction = new ChangeParentRegion_Transaction(currentRegion, parent._id, value, changeParentRegion);
            props.tps.addTransaction(transaction);
            await redo();
            setEditingParent(false);
            await refetchParent();
            
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
            await refetchLandmarks();
            await refetch();
            await refetchParent();
        }
        const redo = async () => {
            console.log("can?");
            await props.tps.doTransaction();
            setUndo(true);
            if (props.tps.hasTransactionToRedo()) {
                setRedo(true);
            }
            else {
                setRedo(false);
            }
            await refetchLandmarks();
            await refetch();
            await refetchParent();
        }
        const names = possibleParents.map((entry) => entry._id);
        const index = names.indexOf(parent.name);
        return(
            <div>
                <WCard className="viewer-container" raised>
                    <WLayout wLayout="header-content" className="viewer-content">
                        <WCContent className="viewer-info">
                            <div className="viewer-flag"></div>
                            <div className="viewer-details">
                                <div>
                                    {canUndo ? 
                                        <span class={"material-icons undo-viewer"} onClick={undo}>undo</span> :
                                        <span class={"material-icons undo-viewer disabled-button"}>undo</span>
                                    }
                                    {!canRedo ?
                                        <span class="material-icons redo-viewer disabled-button" >redo</span> :
                                        <span class="material-icons redo-viewer" onClick={redo}>redo</span> 
                                    }
                                </div>
                                <div className="detail region-name"> Region Name: {region.name}</div>
                                <div className="detail parent-region">
                                    <span> Parent Region: </span>
                                    {editingParent ? 
                                    (<select className="parent-select" autoFocus name={parentName} id={parentName} defaultValue={parent._id} onChange={handleParentChange} onBlur={toggleParentOptions}>
                                        {/* possibleParents has 5 items in it */}
                                        {possibleParents.map((item, index) => 
                                            (<option className="parent-option" key={index.name} value={item._id}>{item.name}</option>)
                                        )}
                                        <option>Napkin</option>
                                        <option>9</option>
                                    </select>) :
                                    <>
                                    <span>{parent.name}</span>
                                    <span class="material-icons edit-parent" onClick={toggleParentOptions}>mode_edit</span>
                                    </>
                                }
                                    
                                    
                                </div>
                                <div className="detail region-capital"> Region Capital: {region.capital ? region.capital : "No capital"} </div>
                                <div className="detail region Leader"> Region Leader: {region.leader ? region.leader : "No leader"}</div>
                                <div className="detail #-of-subregions"># of Subregions: {region.subregions.length}</div>
                            </div>
                        </WCContent>
                        <WCContent className="landmarks-container testing">
                            <div className="landmarks-header">
                                Region landmarks
                            </div>
                            <div className="landmarks-list">
                                {
                                    landmarks.map((entry) => (
                                        <LandmarkEntry
                                            landmark={entry}
                                            localLandmarks={localLandmarks}
                                            refetchLandmarks={refetchLandmarks}
                                            currentRegion={currentRegion}
                                            editLandmarkName={editLandmarkName}
                                            removeLandmark={removeLandmark}
                                        />
                                    ))
                                }
                            </div>
                            <WCFooter className="landmarks-creation">
                                <WButton className="map-button" onClick={createLandmark} color="custom-color" size="medium" className = "map-create" clickAnimation="ripple-light" hoverAnimation="darken">Add Landmark</WButton>
                                <div className="landmark-input-wrapper">
                                    <input className="landmark-input" placeHolder="Input Landmark Name" onBlur={updateInput}></input>
                                </div>
                            </WCFooter>
                        </WCContent>
                    </WLayout>
                </WCard>
                
            </div>
            
            
        )
    }
    else return(<></>);
}

export default RegionViewer