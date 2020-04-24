import React from 'react';
import {Link} from 'react-router-dom';
import './account.scss';


import $ from 'jquery';


export default class account extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			accountInfo: this.props.accountInfo,
			users: []
		}


		if(this.props.accountInfo.ACCESS_LEVEL < 3) {
		 	this.fetchAllUserInfo();
		}	

	}


	fetchAllUserInfo(){
		fetch("http://localhost:3000/login/account")
		.then(res => res.json())
		.then (data =>{
			this.setState({users : data.data});		
		});
	}



	editClick(event,id){
		event.preventDefault();

		let updateUserInfo={}
		updateUserInfo.ID = id;
		updateUserInfo.ACCESS_LEVEL=$(`#access_level${id}`).prop("checked")? 2 : 3;
		updateUserInfo.VIEW_ITEM=$(`#view_item${id}`).prop("checked")? 1 : 0;
		updateUserInfo.ADD_ITEM=$(`#add_item${id}`).prop("checked")? 1 : 0;
		updateUserInfo.DELETE_ITEM=$(`#delete_item${id}`).prop("checked")? 1 : 0;
		updateUserInfo.NAME_MODIFY=$(`#name_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.QTY_VIEW=$(`#qty_view${id}`).prop("checked")||$(`#qty_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.QTY_MODIFY=$(`#qty_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.TYPE_VIEW=$(`#type_view${id}`).prop("checked")||$(`#type_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.TYPE_MODIFY=$(`#type_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.SHELF_MODIFY=$(`#SHELF_MODIFY${id}`).prop("checked")? 1 : 0;
		updateUserInfo.GRAM_VIEW=$(`#gram_view${id}`).prop("checked")||$(`#gram_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.GRAM_MODIFY=$(`#gram_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.EXP_VIEW=$(`#exp_view${id}`).prop("checked")||$(`#exp_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.EXP_MODIFY=$(`#exp_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.TAG_VIEW=$(`#tag_view${id}`).prop("checked")||$(`#tag_modify${id}`).prop("checked")? 1 : 0;
		updateUserInfo.TAG_MODIFY=$(`#tag_modify${id}`).prop("checked")? 1 : 0;
		

		fetch(`http://localhost:4000/login/account/saveUpdatedUser?userInfo=${JSON.stringify(updateUserInfo)}`)
		.then(res=>res.json())
		.then(data=>{
			if(data.data === 'success') {
			}else {
				$(".statusText").text("something went wrong, please check if your login session has expired!. To solve it, please log in again!");
			}
		})
		

	}


	toggleView(e,userid,chk,action,...affecteAction) {
		e.stopPropagation();

		if(chk && $(`#${action}${userid}`).prop("checked")){
			affecteAction.forEach(affected=>$(`#${affected}${userid}`).prop('checked', true));	
		}
		else if(!chk && !$(`#${action}${userid}`).prop("checked")) {
			affecteAction.forEach(affected=>$(`#${affected}${userid}`).prop('checked', false));
		}
	}



	render() {

		return (
			<div className="account-wrapper">
			<div className="header-section">

				<h1>My Account: {this.state.accountInfo.USERNAME}</h1>
				<ul className="nav-bar">
					<li><a href="/login/account/resetpassword">Reset Password</a></li>
					
					{this.state.accountInfo.ACCESS_LEVEL < 3 ? 
					<li><a href="/login/account/register">Add User</a></li>
					: null
				}
				</ul>
			</div>
			<div className="main-section">
				<div className="block activityLog-container">
					<h1>Activity Log{this.state.accountInfo.USERNAME}</h1>
				</div>
				{this.state.accountInfo.ACCESS_LEVEL < 3 ? 
					(
						<div className="block userView-container">
							<h1>User overview</h1>
								<div className = "statusText-container block">
        							<h3 className = "statusText warning-status text-center"></h3>
        						</div>
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
											<td>Modify Shelf</td>
											<td>View Gram</td>
											<td>Modify Gram</td>
											<td>View EXP</td>
											<td>Modify EXP</td>
											<td className="display-none">View Tags</td>
											<td className="display-none">Modify Tags</td>
											<td>Created By</td>
											<td>Action</td>
										</tr>
									</thead>
									<tbody>
										{this.state.users.map( (user,key) => (
											<tr key={`user-${key}`} className={`userRow user-${key}`}>
												<td><strong>{user.USERNAME}{user.ACCESS_LEVEL}</strong></td>
												<td><input id={`access_level${user.ID}`} type="checkbox" defaultChecked={user.ACCESS_LEVEL < 3? 1 : 0}></input></td>
												<td><input id={`view_item${user.ID}`} type="checkbox" defaultChecked={user.VIEW_ITEM} onChange = {e => this.toggleView(e,user.ID,false,"view_item","add_item","delete_item","name_modify","qty_view","qty_modify","type_view","type_modify","SHELF_MODIFY","gram_view","gram_modify","exp_view","exp_modify")}></input></td>
												<td><input id={`add_item${user.ID}`} type="checkbox" defaultChecked={user.ADD_ITEM} onChange = {e => this.toggleView(e,user.ID,true,"add_item","view_item")}></input></td>
												<td><input id={`delete_item${user.ID}`} type="checkbox" defaultChecked={user.DELETE_ITEM} onChange = {e => this.toggleView(e,user.ID,true,"delete_item","view_item")}></input></td>
												<td><input id={`name_modify${user.ID}`} type="checkbox" defaultChecked={user.NAME_MODIFY} onChange = {e => this.toggleView(e,user.ID,true,"name_modify","view_item")}></input></td>
												<td><input id={`qty_view${user.ID}`} type="checkbox" defaultChecked={user.QTY_VIEW} onChange = {e => this.toggleView(e,user.ID,false,"qty_view","qty_modify")}></input></td>
												<td><input id={`qty_modify${user.ID}`} type="checkbox" defaultChecked={user.QTY_MODIFY} onChange = {e => this.toggleView(e,user.ID,true,"qty_modify","qty_view","view_item")}></input></td>
												<td><input id={`type_view${user.ID}`} type="checkbox" defaultChecked={user.TYPE_VIEW} onChange = {e => this.toggleView(e,user.ID,false,"type_view","type_modify")}></input></td>
												<td><input id={`type_modify${user.ID}`} type="checkbox" defaultChecked={user.TYPE_MODIFY} onChange = {e => this.toggleView(e,user.ID,true,"type_modify","type_view","view_item")}></input></td>
												<td><input id={`SHELF_MODIFY${user.ID}`} type="checkbox"defaultChecked={user.SHELF_MODIFY} onChange = {e => this.toggleView(e,user.ID,true,"SHELF_MODIFY","view_item")}></input></td>
												<td><input id={`gram_view${user.ID}`} type="checkbox" defaultChecked={user.GRAM_VIEW} onChange = {e => this.toggleView(e,user.ID,false,"gram_view","gram_modify")}></input></td>
												<td><input id={`gram_modify${user.ID}`} type="checkbox" defaultChecked={user.GRAM_MODIFY}  onChange = {e => this.toggleView(e,user.ID,true,"gram_modify","gram_view","view_item")}></input></td>
												<td><input id={`exp_view${user.ID}`} type="checkbox" defaultChecked={user.EXP_VIEW}  onChange = {e => this.toggleView(e,user.ID,false,"exp_view","exp_modify")}></input></td>
												<td><input id={`exp_modify${user.ID}`} type="checkbox" defaultChecked={user.EXP_MODIFY} onChange = {e => this.toggleView(e,user.ID,true,"exp_modify","exp_view","view_item")}></input></td>
												<td className="display-none"><input id={`tag_view${user.ID}`} type="checkbox" defaultChecked={user.TAG_VIEW}></input></td>
												<td className="display-none"><input id={`tag_modify${user.ID}`} type="checkbox" defaultChecked={user.TAG_MODIFY}></input></td>
												<td>{user.CREATEDBY}</td>
												<td>
													<button type="button" className="btn btn-success" onClick={(e)=>this.editClick(e,`${user.ID}`)}>Save</button>									
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
