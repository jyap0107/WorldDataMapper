import React from 'react';

import { WMFooter, WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteMap = (props) => {
    const handleClick = (e) => {
        props.deleteMap();
        props.setShowDeleteModal();
    }
    return (
        <WModal className="delete-map-modal" visible={props.showDeleteModal} animation="slide-fade-top">
            <WMHeader className="delete-map-header">
                Delete Map?
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

export default DeleteMap;