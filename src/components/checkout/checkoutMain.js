import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';
import $ from 'jquery';

import "./checkoutMain.scss";
export default class checkoutMain extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			ongoingOrders: [],
			completedOrders: []
		}


	}
	loadOngoingOrder() {
		fetch(`http://localhost:4000/checkout`)
		.then(res => res.json())
		.then(data => {
			let ongoingOrders = data.data.map(order => {
				return order.STATUS === 'RECEIVED'? order: null;
			});
		
			this.setState({ongoingOrders : data.data},()=>console.log(this.state.ongoingOrders));
			
		});
	}


	componentDidMount() {
		this.loadOngoingOrder();
	}




	sortToggleBtnClick(e, target) {
		e.preventDefault();

		console.log(this.state.ongoingOrders);
		let sorted = this.state.ongoingOrders;
		//sorted.forEach(order => order.ORDER_TIME = new Date(order.ORDER_TIME));
		
		if($(`#${target}-sort-toggleBtn`).text() === "Asc") {
			sorted = sorted.sort((a,b) => a[target].localeCompare(b[target]));
			$(`#${target}-sort-toggleBtn`).text("Desc");

		}else if($(`#${target}-sort-toggleBtn`).text() === "Desc"){
			sorted = sorted.sort((a,b) => b[target].localeCompare(a[target]));
			$(`#${target}-sort-toggleBtn`).text("Asc");
		}	

		this.setState({ongoingOrders : sorted});
	}

	render() {
		return (
			<div className = "checkoutMain-wrapper">
				<div className = "header-section">
					<h1>Check Out </h1>
				</div>
				<div className = "main-section container-fluid">
					<div className="row">
						<div className="col-12 col-md-6 completed-container">
							<div className="subContinaer-head">
								<h3 className="text-center">Completed Order</h3>
							</div>
							<div className="subContinaer-main">completed</div>
						</div>
						<div className="col-12 col-md-6 ongoing-container">
							<div className="subContinaer-head">
								<h3 className="text-center">Ongoing Order</h3>
							</div>
							<div className="subContinaer-main">
								<table>
									<thead>
										<tr>
											<td>Order Number <button id="ORDER_ID-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ORDER_ID")}>Asc</button></td>
											<td>Customer <button id="CUSTOMER-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CUSTOMER")}>Asc</button></td>
											<td>Time <button id="ORDER_TIME-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ORDER_TIME")}>Asc</button></td>
											<td>Status <button id="STATUS-sort-toggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"STATUS")}>Asc</button></td>
											<td>Action</td>
										</tr>
									</thead>
									<tbody>
										{this.state.ongoingOrders.map((order, key) => 
											<tr key={key+1}>
												<td>{order.ORDER_ID}</td>
												<td>{order.CUSTOMER}</td>
												<td>{Moment(order.ORDER_TIME).format('YYYY-MM-DD  h:mm:s')}</td> 
												<td>{order.STATUS}</td>
												<td>
													<Link to={{
														pathname:`/checkout/ongoingorder`,
														state: {
															accountInfo: this.props.accountInfo,
															ORDER_ID: order.ORDER_ID
														}
													}}
													className="btn btn-primary">Porceed</Link>
												
													<button type="button" className="btn btn-danger">Delete</button>
												</td>
											</tr>
										)}										
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
