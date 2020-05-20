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
			ongoinOrdersNotifications: [],
			ongoingOrders_BACKUP: [],
			completedOrders_BACKUP: [],
			ongoingOrders: [],
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

			this.setState(
				{
					ongoingOrders : saveOngoingOrders, 
					completedOrders : saveCompletedOrders,
					ongoingOrders_BACKUP : saveOngoingOrders, 
					completedOrders_BACKUP : saveCompletedOrders
			
				}
			);
			
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


	searchKeyword (e,type) {
		e.preventDefault();
		
		if(type==="COMPLETED") {
			let keyupValue = $.trim($("#COMPLETED-search").val()).toLowerCase();
			if(keyupValue === "") {
				this.setState({completedOrders:this.state.completedOrders_BACKUP});
			}else {
				let filterData = this.state.completedOrders_BACKUP.filter(f => 
					f.ORDER_ID.includes(keyupValue) ||
					f.CUSTOMER.toLowerCase().includes(keyupValue) ||
					Moment(f.ORDER_TIME).format('YYYY-MM-DD HH:mm:ss').includes(keyupValue) ||
					f.STATUS.toLowerCase().includes(keyupValue)
				);
				this.setState({completedOrders: filterData});
			}
		}else {
			let keyupValue = $.trim($("#ONGOING-search").val()).toLowerCase();
			if(keyupValue === "") {
				this.setState({ongoingOrders:this.state.ongoingOrders_BACKUP});
			}else {
				let filterData = this.state.ongoingOrders_BACKUP.filter(f => 
					f.ORDER_ID.includes(keyupValue) ||
					f.CUSTOMER.toLowerCase().includes(keyupValue) ||
					Moment(f.ORDER_TIME).format('YYYY-MM-DD HH:mm:ss').includes(keyupValue) ||
					f.STATUS.toLowerCase().includes(keyupValue)
				);
				this.setState({ongoingOrders: filterData});
			}
		}
	}


	sortToggleBtnClick(e, type, field) {
		e.preventDefault();

		let btnText = $(`#${type}-${field}-sort-toggleBtn`).text();
		let sortData;
		
		if(type === "COMPLETED") {
			sortData = this.state.completedOrders;
		}else {
			sortData = this.state.ongoingOrders;
		} 
		
		sortData = sortData.sort((a,b)=>{
			return btnText === "ASC"? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
		})

		$(`#${type}-${field}-sort-toggleBtn`).text(btnText === "ASC"? "DESC" : "ASC");
		
		if(type === "COMPLETED") {
			this.setState({completedOrders:sortData});
		}else {
			this.setState({ongoingOrders:sortData});
		} 

	}

	render() {
		return (
			<div className = "checkoutMain-wrapper">		
				{this.props.accountInfo.CHK_VIEW?
				<div className = "main-section container-fluid">

					<div className = "notification-container row">
						<div className="notification-head col-12">
							<h2 className="text-center">Notification</h2>
						</div>
						<div className="notification-main col-12">
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
						{/**********************************************COMPLETED Panel*****************************************************/}

							<div className="col-12 col-md-12 col-lg-6 completed-container">
								<div className="subContainer-head">
									<h3 className="text-center">Completed Order</h3>
									<div className="search-container inline-b">
										<h4>Filter: </h4>
										<input id="COMPLETED-search" type="text" onKeyUp={e=>this.searchKeyword(e,"COMPLETED")}/>
									</div>
								</div>
								<div className="subContainer-main">
									<table>
										<thead>
											<tr>
												<td>Order Number <button id="COMPLETED-ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"COMPLETED","ORDER_ID")}>ASC</button></td>
												<td>Customer <button id="COMPLETED-CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"COMPLETED","CUSTOMER")}>ASC</button></td>
												<td>Time <button id="COMPLETED-ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"COMPLETED","ORDER_TIME")}>ASC</button></td>
												<td>Status <button id="COMPLETED-STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"COMPLETED","STATUS")}>ASC</button></td>
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
														className="btn btn-primary">Proceed</Link>
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
							




						{/**********************************************ONGOING Panel*****************************************************/}
							<div className="col-12 col-md-12 col-lg-6 ongoing-container">
								<div className="subContainer-head">
									<h3 className="text-center">Ongoing Order</h3>
									<div className="search-container inline-b">
										<h4>Filter: </h4>
										<input id="ONGOING-search" type="text" onKeyUp={e=>this.searchKeyword(e,"ONGOING")}/>
									</div>
								</div>
								<div className="subContainer-main">
									<table>
										<thead>
											<tr>
												<td>Order Number <button id="ONGOING-ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ONGOING","ORDER_ID")}>ASC</button></td>
												<td>Customer <button id="ONGOING-CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ONGOING","CUSTOMER")}>ASC</button></td>
												<td>Time <button id="ONGOING-ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ONGOING","ORDER_TIME")}>ASC</button></td>
												<td>Status <button id="ONGOING-STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ONGOING","STATUS")}>ASC</button></td>
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
