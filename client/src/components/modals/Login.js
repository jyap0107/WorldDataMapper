import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { Link } from 'react-router-dom';

import { WGrid, WCol, WLHeader, WLFooter, WLMain, WCard, WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout } from 'wt-frontend';
import WLSide from 'wt-frontend/build/components/wlayout/WLSide';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {
		console.log("Logging in!")

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			// props.refetchTodos();
			toggleLoading(false)
			// props.setShowLogin(false)
			console.log("NO error, logged in!");
		};
	};

	return (
        // Replace div with WModal

		<WCard className="login-screen">
			<WLayout wLayout="header-footer">
				<WLHeader className="account-header">Login to your Account</WLHeader>
				<WLMain className="account-main">
			{
				loading ? <div />
					: <div className="main-login-modal">

						<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text'/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</div>
			}
			</WLMain>
			<WMFooter className='account-footer'>
				<Link to="/maps">
					<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Login
					</WButton>
				</Link>
{/* 
				<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Login
				</WButton> */}

			</WMFooter>
			</WLayout>
		</WCard>
	// 	<WCard style={{height: "450px", width: "600px" }} raised>
    //     <WLayout wLayout="header-footer" className="example-layout-labels">
    //       <WLHeader style={{ backgroundColor: "salmon"}}>Header<label>w x 56</label></WLHeader>
    //       <WLMain style={{ backgroundColor: "ivory"}}>Main<label>w x h</label></WLMain>
    //       <WLFooter style={{ backgroundColor: "aquamarine"}}>Footer<label>w x h</label></WLFooter>
    //     </WLayout>
    //   </WCard>
		
		
		
	);
}

export default Login;