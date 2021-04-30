import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const MapEntry = (props) => {

    const [editing, toggleEditing] = useState(false);

    const handleClick = (e) => {
        props.setShowDeleteModal();
        props.setDeleteMapId(props.map._id)
    }
    const handleEdit = (e) => {
        toggleEditing(false);
        props.editField(props.map._id, "name", e.target.value);
    }
    return(
        <div id={props.map._id} className="map-entry">
            { editing ? 
                <input className="map-name-input" defaultValue={props.map.name} onBlur={handleEdit} autoFocus={true}/> :
                <span className="map-name" onClick={() => toggleEditing(true)}>{props.map.name}</span>}
            <span class="material-icons delete-map" onClick = {handleClick}>delete</span>
            <span class="material-icons edit-map-name">mode_edit</span>
        </div>
        
    );
}
export default MapEntry;