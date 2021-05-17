import React, { useState, useEffect} from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom'
import { GET_REGION_PATH} from '../../cache/queries';
import {useQuery} from '@apollo/client';

const SubregionEntry = (props) => {

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    useEffect(() => {
        if (props.activeCol == 0 && props.activeRow == props.index) {
            toggleNameEdit(true);
            toggleCapitalEdit(false);
            toggleLeaderEdit(false);
        }
        if (props.activeCol == 1 && props.activeRow == props.index) {
            toggleNameEdit(false);
            toggleCapitalEdit(true);
            toggleLeaderEdit(false);
        }
        if (props.activeCol == 2 && props.activeRow == props.index) {
            toggleNameEdit(false);
            toggleCapitalEdit(false);
            toggleLeaderEdit(true);
        }
        if (props.activeCol == -1 || props.activeRow == -1) {
            toggleNameEdit(false);
            toggleCapitalEdit(false);
            toggleLeaderEdit(false);
        }
    })
    // const detectArrowKeys = async (event) =>  {
    //     if (event.key == "ArrowLeft") {
    //         if (props.activeCol > 0) {
    //             props.setActiveCol(props.activeCol-1);
    //             console.log("left");
    //         }
    //     }
    //     if (event.key == "ArrowRight" && props.activeRow > -1) {
    //         if (props.activeCol < 2) {
    //             props.setActiveCol(props.activeCol+1);
    //             console.log("right");
    //         }
    //     }
    // }
    // useEffect(() => {
    //     window.addEventListener("keydown", detectArrowKeys)
    //     return () => {
    //     window.removeEventListener("keydown", detectArrowKeys)
    // }}, [detectArrowKeys])
    const maxRow = props.maxRow;

    const detectArrowKeys = async (event) => {
        const activeRow = props.activeRow;
        const activeCol = props.activeCol
        if (activeRow == props.index) {
            if (event.key == "ArrowUp") {
                if (props.activeRow > 0) {
                    if (editingName) {
                        await handleNameEdit(event);
                    }
                    if (editingCapital) {
                        await handleCapitalEdit(event);
                    }
                    props.setActiveRow(activeRow-1);
                    props.setActiveCol(activeCol);
                    console.log("up")
                }
            }
            if (event.key == "ArrowDown") {
                if (props.activeRow < maxRow && props.activeRow > -1) {
                    console.log("Pressed Down");
                    if (editingName) {
                        console.log("down-name")
                        await handleNameEdit(event);
                    }
                    if (editingCapital) {
                        console.log("down-capital")
                        await handleCapitalEdit(event);
                    }
                    if (editingLeader) {
                        console.log("down-leader")
                        await handleLeaderEdit(event);
                    }
                    props.setActiveRow(activeRow+1);
                    props.setActiveCol(activeCol)
                }
            }
            if (event.key == "ArrowLeft") {
                if (props.activeCol > 0) {
                    if (editingCapital) {
                        await handleCapitalEdit(event);
                    }
                    if (editingLeader) {
                        await handleLeaderEdit(event);
                        console.log("leader");
                    }
                    props.setActiveCol(props.activeCol-1);
                    props.setActiveRow(activeRow)
                    console.log("left");
                }
            }
            if (event.key == "ArrowRight" && props.activeRow > -1) {
                if (props.activeCol < 2) {
                    if (editingName) {
                        await handleNameEdit(event);
                    }
                    if (editingCapital) {
                        await handleCapitalEdit(event);
                    }
                    props.setActiveCol(props.activeCol+1);
                    props.setActiveRow(activeRow)
                    console.log("right");
                }
            }
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", detectArrowKeys)
        return () => {
        window.removeEventListener("keydown", detectArrowKeys)
    }}, [detectArrowKeys])

    let history = useHistory();

    const subregion = props.subregion;
    const link = `/${subregion._id}/subregions`;

    const {data} = useQuery(GET_REGION_PATH, {variables: {region_id: subregion._id}})


    const handleNameEdit = async (e) => {
        console.log("name????")
        toggleNameEdit(false);
        props.setActiveCol(-1);
        props.setActiveRow(-1);
        const newName = e.target.value ? e.target.value : "No name";
        const prevName = subregion.name;
        if (newName != prevName) {
            props.editSubregionField(subregion._id, "name", prevName, newName)
        }
    }
    const handleCapitalEdit = async (e) => {
        console.log("capital???")
        toggleCapitalEdit(false);
        props.setActiveCol(-1);
        props.setActiveRow(-1);
        const newCapital = e.target.value ? e.target.value : "No Capital";
        const prevCapital = subregion.capital;
        if (newCapital != prevCapital) {
            props.editSubregionField(subregion._id, "capital", prevCapital, newCapital);
        }
    }
    const handleLeaderEdit = async (e) => {
        console.log("leader????")
        toggleLeaderEdit(false);
        props.setActiveCol(-1);
        props.setActiveRow(-1);
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
    const activateName = () => {
        toggleNameEdit(true);
        toggleCapitalEdit(false);
        toggleLeaderEdit(false);
        props.setActiveCol(0);
        props.setActiveRow(props.index);
    }
    const activateCapital = () => {
        toggleCapitalEdit(true);
        toggleLeaderEdit(false);
        toggleNameEdit(false);
        props.setActiveCol(1);
        props.setActiveRow(props.index);
    }
    const activateLeader = () => {
        toggleLeaderEdit(true);
        toggleNameEdit(false);
        toggleCapitalEdit(false);
        props.setActiveCol(2);
        props.setActiveRow(props.index);
    }

    let path;
    if (data) {
        path = data.getRegionPath.map((entry) => entry.name).join("/");
        path = "/" + path + "/" + subregion.name + " Flag.png";
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
                        <div onClick={activateName}>
                        <Link to={link} onClick={props.tps.clearAllTransactions} style={{ color: '#000', textDecoration: 'none'}} onClick={() => props.handleSetCurrentRegion(subregion._id)}><span>{subregion.name}</span></Link>
                        </div>
                    }
                </WCol>
                <WCol size="2" className="col capital-col">
                    {editingCapital ? 
                        <input className='spreadsheet-input' autoFocus={true} defaultValue={subregion.capital}
                        wType="outlined" barAnimation="solid" onBlur={handleCapitalEdit}></input> :
                        <div className="subregion-capital-text" onClick={activateCapital}>{subregion.capital}</div>
                    }
                </WCol>
                <WCol size="3" className="col leader-col">
                    {editingLeader ? 
                        <input className='spreadsheet-input' autoFocus={true} defaultValue={subregion.leader}
                        wType="outlined" barAnimation="solid" onBlur={handleLeaderEdit}></input> :
                        <div onClick={activateLeader}>{subregion.leader}</div>
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