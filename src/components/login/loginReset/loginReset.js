import React from 'react';
import './loginReset.scss';

import $ from 'jquery';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class loginReset extends React.Component {

	constructor(props){
		super(props);


		this.state = {
			user:  cookies.get('user')
		}
	}



	clickChangePwd(e){
		e.preventDefault();
		
		let newUserInfo = {};

		if(($.trim($('#resetPwd').val()) === $.trim($('#resetPwdchk').val())) 
			&& $.trim($('#resetPwd').val())) {
			
			newUserInfo.id = this.state.user.ID;
			newUserInfo.newPassword = $.trim($('#resetPwd').val());

			fetch(`http://localhost:4000/login/account/resetpassword?newUserInfo=${JSON.stringify(newUserInfo)}`)
			.then(res => res.json())
			.then(data => {
			
				if(data.data === 'success') {
					$('.statusText').text('Your password had been successfully updated');
					$('.statusText').addClass('success-status');
					$('.statusText').removeClass('warning-status');
				}
				else {
					$('.statusText').text('Something went wrong. Please make sure your login session is not expried.');
					$('.statusText').addClass('warning-status');
					$('.statusText').removeClass('success-status');
				}
			});
			console.log(newUserInfo);
		}




	}




	render() {
		return (
			<div className="loginReset-wrapper">
				<div className="header-section">
					<h1>Reset your account</h1>
				</div>
				<div className="main-section">
					<p>#We can only reset your password only, if you want to reset your account. Please talk to your technical person#</p>

					<form>
						<div className="block">
							<label>Username</label>
							<label id="res_account">{this.state.user.USERNAME}</label>
						</div>
						<div className="block">
							<label>New Password</label>
							<input id="resetPwd" name="resetPassword" type="password"/>
						</div>
						<div className="block">
							<label>New Password Again</label>
							<input id="resetPwdchk" name="resetPasswordChk" type="password"/>
						</div>
						<div className="block">
							<button className="btn btn-success" type="success" onClick={(e)=>this.clickChangePwd(e)}>Submit</button>
							<button className="btn clear" type="clear">Clear</button>
						</div>
					</form>
					
					<div className = "statusText-container block">
        				<h3 className = "statusText success-status text-center"></h3>
        			</div>

				</div>
			</div>
		);
	}
}
