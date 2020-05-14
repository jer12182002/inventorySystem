import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';
import $ from 'jquery';

import "./checkoutMain.scss";
export default class checkoutMain extends React.Component {
	intervalName = 'orderNotifiactions';
	constructor(props) {
		super(props);

		this.state = {
			ongoingOrders: [],
			ongoinOrdersNotifications: [],
			completedOrders: []
		}
	}


	loadOngoingOrder() {
		fetch(`http://localhost:4000/checkout`)
		.then(res => res.json())
		.then(data => {
			
			let saveOngoingOrders = [];
			let saveCompletedOrders= [];

			data.data.forEach(order => {
				if(order.STATUS === 'RECEIVED' || order.STATUS === 'IN PROCESS' || order.STATUS === 'PUSHED BACK') {
					saveOngoingOrders.push(order);
				}else if(order.STATUS === 'COMPLETED' || order.STATUS === 'DELETED') {
					saveCompletedOrders.push(order);
				}
			});

			this.setState({ongoingOrders : saveOngoingOrders, completedOrders : saveCompletedOrders});
			
		});
	}

	loadOrdersNotification() {
		fetch(`http://localhost:4000/checkout/ongoingordernotifications`)
		.then(res => res.json())
		.then(data => {
			if(data.data) {
				this.setState({ongoinOrdersNotifications : data.data});
			}
		});

	}


	componentDidMount() {
		this.loadOngoingOrder();

		this.intervalName = setInterval(()=>{
			this.loadOrdersNotification();
		},3000);
	}


	componentWillUnmount() {
		clearInterval(this.intervalName);
	}


	sortToggleBtnClick(e, type, field) {
		e.preventDefault();

		let btnText = $(`#${type}-${field}-sort-toggleBtn`).text();
		let sortData;
		
		if(type === "LEFT") {
			sortData = this.state.completedOrders;
		}else {
			sortData = this.state.ongoingOrders;
		} 

		console.log(`#${type}-${field}-sort-toggleBtn`);
		
		sortData = sortData.sort((a,b)=>{
			return btnText === "ASC"? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
		})

		$(`#${type}-${field}-sort-toggleBtn`).text(btnText === "ASC"? "DESC" : "ASC");
		
		if(type === "LEFT") {
			this.setState({completedOrders:sortData});
		}else {
			this.setState({ongoingOrders:sortData});
		} 

	}

	render() {
		return (
			<div className = "checkoutMain-wrapper">
				<div className = "header-section">
					<h1>Check Out </h1>
				</div>
				
				{this.props.accountInfo.CHK_VIEW?
				<div className = "main-section container-fluid">

					<div className = "notification-container">
						<div className="notification-head">
							<h2 className="text-center">Notification</h2>
						</div>
						<div className="notification-main">
							{this.state.ongoinOrdersNotifications.map((notification,key)=>
							notification.NEW_MSG_CHKOUT > 0 ?
								<div className="row" key={key+1}>
									<h2 className="text-center">You have {notification.NEW_MSG_CHKOUT} notification for Order: {notification.ORDER_ID}</h2>
								</div>
								:
								null
							)}
						</div>
					</div>

						<div className="row">
						{/**********************************************Left Panel*****************************************************/}

							<div className="col-12 col-md-6 completed-container">
								<div className="subContainer-head">
									<h3 className="text-center">Completed Order</h3>
								</div>
								<div className="subContainer-main">
									<table>
										<thead>
											<tr>
												<td>Order Number <button id="LEFT-ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"LEFT","ORDER_ID")}>ASC</button></td>
												<td>Customer <button id="LEFT-CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"LEFT","CUSTOMER")}>ASC</button></td>
												<td>Time <button id="LEFT-ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"LEFT","ORDER_TIME")}>ASC</button></td>
												<td>Status <button id="LEFT-STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"LEFT","STATUS")}>ASC</button></td>
												{this.props.accountInfo.CHK_MODIFY? 
													<td>Action</td>:null
												}
											</tr>
										</thead>
										<tbody>
											{this.state.completedOrders.map((order, key) => 
												<tr key={key+1}>
													<td>{order.ORDER_ID}</td>
													<td>{order.CUSTOMER}</td>
													<td>{Moment(order.ORDER_TIME).format('YYYY-MM-DD  HH:mm:ss')}</td> 
													<td>{order.STATUS}</td>
													{this.props.accountInfo.CHK_MODIFY? 
													<td>
														<Link to={{
															pathname:`/checkout/completedOrder`,
															state: {
																accountInfo: this.props.accountInfo,
																ORDER_ID: order.ORDER_ID
															}
														}}
														className="btn btn-primary">Porceed</Link>
													</td>
													:
													null
													}
												</tr>
											)}										
										</tbody>
									</table>	
								</div>
							</div>
							




						{/**********************************************Right Panel*****************************************************/}
							<div className="col-12 col-md-6 ongoing-container">
								<div className="subContainer-head">
									<h3 className="text-center">Ongoing Order</h3>
								</div>
								<div className="subContainer-main">
									<table>
										<thead>
											<tr>
												<td>Order Number <button id="RIGHT-ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"RIGHT","ORDER_ID")}>ASC</button></td>
												<td>Customer <button id="RIGHT-CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"RIGHT","CUSTOMER")}>ASC</button></td>
												<td>Time <button id="RIGHT-ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"RIGHT","ORDER_TIME")}>ASC</button></td>
												<td>Status <button id="RIGHT-STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"RIGHT","STATUS")}>ASC</button></td>
												{this.props.accountInfo.CHK_MODIFY? 
													<td>Action</td>:null
												}
											</tr>
										</thead>
										<tbody>
											{this.state.ongoingOrders.map((order, key) => 
												<tr key={key+1}>
													<td>{order.ORDER_ID}</td>
													<td>{order.CUSTOMER}</td>
													<td>{Moment(order.ORDER_TIME).format('YYYY-MM-DD  HH:mm:ss')}</td> 
													<td>{order.STATUS}</td>
													{this.props.accountInfo.CHK_MODIFY? 
													<td>
														<Link to={{
															pathname:`/checkout/ongoingorder`,
															state: {
																accountInfo: this.props.accountInfo,
																ORDER_ID: order.ORDER_ID
															}
														}}
														className="btn btn-primary">Porceed</Link>
													</td>
													:
													null
													}
												</tr>
											)}										
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					:
					<h1>You don't have permission to view this page</h1>
				}
			</div>
			
		);
	}
}
