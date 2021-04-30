import React from 'react';
import { Link } from 'react-router-dom';

const Logo = (props) => {
    return (
        <Link to="/maps" className='logo' onClick={props.handleSetCurrentRegion("")}>
            The World<br></br>
            Data Mapper

        </Link>
    );
};

export default Logo;