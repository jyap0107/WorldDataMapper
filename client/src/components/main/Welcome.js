import React from 'react';
import { Link } from 'react-router-dom';
import globe from '../../utils/globe.jpg';

const Welcome = (props) => {
    return (
        <div className="welcome">
            <span className="welcome-text">WELCOME TO THE WORLD DATA MAPPER</span>
            <img src={globe} className="globe-welcome" alt="logo"/>
            
        </div>
    );
};

export default Welcome;