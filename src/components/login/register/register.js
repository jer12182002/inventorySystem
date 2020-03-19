import React from 'react';
import './register.scss';

import $ from 'jquery';
export default class register extends React.Component {

	state = {
		userInfo:[],
		userPermission: []
	}

	// checkUserInfo = ()=>{
	// 	if($("#login_username").val()){
	// 		alert("good");
	// 	}
	// }

	editItemCheck() {
		if($("#editItem").is(":checked")){
			$('.permission-itemDetails').removeClass("display-none");
		}else {
			$('.permission-itemDetails').addClass("display-none");
			
			//remove all checked chechbox under Edit
			$(".permission-itemDetails input[type=checkbox]").prop("checked",false);
		}	
	}


	checkWhileModify(){
		if($("#qtyM").prop("checked")){
			$("#qtyV").prop("checked",true);
		}

		if($("#typeM").prop("checked")){
			$("#typeV").prop("checked",true);
		}

		if($("#gramM").prop("checked")){
			$("#gramV").prop("checked",true);	
		}
		
		if($("#expM").prop("checked")){
			$("#expV").prop("checked",true);
		}
		
		if($("#tagM").prop("checked")){
			$("#tagV").prop("checked",true);
		}
	}

	saveUserRecord(){
		var chk = '';

		chk += $.trim($('#login_username').val())? '' : "|Username is empty|"; 
		
		chk += $.trim($('#login_acc').val())? '' : " |Account is empty|"; 
		
		if(!($.trim($("#login_pwd").val()) && ($.trim($("#login_pwd").val()) === $.trim($("#re_login_pwd").val())))){
			chk += ' |Invalid Password|';
		}

		if(chk === '') {
			this.setState({userInfo:
							{username: $.trim($("#login_username").val()),
							account: $.trim($("#login_acc").val().toLowerCase()),
							password: $.trim($("#re_login_pwd").val()),
							access_level: $("#ACCESS_LEVEL").prop("checked")? "2" : "3",
							createdBy: this.props.accountInfo.USERNAME
							}});
			//console.log(this.state.userInfo);
			$('.statusText').addClass('success-status');
			$('.statusText').removeClass('warning-status');
		}else {
			$('.statusText').text(chk);
			$('.statusText').removeClass('success-status');
			$('.statusText').addClass('warning-status');
		}
		return chk;
	}



	savePermissionRecord(){
		this.setState({
			userPermission: {
				VIEW_ITEM: $("#viewItem").prop("checked")? 1 : 0,
				ADD_ITEM: $("#addItem").prop("checked")? 1 : 0,
				DELETE_ITEM: $("#deleteItem").prop("checked")? 1 : 0,
				NAME_MODIFY: $("#nameM").prop("checked")? 1 : 0,
				QTY_VIEW: ($("#qtyV").prop("checked")||$("#qtyM").prop("checked"))? 1 : 0,
				QTY_MODIFY: $("#qtyM").prop("checked")? 1 : 0,
				TYPE_VIEW: ($("#typeV").prop("checked")||$("#typeM").prop("checked"))? 1 : 0,
				TYPE_MODIFY: $("#typeM").prop("checked")? 1 : 0,
				GRAM_VIEW: ($("#gramV").prop("checked")||$("#gramM").prop("checked"))? 1 : 0,
				GRAM_MODIFY: $("#gramM").prop("checked")? 1 : 0,
				EXP_VIEW: ($("#expV").prop("checked")||$("#expM").prop("checked"))? 1 : 0,
				EXP_MODIFY: $("#expM").prop("checked")? 1 : 0,
				TAG_VIEW: ($("#tagV").prop("checked")||$("#tagM").prop("checked"))? 1 : 0,
				TAG_MODIFY: $("#tagM").prop("checked")? 1 : 0
			}
		})
	}


	componentDidMount(){
		$("#createBtn").click(()=>{
			if(this.saveUserRecord() === '') {
				this.savePermissionRecord();
				
				this.fetchData();
			}
		});
	}

