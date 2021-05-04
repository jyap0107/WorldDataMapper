import React from 'react';
import { Link } from 'react-router-dom';

const Logo = (props) => {
    return (
        <div className='logo'>
        {props.user ? <Link to="/maps" className='logo-in' onClick={props.handleSetCurrentRegion("")}>
            The World<br></br>
            Data Mapper
        </Link> : <span>
            The World<br></br>
            Data Mapper
        </span>}
        </div>
    );
};

export default Logo;