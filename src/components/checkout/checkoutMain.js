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


	sortToggleBtnClick(e, target, sortPanelSide) {
		e.preventDefault();

		let sorted;
		
		if(sortPanelSide === "LEFT") {
			sorted = this.state.completedOrders;
		}else {
			sorted = this.state.ongoingOrders;
		} 
	
		
		if($(`#${target}-sort-toggleBtn`).text() === "Asc") {
			sorted = sorted.sort((a,b) => a[target].localeCompare(b[target]));
			$(`#${target}-sort-toggleBtn`).text("Desc");

		}else if($(`#${target}-sort-toggleBtn`).text() === "Desc"){
			sorted = sorted.sort((a,b) => b[target].localeCompare(a[target]));
			$(`#${target}-sort-toggleBtn`).text("Asc");
		}	

		if(sortPanelSide === "LEFT") {
			this.setState({completedOrders : sorted});
		}else {
			this.setState({ongoingOrders : sorted});
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
												<td>Order Number <button id="ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ORDER_ID","LEFT")}>Asc</button></td>
												<td>Customer <button id="CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CUSTOMER","LEFT")}>Asc</button></td>
												<td>Time <button id="ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ORDER_TIME","LEFT")}>Asc</button></td>
												<td>Status <button id="STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"STATUS","LEFT")}>Asc</button></td>
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
												<td>Order Number <button id="ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ORDER_ID","RIGHT")}>Asc</button></td>
												<td>Customer <button id="CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CUSTOMER","RIGHT")}>Asc</button></td>
												<td>Time <button id="ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ORDER_TIME","RIGHT")}>Asc</button></td>
												<td>Status <button id="STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"STATUS","RIGHT")}>Asc</button></td>
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
