import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { Link } from 'react-router-dom'

const SubregionEntry = (props) => {
    return(
        <div><WRow className="spreadsheet-content">
        <WCol size="2" className="col name-col">
            {props.subregion.name}
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