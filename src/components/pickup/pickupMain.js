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
			PICKUP_ORDERS: [],
			
		}
	}

	loadAllPickUpOrder() {
		fetch('http://localhost:4000/pickup')
		.then(res => res.json())
		.then(data => {
			if(data.orders) {
				this.setState({PICKUP_ORDERS : data.orders},()=> console.log(this.state));
			}
		})
	}

	componentDidMount(){
		this.intervalName = setInterval(()=>{
			this.loadAllPickUpOrder();
		},1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalName);
	}

	render() {
		return (
			<div className ="pickup-wrapper">
				{this.props.accountInfo.PICKUP_VIEW? 
					<>
				<div className="header-section"></div>
				<div className="notification-wrapper">
					{this.state.PICKUP_ORDERS.map((order,key)=>
						order.NEW_MSG_PICKUP > 0?
						<div className="inline-b text-center" key={key+1}>
							<h4>You have <span>{order.NEW_MSG_PICKUP}</span> new message(s) for Order: <span>{order.ORDER_ID}</span> from {order.PERSON}</h4>
						</div>
						: null
					)}		
				</div>
				<div className="main-section">
					<table>
						<thead>
							<tr>
								<td>Index</td>
								<td>Order Number</td>
								<td>Customer</td>
								<td>Order Time</td>
								{this.props.accountInfo.PICKUP_RESPOND? 
								<td>Action</td>:null
								}
							</tr>
						</thead>
						<tbody>
							{this.state.PICKUP_ORDERS.map((order,key) =>
								<tr key={key+1}>
									<td>{key+1}</td>
									<td>{order.ORDER_ID}</td>
									<td>{order.CUSTOMER}</td>
									<td>{Moment(order.ORDER_TIME).format('YYYY-MM-DD  HH:mm:ss')}</td>
									{this.props.accountInfo.PICKUP_RESPOND? 
									<td>
										<Link className="btn btn-success" to={{
											pathname: "/pickup/order-detail",
											state: {
												orderInfo: order,
												accountInfo: this.state.accountInfo
											}
										}}>Proceed</Link>
									</td>
									:
									null
									}

								</tr>

							)}
						</tbody>
					</table>
				</div>
				</>
				:
				<h1>You have no permission for this page.</h1>
				}
			</div>
		);
	}
}
