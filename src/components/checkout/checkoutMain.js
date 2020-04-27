import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';

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
			console.log(data);

			this.setState({ongoingOrders : data.data},()=>console.log(this.state.ongoingOrders));
			
		});
	}


	componentDidMount() {
		this.loadOngoingOrder();
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
											<td>Order Number</td>
											<td>Customer</td>
											<td>Time</td>
											<td>Status</td>
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
