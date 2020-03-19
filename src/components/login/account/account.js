import React from 'react';
import {Link} from 'react-router-dom';
import './account.scss';

import $ from 'jquery';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class account extends React.Component {


	state = {
		users : []
	}
	

	fetchAllUserInfo(){
		
		fetch("http://localhost:4000/login/account")
		.then(res => res.json())
		.then (data =>{
			this.setState({users : data.data});		
		});
	}



	componentDidMount(){
		let cookieUser = cookies.get('user');
		if(cookieUser.ACCESS_LEVEL < 3){
			this.fetchAllUserInfo();
		}
	}



	render() {

		return (
			<div className="account-wrapper">
			<div className="header-section">
				<h1>My Account: {this.props.accountInfo.USERNAME}</h1>
				<ul className="nav-bar">
					<li><a href="/login/account/resetpassword">Reset Password</a></li>
					
					{this.props.accountInfo.ACCESS_LEVEL < 3 ? 
					<li><a href="/login/account/register">Add User</a></li>
					: null
				}
				</ul>
			</div>
			<div className="main-section">
				<div className="block activityLog-container">
					<h1>Activity Log</h1>
				</div>
				{this.props.accountInfo.ACCESS_LEVEL < 3 ? 
					(
						<div className="block userView-container">
							<h1>User overview</h1>
							<div className="usersView-display">
								{this.state.users.length?( 
								<table className="block user-displayTable">
									<thead>
										<tr className="userRowHeader">
											<td>Username</td>
											<td>Access Level</td>
											<td>View Item</td>
											<td>Add Item</td>
											<td>Delete Item</td>
											<td>Name Modify</td>
											<td>View QTY</td>
											<td>Modify QTY</td>
											<td>View Type</td>
											<td>Modify Type</td>
											<td>View Gram</td>
											<td>Modify Gram</td>
											<td>View EXP</td>
											<td>Modify EXP</td>
											<td>View Tags</td>
											<td>Modify Tags</td>
											<td>Created By</td>
											<td>Action</td>
										</tr>
									</thead>
									<tbody>
										{this.state.users.map( (user,key) => (
											<tr key={`user-${key}`} className={`userRow user-${key}`}>
												<td><strong>{user.USERNAME}</strong></td>
												<td>{user.ACCESS_LEVEL < 3? 'Manager' : 'USER' }</td>
												<td>{user.VIEW_ITEM ?'YES':'NO'}</td>
												<td>{user.ADD_ITEM ?'YES':'NO'}</td>
												<td>{user.DELETE_ITEM ?'YES':'NO'}</td>
												<td>{user.NAME_MODIFY ?'YES':'NO'}</td>
												<td>{user.QTY_VIEW ?'YES':'NO'}</td>
												<td>{user.QTY_MODIFY ?'YES':'NO'}</td>
												<td>{user.TYPE_VIEW ?'YES':'NO'}</td>
												<td>{user.TYPE_MODIFY ?'YES':'NO'}</td>
												<td>{user.GRAM_VIEW ?'YES':'NO'}</td>
												<td>{user.GRAM_MODIFY ?'YES':'NO'}</td>
												<td>{user.EXP_VIEW ?'YES':'NO'}</td>
												<td>{user.EXP_MODIFY ?'YES':'NO'}</td>
												<td>{user.TAG_VIEW ?'YES':'NO'}</td>
												<td>{user.TAG_MODIFY ?'YES':'NO'}</td>
												<td>{user.CREATEDBY}</td>
												<td>
													<Link to = {{
														pathname: '/login/account/editUser',
														state: {
															isManager: true,
															targetUserID: user.ID
														}
													}}>Edit</Link>
													<Link to = "/login/account/editUser">aa</Link>
													
												</td>
											</tr>
											)								
										)}
									</tbody>
								</table>
								
								):null
								}

								
							</div>
						</div>
					)
				:
				null
				}
			</div>

			
			</div>
		);
	}
}
