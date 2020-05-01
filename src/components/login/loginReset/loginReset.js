import React from 'react';
import './loginReset.scss';

import $ from 'jquery';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class loginReset extends React.Component {


	clickChangePwd(e){
		e.preventDefault();
		
		let newUserInfo = {};
		let inputCheck = false;

		inputCheck = $('#accountCheck').val() === this.props.accountInfo.ACCOUNT
					&& $('#pwdCheck').val() === this.props.accountInfo.PASSWORD
					&& $.trim($('#resetPwd').val()) === $.trim($('#resetPwdchk').val())
					&& $.trim($('#resetPwd').val());
	
		if(inputCheck) {
			console.log(newUserInfo);
			newUserInfo.id = this.props.accountInfo.ID
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
		}else {
			$('.statusText').text('Something went wrong. Please check if your input is valid.');
			$('.statusText').addClass('warning-status');
			$('.statusText').removeClass('success-status');
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
						<div className="block border-bottom">
							<h1>Username:</h1>
							<h3>{this.props.accountInfo.USERNAME}</h3>
						</div>
						<div className="block">
							<h1>Your Account</h1>
							<input id="accountCheck" type="text"></input>
						</div>
						<div className="block border-bottom">
							<h1>Your Password</h1>
							<input id="pwdCheck" type="password"></input>
						</div>
						<div className="block">
							<h1>New Password</h1>
							<input id="resetPwd" name="resetPassword" type="password"/>
						</div>
						<div className="block">
							<h1>New Password</h1>
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