	fetchData(){
		console.log("@fetchData");
		fetch(`http://localhost:4000/login/account/register?
						USERNAME=${this.state.userInfo.username}
						&ACCOUNT=${this.state.userInfo.account}
						&PASSWORD=${this.state.userInfo.password}
						&ACCESS_LEVEL=${this.state.userInfo.access_level}
						&CREATEDBY=${this.state.userInfo.createdBy}
						&VIEW_ITEM=${this.state.userPermission.VIEW_ITEM}
						&ADD_ITEM=${this.state.userPermission.ADD_ITEM}
						&DELETE_ITEM=${this.state.userPermission.DELETE_ITEM}
						&NAME_MODIFY=${this.state.userPermission.NAME_MODIFY}
						&QTY_VIEW=${this.state.userPermission.QTY_VIEW}
						&QTY_MODIFY=${this.state.userPermission.QTY_MODIFY}
						&TYPE_VIEW=${this.state.userPermission.TYPE_VIEW}
						&TYPE_MODIFY=${this.state.userPermission.TYPE_MODIFY}
						&GRAM_VIEW=${this.state.userPermission.GRAM_VIEW}
						&GRAM_MODIFY=${this.state.userPermission.GRAM_MODIFY}
						&EXP_VIEW=${this.state.userPermission.EXP_VIEW}
						&EXP_MODIFY=${this.state.userPermission.EXP_MODIFY}
						&TAG_VIEW=${this.state.userPermission.TAG_VIEW}
						&TAG_MODIFY=${this.state.userPermission.TAG_MODIFY}
						`)
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

	        				<div className="block">

	        					<table className="block permission-item">
	        						<thead>
	        							<tr>
	        								<th></th>
	        								<th>Set Manager</th>
	        							</tr>
	        						</thead>
	        						<tbody>
	        							<tr>
		        							<td>Role</td>
		        							<td><input type="checkbox" id="ACCESS_LEVEL"/></td>
	        							</tr>
	        						</tbody>
	        					</table>

	        					<table className="block permission-item">
	        						<thead>
	        							<tr>
		        							<th></th>
		        							<th>Item</th>
	        							</tr>
	        						</thead>
	        						<tbody>
	        							<tr>
	        								<td>View</td>
	        								<td><input type="checkbox" id="viewItem"/></td>
	        							</tr>
	        							<tr>
	        								<td>Add</td>
	        								<td><input type="checkbox" id="addItem"/></td>
	        							</tr>
	        							<tr>
	        								<td>Delete</td>
	        								<td><input type="checkbox" id="deleteItem"/></td>
	        							</tr>
	        							<tr>
	        								<td>Edit</td>
	        								<td><input type="checkbox" id="editItem" value="editItem" onChange={this.editItemCheck}/></td>
	        							</tr>
	        						</tbody>
	        					</table>

	        					<table className="block permission-itemDetails display-none">
	        						<thead>
	        							<tr>
		        							<th></th>
		        							<th>View</th>	
		        							<th>Modify</th>
	        							</tr>
	        						</thead>
	        						<tbody>
	        							<tr>
	        								<td>Name</td>
	        								<td></td>
	        								<td><input type="checkbox" id="nameM"/></td>
	        							</tr>
	        							<tr>
	        								<td>Quantity</td>
	        								<td><input type="checkbox" id="qtyV"/></td>
	        								<td><input type="checkbox" id="qtyM" onChange = {this.checkWhileModify}/></td>
	        							</tr>
	        							<tr>
	        								<td>Type</td>
	        								<td><input type="checkbox" id="typeV"/></td>
	        								<td><input type="checkbox" id="typeM" onChange = {this.checkWhileModify}/></td>
	        							</tr>
	        							<tr>
	        								<td>Gram</td>
	        								<td><input type="checkbox" id="gramV"/></td>
	        								<td><input type="checkbox" id="gramM"onChange = {this.checkWhileModify}/></td>
	        							</tr>
	        							<tr>
	        								<td>Exp Date</td>
	        								<td><input type="checkbox" id="expV"/></td>
	        								<td><input type="checkbox" id="expM" onChange = {this.checkWhileModify}/></td>
	        							</tr>
	        							<tr>
	        								<td>Tag</td>
	        								<td><input type="checkbox" id="tagV"/></td>
	        								<td><input type="checkbox" id="tagM"onChange = {this.checkWhileModify}/></td>
	        							</tr>
	        						</tbody>
	        					</table>
	        				</div>
	    	   				<div className = "statusText-container block">
			        			<h3 className = "statusText success-status"></h3>
			        		</div>
	        				<div className="block">
	    	    				<button type="button" id="createBtn" className="btn" >Create</button>
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
