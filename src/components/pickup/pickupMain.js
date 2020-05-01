import React from 'react';

export default class pickupMain extends React.Component {
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
			<div className ="pick-wrapper">
				<div className="header-section">Pick up page {this.state.accountInfo.USERNAME}</div>
				<div className="main-section">
					<table>
						<tbody>
							{this.state.PICKUP_ORDERS.map((order,key) =>
								<tr key={key+1}>
									<td>{order.CUSTOMER}</td>

								</tr>

							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
