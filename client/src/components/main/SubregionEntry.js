import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom'
import { GET_REGION_PATH} from '../../cache/queries';
import {useQuery} from '@apollo/client';

const SubregionEntry = (props) => {

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    let history = useHistory();

    const subregion = props.subregion;
    const link = `/${subregion._id}/subregions`;

    const {data} = useQuery(GET_REGION_PATH, {variables: {region_id: subregion._id}})

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : "No name";
        const prevName = subregion.name;
        if (newName != prevName) {
            props.editSubregionField(subregion._id, "name", prevName, newName)
        }
    }
    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : "No Capital";
        const prevCapital = subregion.capital;
        if (newCapital != prevCapital) {
            props.editSubregionField(subregion._id, "capital", prevCapital, newCapital);
        }
    }
    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : "No Leader";
        const prevLeader = subregion.leader;
        if (newLeader != prevLeader) {
            props.editSubregionField(subregion._id, "leader", prevLeader, newLeader);
        }
    }
    const handleDeleteSubregion = () => {
        props.handleShowDelete();
        props.setShowDelete(true);
        props.setSubregionToDelete(subregion);
    }
    console.log(data);
    let path;
    if (data) {
        path = data.getRegionPath.map((entry) => entry.name).join("/");
        path = "/" + path + "/" + subregion.name + " Flag.png";
        console.log(path);
    }
    const landmarkClick = () => {
        history.push(`/${subregion._id}/view`)
    }
    
    return(
        <div>
            <WRow className="spreadsheet-content">
                <span class="material-icons delete-subregion-button" onClick={handleDeleteSubregion}>delete</span>
                <WCol size="2" className="col name-col">
                    {editingName ?
                        <input className='spreadsheet-input' autoFocus={true} defaultValue={subregion.name}
                        wType="outlined" barAnimation="solid" onBlur={handleNameEdit}></input> :
                        <div onClick={() => toggleNameEdit(!editingName)}>
                        <Link to={link} onClick={props.tps.clearAllTransactions} style={{ color: '#000', textDecoration: 'none'}} onClick={() => props.handleSetCurrentRegion(subregion._id)}><span>{subregion.name}</span></Link>
                        </div>
                    }
                </WCol>
                <WCol size="2" className="col capital-col">
                    {editingCapital ? 
                        <input className='spreadsheet-input' autoFocus={true} defaultValue={subregion.capital}
                        wType="outlined" barAnimation="solid" onBlur={handleCapitalEdit}></input> :
                        <div className="subregion-capital-text" onClick={() => toggleCapitalEdit(!editingCapital)}>{subregion.capital}</div>
                    }
                </WCol>
                <WCol size="3" className="col leader-col">
                    {editingLeader ? 
                        <input className='spreadsheet-input' autoFocus={true} defaultValue={subregion.leader}
                        wType="outlined" barAnimation="solid" onBlur={handleLeaderEdit}></input> :
                        <div onClick={() => toggleLeaderEdit(!editingLeader)}>{subregion.leader}</div>
                    }
                </WCol>
                <WCol size="1" className="col flag-col">
                    {path ? 
                        <img className="spreadsheet-flag" src={path} alt="No flag"></img> : <span>No Flag</span>
                }
                </WCol>
                
                <WCol size="4" className="col landmarks-col spreadsheet-landmarks" onClick={landmarkClick}>
                    {subregion.landmarks.map((landmark, index) => index != subregion.landmarks.length-1 ? `${landmark}, ` : `${landmark}`)}
                </WCol>
                
        </WRow>
        </div>
    );
}
export default SubregionEntry;