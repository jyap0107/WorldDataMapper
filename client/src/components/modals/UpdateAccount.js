import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { Link }				from 'react-router-dom';

import { WLHeader, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';

const UpdateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);   

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		let allEmpty = true;
		for (let field in input) {
			if (input[field]) {
				allEmpty = false;
			}
		}
		if (allEmpty) {
			alert("Must fill out at least one field to update.");
			return;
		}
		console.log({...input});
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
				//changed from lastName and firstName to just name
			}

		};

	};
    const erasePassword = (e) => {
        e.defaultValue = "";
    }

	return (
        // Replace div with WModal

		<WCard className="signup-screen">
			<WLayout wLayout="header-footer">
				<WLHeader className="account-header">Update Account</WLHeader>
				<WLMain className="account-main">
			{
				loading ? <div />
					: 
					<div>
						<div className="modal-spacer">&nbsp;</div>
							<WInput 
							className="modal-input" onBlur={updateInput} name="name" labelAnimation="fixed-shrink" 
							barAnimation="solid" labelText="Name" wType="outlined" inputType="text"
                            placeHolder={props.user.name} 
						/>

						<div className="modal-spacer">&nbsp;</div>
						<WInput id="updateEmail"
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="fixed-shrink" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text"
                            placeHolder={props.user.email} 
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="fixed-shrink" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password"
                            placeHolder="********"
						/>
						<div className="modal-spacer">&nbsp;</div>
					</div>
			}
				</WLMain>
			<WMFooter className='account-footer'>
                <div className="account-buttons">
					<Link to="/maps">
						<WButton className="modal-button" onClick={handleUpdateAccount} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Update
						</WButton>
					</Link>
					<Link to="/maps">
						<WButton className="modal-button" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							cancel
						</WButton>
					</Link>
            	</div>
			</WMFooter>
			</WLayout>
		</WCard>
	);
}

export default UpdateAccount;