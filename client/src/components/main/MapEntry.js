import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { Link } from 'react-router-dom'
import { useMutation} from '@apollo/client';
import { RECENT_MAP_ON_TOP }				from '../../cache/mutations';

const MapEntry = (props) => {

    const [editing, toggleEditing] = useState(false);
    const link = `/${props.map._id}/subregions`
    const [setRecentMap] = useMutation(RECENT_MAP_ON_TOP);

    const handleClick = (e) => {
        props.setShowDeleteModal();
        props.setDeleteMapId(props.map._id)
    }
    const handleEdit = (e) => {
        toggleEditing(false);
        props.editField(props.map._id, "name", e.target.value);
    }
    const handleClickingMap = async () => {
        props.handleSetCurrentRegion(props.map._id)
        await setRecentMap({variables: {region_id: props.map._id}})
        props.refetchMaps();

    }
    return(
        <div id={props.map._id} className="map-entry">
            { editing ? 
                <input className="map-name-input" defaultValue={props.map.name} onBlur={handleEdit} autoFocus={true}/> :
                <Link to={link} style={{ color: '#FFF' }}><span className="map-name" onClick={handleClickingMap}>{props.map.name}</span></Link>}
            <span class="material-icons delete-map" onClick = {handleClick}>delete</span>
            <span class="material-icons edit-map-name" onClick={() => toggleEditing(true)}>mode_edit</span>
        </div>
        
    );
}
export default MapEntry;