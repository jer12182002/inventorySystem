import React from 'react';
import {Link} from 'react-router-dom';
import './account.scss';
import ActivityLogs from './activityLogs/activityLogs';
import UserViewPanel from './userViewPanel/userViewPanel';


export default class account extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			accountInfo: this.props.accountInfo,
		}
	}


	
	render() {
		return (
		<div className="account-wrapper">
			<div className="header-section">

				<h1>My Account: {this.state.accountInfo.USERNAME}</h1>
				<ul className="nav-bar">
					<li>
						<Link to={{
									pathname:"/login/account/resetpassword",
									state: {
										accountInfo: this.state.accountInfo
										}
								}}>Reset Password</Link>
					</li>
					
					{this.state.accountInfo.ACCESS_LEVEL < 3 ? 
					<li><Link to="/login/account/register">Add User</Link></li>
					: null
				}
				</ul>
			</div>
			<div className="main-section">
				<ActivityLogs accountInfo={this.state.accountInfo}/>
				<UserViewPanel accountInfo={this.state.accountInfo}/>
			</div>
		</div>
		);
	}
}
