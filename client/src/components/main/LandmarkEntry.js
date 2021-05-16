import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { Link } from 'react-router-dom'
import { useMutation} from '@apollo/client';
import * as mutations 					from '../../cache/mutations';

const LandmarkEntry = (props) => {

    const [editing, toggleEditing] = useState(false);
    const [deleteLandmark] = useMutation(mutations.DELETE_LANDMARK);
    const [input, toggleInput] = useState("");

    // const handleClick = (e) => {
    //     props.setShowDeleteModal();
    //     props.setDeleteMapId(props.map._id)
    // }
    // const handleEdit = (e) => {
    //     toggleEditing(false);
    //     props.editField(props.map._id, "name", e.target.value);
    // }
    // const handleClickingMap = async () => {
    //     props.handleSetCurrentRegion(props.map._id)
    //     await setRecentMap({variables: {region_id: props.map._id}})
    //     props.refetchMaps();
    const handleEdit = (e) => {
        toggleEditing(false);
        props.editLandmarkName(props.landmark, e.target.value);
    }
    const handleClickingLandmark = async () => {
        toggleEditing(true);
    }
    const handleDelete = async () => {
        await props.removeLandmark(props.currentRegion, props.landmark);
        await props.refetchLandmarks();
    }
    const isLocal = props.localLandmarks.includes(props.landmark);
    // }
    return(
        
        <div id={props.landmark} className="landmark-entry">
            { isLocal ? 
                editing ? 
                    <input className="map-name-input" defaultValue={props.landmark} onBlur={handleEdit} autoFocus={true}/> :
                    <>
                    <span className="landmark-local" onClick={handleClickingLandmark}>{props.landmark}</span>
                    <span className="material-icons delete-landmark" onClick={handleDelete}>delete</span>
                    <span className="material-icons edit-landmark" onClick={handleClickingLandmark}>mode_edit</span>
                    </>  :
                    <span className="landmark-child">{props.landmark}</span>
                }
                
            
        </div>
        
    );
}
export default LandmarkEntry;