import React from 'react';

import { WMFooter, WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteSubregion = (props) => {
    const handleClick = (e) => {
        props.deleteSubregion();
        props.setShowDeleteModal();
    }
    return (
        <WModal className="delete-map-modal" visible={props.showDeleteModal} animation="slide-fade-top" cover={true}>
            <WMHeader className="delete-map-header">
                Delete Subregion?
            </WMHeader>

            <WMFooter className="delete-map-footer">
                <WButton className="button-type-delete" onClick={handleClick} clickAnimation="ripple-dark">
                    Confirm
                </WButton>
                <WButton className="button-type-delete" onClick={props.setShowDeleteModal} clickAnimation="ripple-dark">
                    Cancel
                </WButton>
            </WMFooter>
        </WModal>
    );
}

export default DeleteSubregion;