import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {useQuery} from '@apollo/client';
import { GET_SIBLING_REGIONS }             from '../../cache/queries';

const SiblingNavigator = (props) => {

    const { data, error  } = useQuery(GET_SIBLING_REGIONS, {variables: {region_id: props.currentRegion}}, {fetchPolicy: 'network-only'})
    const history = useHistory();

    const [rerender, setRerender] = useState(false);

    if (data) {

        console.log("Rerender?");

        const siblings = data.getSiblingRegions;
        const indexOfRegion = siblings.indexOf(props.currentRegion);
        console.log(props.currentRegion);
        const leftClickRegion = indexOfRegion == 0 ? "" : siblings[indexOfRegion - 1];
        const rightClickRegion = indexOfRegion == siblings.length-1 ? "" : siblings[indexOfRegion + 1];

        const handleLeftRegion = () => {
            history.push(`/${leftClickRegion}/view`);
            setRerender(!rerender);
            props.setCurrentRegion(leftClickRegion);
        }
        const handleRightRegion = () => {
            history.push(`/${rightClickRegion}/view`);
            setRerender(!rerender);
            props.setCurrentRegion(rightClickRegion);
        }


        return (
            <div className='sibling-navigation'>
            {props.user ?
            <>
            {leftClickRegion ? <span class="material-icons" onClick={handleLeftRegion}>arrow_back_ios</span> : <span class="material-icons disabled-button">arrow_back_ios</span>}
            {rightClickRegion ? <span class="material-icons" onClick={handleRightRegion}>arrow_forward_ios</span> : <span class="material-icons disabled-button">arrow_forward_ios</span>}
            </> : <></>
        }
            </div>
        );
    }
    else {
        return(<></>)
    }
};

export default SiblingNavigator;