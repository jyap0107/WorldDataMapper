import React from 'react';

import { WMFooter, WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteLandmarkModal = (props) => {
    const handleClick = () => {
        props.removeLandmark();
        props.handleShowDelete();
    }
    return (
        <WModal className="delete-map-modal" visible={props.showDelete} animation="slide-fade-top" cover={true}>
            <WMHeader className="delete-map-header">
                Delete Landmark?
            </WMHeader>

            <WMFooter className="delete-map-footer">
                <WButton className="button-type-delete" onClick={handleClick} clickAnimation="ripple-dark">
                    Confirm
                </WButton>
                <WButton className="button-type-delete" onClick={() => props.setShowDelete(false)} clickAnimation="ripple-dark">
                    Cancel
                </WButton>
            </WMFooter>
        </WModal>
    );
}

export default DeleteLandmarkModal;