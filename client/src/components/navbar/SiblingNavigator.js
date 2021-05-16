import React from 'react';
import { Link } from 'react-router-dom';
import {useQuery} from '@apollo/client';
import { GET_SIBLING_REGIONS }             from '../../cache/queries';

const SiblingNavigator = (props) => {

    const { data, error  } = useQuery(GET_SIBLING_REGIONS, {variables: {region_id: props.currentRegion}})

    if (data) {

        const siblings = data.getSiblingRegions;
        const indexOfRegion = siblings.indexOf(props.currentRegion);
        const leftClickRegion = indexOfRegion == 0 ? "" : siblings[indexOfRegion - 1];
        const rightClickRegion = indexOfRegion == siblings.length-1 ? "" : siblings[indexOfRegion + 1];

        return (
            <div className='sibling-navigation'>
            {props.user ?
            <>
            <span class="material-icons">arrow_back_ios</span>
            <span class="material-icons">arrow_forward_ios</span>
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