import React from 'react';
import Moment from 'moment';
import './pickupOrderDetail.scss';

import $ from 'jquery';

export default class pickupOrderDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			accountInfo : this.props.location.state.accountInfo,
			ORDER_INFO: this.props.location.state.orderInfo,
			ORDER_ITEMS: []
		}

		console.log(this.props.location.state);
	}

	loadOrderInfo () {
		fetch(`http://localhost:4000/pickup/order-detail?orderId=${this.state.ORDER_INFO.ORDER_ID}`)
		.then(res => res.json())
		.then(data => {
			if(data.orderDetail) {
				this.setState({ORDER_ITEMS: this.organizeData(data.orderDetail)});
			}
		});
	}

	componentDidMount() {
		this.loadOrderInfo();
	}



	organizeData (orderDetails) {
		console.log(orderDetails);
		let orderItems = [];

		orderDetails.forEach(item => {
			let chineseName = item.PRODUCT.split(" ");
				chineseName = chineseName[chineseName.length-1];
				
			let englishName = item.PRODUCT.split(" " + chineseName);
				englishName = englishName[0];

			orderItems.push({
								CHINESENAME : chineseName,
								ENGLISHNAME : englishName,
								QTY: item.QTY,
								PICKUP_ITEMS: JSON.parse(item.PICKUP_ITEMS)
							})
		})
		console.log(orderItems);
		return orderItems;
	}



	itemChecked(e,key) {
		e.stopPropagation();

		$(`#checkbox${key}`).prop("checked")? $(`#item${key}`).addClass("itemChecked") : $(`#item${key}`).removeClass("itemChecked");
		

	}


	render() {
		return (
			<div className="pickupOrderDetail-wrapper">
				<div className="head-section container-fluid">
					<div className="order-info row">
						<div className="col-6 col-md-3"><h1>Order No: {this.state.ORDER_INFO.ORDER_ID}</h1></div>
						<div className="col-6 col-md-4"><h1>Customer: {this.state.ORDER_INFO.CUSTOMER}</h1></div>
						<div className="col-6 col-md-5"><h1>Order Received: {Moment(this.state.ORDER_INFO.ORDER_TIME).format('YYYY-MM-DD  HH:mm:s')}</h1></div>
					</div>
				</div>
				<div className="main-section container-fluid">
					<div className="row header-container">
						<div className="col-1"><h3>Index</h3></div>
						<div className="col-3 text-left"><h3>Item</h3></div>
						<div className="col-1"><h3>QTY</h3></div>
						<div className="col-6">
							<div className="row">
								<div className="col-1"><h3>Shelf No.</h3></div>
								<div className="col-3"><h3>Manu.</h3></div>
								<div className="col-4"><h3>Exp Date</h3></div>
								<div className="col-2"><h3>Pick Up Qty</h3></div>
								<div className="col-1"><h3>Tablet Qty</h3></div>
							</div>
						</div>
						<div className="col-1"><h3>Check</h3></div>
					</div>
					{this.state.ORDER_ITEMS.map((item, key)=>
						<div id={`item${key+1}`}className="row item-container" key={key+1}>
							<div className="col-1"><h3>{key+1}</h3></div>
							<div className="col-3 text-left">
								<h3>{item.ENGLISHNAME}</h3>
								<h3>{item.CHINESENAME}</h3>
							</div>
							<div className="col-1"><h3>{item.QTY}</h3></div>
							<div className="col-6">
								{item.PICKUP_ITEMS.map((pickUpItem, pickUpkey)=> 
									pickUpItem.PICKUPVALUE > 0 ? 
									<div className="row pickupItem-container" key={`pickUpkey${pickUpkey+1}`}>
										<div className="col-1"><h3>{pickUpItem.SHELF_NO}</h3></div>
										<div className="col-3"><h3>{pickUpItem.MANUFACTURE}</h3></div>
										<div className="col-4"><h3>{Moment(pickUpItem.EXPIRE_DATE).format('YYYY-MM-DD  HH:mm:s')}</h3></div>
										<div className="col-2"><h3>{pickUpItem.PICKUPVALUE}</h3></div>
										<div className={`col-1 ${pickUpItem.TABLETQTY > 0 ? 'tablet-warning' : null}`}><h3>{pickUpItem.TABLETQTY}</h3></div>
									</div>
									:
									null
									)}
							</div>
							<div className="col-1"><input id={`checkbox${key+1}`} type="checkbox" onChange = {e => this.itemChecked(e,key+1)}></input></div>
						</div>
					)}
				</div>
			</div>
		);
	}
}
