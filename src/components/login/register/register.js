import React from 'react';
import './register.scss';

import $ from 'jquery';
export default class register extends React.Component {


	saveUserRecord(){
		var chk = '';
		let userInfo = {};
		chk += $.trim($('#login_username').val())? '' : "|Username is empty|"; 
		
		chk += $.trim($('#login_acc').val())? '' : " |Account is empty|"; 
		
		if(!($.trim($("#login_pwd").val()) && ($.trim($("#login_pwd").val()) === $.trim($("#re_login_pwd").val())))){
			chk += ' |Invalid Password|';
		}

		if(chk === '') {
			userInfo = {
				username: $.trim($("#login_username").val()),
				account: $.trim($("#login_acc").val().toLowerCase()),
				password: $.trim($("#re_login_pwd").val()),
				createdBy: this.props.accountInfo.USERNAME
			}

			// this.setState({userInfo : userInfo});
			
			$('.statusText').addClass('success-status');
			$('.statusText').removeClass('warning-status');
		}else {
			$('.statusText').text(chk);
			$('.statusText').removeClass('success-status');
			$('.statusText').addClass('warning-status');
		}

		console.log(userInfo);
		return {checkInput: chk, userInput: userInfo};
	}





	fetchData(userInfoInput) {
		fetch(`http://localhost:4000/login/account/register?newUserInfo=${JSON.stringify(userInfoInput)}`)
		.then(res => res.json())
		.then(data =>{
			console.log(data);
			$('.statusText').text('Account is successfully registered');
			$('.statusText').addClass('success-status');
			$('.statusText').removeClass('warning-status');
			
			if(data.code === 'ER_DUP_ENTRY'){
				$('.statusText').text('ERROR!! Account name has already been taken!');
				$('.statusText').removeClass('success-status');
				$('.statusText').addClass('warning-status');
			}
		})
	}

	createBtnClicked(e) {
		e.preventDefault();
		let dataPassedCheck = this.saveUserRecord();
		
		if(dataPassedCheck.checkInput === '') {
			this.fetchData(dataPassedCheck.userInput);
		}
 	}




	render() {
		return (
			<div className = "register-wrapper">
				{this.props.accountInfo.USERNAME? (
				<div className = "header-section">
					<h1>Register A New User</h1>
				</div>
				):null
				}

				{this.props.accountInfo.USERNAME? (
				<div className = "main-section">
					<form name="register" method="POST">
						<div className = "register-panel">
	
							<div className="block">
	    	    				<label id="label_username" className="block">Username</label>
	    	    				<input id="login_username" className="inputField" name="Username"/>
	        				</div>
	        				<div className="block">
	    	    				<label id="label_acc" className="block">Account (email/lowercase only)</label>
	    	    				<input id="login_acc" className="inputField" name="account"/>
	        				</div>
	        				<div className="block">
	    	    				<label id="label_pwd" className="block">Password</label>
	    	    				<input id="login_pwd" className="inputField" type="password" name="password"/>
	        				</div>
	        				<div className="block">
	    	    				<label id="label_pwd" className="block">Re-type Password</label>
	    	    				<input id="re_login_pwd" className="inputField" type="password" name="re_password"/>
	        				</div>

	    	   				<div className = "statusText-container block">
			        			<h3 className = "statusText success-status"></h3>
			        		</div>
	        				<div className="block">
	    	    				<button type="button" className="btn" onClick = {e => this.createBtnClicked(e)}>Create</button>
	    	   				</div>
        				</div>
        			</form>
				</div>
				):
				<h1>Only Manager and IT admin can view this page</h1>
			}
			</div>
		);
	}
}
