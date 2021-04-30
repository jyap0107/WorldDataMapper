import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';


const MapEntry = (props) => {
    return(
        <div id={props.map._id} className="map-entry">{props.map.name}
            <span class="material-icons delete-map" onClick = {props.setDeleteModal(true)}>delete</span>
            <span class="material-icons edit-map-name">mode_edit</span>
        </div>
        
    );
}
export default MapEntry;