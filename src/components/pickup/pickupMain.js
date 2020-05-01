import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';
import $ from 'jquery';
import "./pickupMain.scss";

export default class pickupMain extends React.Component {
	intervalName="pickUpOrders-notification";

	constructor(props) {
		super(props);
		this.state = {
			accountInfo: this.props.accountInfo,
			PICKUP_ORDERS: []
		}
	}

	loadAllPickUpOrder() {
		fetch('http://localhost:4000/pickup')
		.then(res => res.json())
		.then(data => {
			if(data.data) {
				this.setState({PICKUP_ORDERS : data.data},()=>console.log(this.state.PICKUP_ORDERS));
			}
		})
	}


	componentDidMount(){
		this.loadAllPickUpOrder();
	}


	render() {
		return (
			<div className ="pickup-wrapper">
				<div className="header-section">Pick up page {this.state.accountInfo.USERNAME}</div>
				<div className="notification-wrapper"></div>
				<div className="main-section">
					<table>
						<thead>
							<tr>
								<td>Index</td>
								<td>Order Number</td>
								<td>Customer</td>
								<td>Time</td>
								<td>Action</td>
							</tr>
						</thead>
						<tbody>
							{this.state.PICKUP_ORDERS.map((order,key) =>
								<tr key={key+1}>
									<td>{key+1}</td>
									<td>{order.ORDER_ID}</td>
									<td>{order.CUSTOMER}</td>
									<td>{order.ORDER_TIME}</td>
									<td>
										<Link className="btn btn-success" to={{
											pathname: "/pickup/order-detail",
											state: {
												orderId: order,
												accountInfo: this.state.accountInfo
											}
										}}>Proceed</Link>
									</td>

								</tr>

							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
