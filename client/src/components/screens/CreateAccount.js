import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { Link,useHistory }				from 'react-router-dom'

import { WLHeader, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';

const CreateAccount = (props) => {
	let history = useHistory();
	const [input, setInput] = useState({ email: '', password: '', name: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);
	const [isVisible, setVisible] = useState(true);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			console.log(field);
			if (!input[field]) {
				alert('All fields must be filled out to register');
				history.push("/createAccount");
				return;
			}
		}
		console.log({...input});
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			console.log(data.register);
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
				history.push("/createAccount")
			}
			else {
				history.push("/maps");
				props.fetchUser();
				//changed from lastName and firstName to just name
			}

		};
	};

	return (
        // Replace div with WModal

		<WCard className="signup-screen">
			<WLayout wLayout="header-footer">
				<WLHeader className="account-header">Sign Up</WLHeader>
				<WLMain className="account-main">
			{
				loading ? <div />
					: 
					<div>
						<div className="modal-spacer">&nbsp;</div>
							<WInput 
							className="modal-input" onBlur={updateInput} name="name" labelAnimation="up" 
							barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
						/>

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
						<div className="modal-spacer">&nbsp;</div>
					</div>
			}
				</WLMain>
			<WMFooter className='account-footer'>
			<div className="account-buttons">
				<WButton className="modal-button" onClick={handleCreateAccount} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Sign Up
				</WButton>
				<Link to="/">
					<WButton className="modal-button" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Cancel
					</WButton>
				</Link>
			</div>
			</WMFooter>
			</WLayout>
		</WCard>
	);
}

export default CreateAccount;