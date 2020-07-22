import React from 'react';
import './precursorDisplay.scss';

export default class precursorDisplay extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = "precursorDisplay-wrapper text-center">
				<div className = "head-section">
					<h2>Cites Report</h2>
					<input id = "startDate" type="date" defaultValue={this.props.startDate} onChange = {e => this.props.dateOnChangeClicked(e)}></input>
					<input id = "endDate" type="date" defaultValue={this.props.endDate} onChange = {e => this.props.dateOnChangeClicked(e)}></input>
					<button type="button" onClick = {e => this.props.generateBtnClicked(e)}>Generate</button>
				</div>
				<div className = "main-section">
					<table>
						<thead>
							<tr>
								<td>Order Number</td>
								<td>Customer</td>
								<td>Total Qty/100g</td>
								<td>Raw Material</td>
								<td>Preparation/Mixture</td>
								<td>DIN/NPN#</td>
								<td>Quantity Precursor Sold</td>
								<td>Date Sold</td>
							</tr>
						</thead>
						<tbody>
							{this.props.orderDetailsDisplay.map((orderItem,index) => 
								<tr key={`orderItem-${index}`}>
									<td>{orderItem.ORDER_ID}</td>
									<td>{orderItem.CUSTOMER}</td>
									<td>{orderItem.TOTALQTY}</td>
									<td>{orderItem.PRECURSOR}</td>
									<td>{orderItem.PRODUCT}</td>
									<td>{orderItem.NPN}</td>
									<td>{orderItem.TOTALRATION}</td>
									<td>{orderItem.PROCESS_TIME}</td>
								</tr>

							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
