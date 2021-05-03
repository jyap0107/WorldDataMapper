import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom'

const SubregionEntry = (props) => {

    let history = useHistory();
    const handleRegionClick = () => {
        history.push()
    }
    const link = `/${props.subregion._id}/subregions`;
    return(
        <div>
            <WRow className="spreadsheet-content">
                <WCol size="2" className="col name-col">
                    <Link to={link} onClick={() => props.handleSetCurrentRegion(props.subregion._id)}><span>{props.subregion.name}</span></Link>
                </WCol>
                <WCol size="2" className="col capital-col">
                    {props.subregion.capital}
                </WCol>
                <WCol size="3" className="col leader-col">
                    {props.subregion.leader}
                </WCol>
                <WCol size="1" className="col flag-col">
                    {props.subregion.flag}
                </WCol>
                <WCol size="4" className="col landmarks-col">
                    {props.subregion.landmarks}
                </WCol>
        </WRow>
        </div>
    );
}
export default SubregionEntry;