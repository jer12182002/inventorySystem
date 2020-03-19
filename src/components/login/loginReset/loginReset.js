import React from 'react';
import './loginReset.scss';
export default class loginReset extends React.Component {

	componentDidMount(){
		console.log("@@");
	}

	render() {
		return (
			<div class="loginReset-wrapper">
				<div class="header-section">
					<h1>Reset your account</h1>
				</div>
				<div class="main-section">
					<p>We can only reset your password only, if you want to reset your account. Please talk to your technical person</p>

					<form>
						<div class="block">
							<label>Account</label>
							<input id="resetAcc" name="resetAccount"/>
						</div>
						<div class="block">
							<label>New Password</label>
							<input id="resetPwd" name="resetPassword" type="password"/>
						</div>
						<div class="block">
							<label>New Password Again</label>
							<input id="resetPwdchk" name="resetPasswordChk" type="password"/>
						</div>
						<div class="block">
							<button class="btn btn-success" type="success">Submit</button>
							<button class="btn clear" type="clear">Clear</button>
						</div>
					</form>
					<div class="status-wrapper">
						<h1></h1>
					</div>

				</div>
			</div>
		);
	}
}
