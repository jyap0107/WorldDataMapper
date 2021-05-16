import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_REGION_PATH }						from '../../cache/queries';

const Breadcrumbs = (props) => {
    const {data} = useQuery(GET_REGION_PATH, {variables: {region_id: props.currentRegion}})

    
    if (data) {
        const path = data.getRegionPath;
        return (
            <div className='breadcrumbs'>
            {props.user ? 
                path.map((entry, index) => index != path.length-1 ? 
                <span className="breadcrumb"><Link to={`/${entry._id}/subregions`}>{entry.name}</Link>&gt;</span> :
                <span className="breadcrumb"><Link to={`/${entry._id}/subregions`}>{entry.name}</Link></span>
                                    ) : <></>
        }
            </div>
        );
    }
    else return (<></>)
};

export default Breadcrumbs;