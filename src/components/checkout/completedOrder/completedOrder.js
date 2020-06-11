import React from 'react';
import Moment from 'moment';
import "./completedOrder.scss";

export default class completedOrder extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			accountInfo : this.props.location.state.accountInfo,
			ORDER_ID: this.props.location.state.ORDER_ID,
			COMPLETED_ORDER: [],
			ORDER_ITEMS: [],
			ORDER_NOTES: []
		}
	}
	


	loadOrderInfo() {
		fetch(`${process.env.REACT_APP_INVENTROY_API}/checkout/ongoingorder?orderId=${this.state.ORDER_ID}`)
			.then(res => res.json())
			.then(data => {
				if(data.data.order[0]) {
					this.setState({COMPLETED_ORDER : data.data.order[0]});
				}
				if(data.data.orderItems) {
					this.setState({ORDER_ITEMS : this.organizeData(data.data.orderItems)}, ()=>console.log(this.state.ORDER_ITEMS));
				}
			});
	}

	loadOderNotes() {
		fetch(`${process.env.REACT_APP_INVENTROY_API}/checkout/order/loadnotes?orderId=${this.state.ORDER_ID}`)
		.then(res => res.json())
		.then(data => {
			if(data.data) {
				this.setState({ORDER_NOTES : data.data});
			}
		});
	}


	componentDidMount() {
		this.loadOrderInfo();

		// Since this is the completed orders, there is really no neccessarity for getting prompt notes. 
		// Therefore, we only get notes once while the order is loaded.
		this.loadOderNotes();
	}



	organizeData(data) {
	
		let uniqueData = [];
		uniqueData = data.reduce((acc,item)=>{
			if(!acc.find(el=>el["ORDER_ITEM_ID"] === item["ORDER_ITEM_ID"])) {
				acc.push(item);
			}
			return acc;
		},[]);

		uniqueData.forEach(item => {
			let chineseName = item.ORDER_ITEM_PRODUCT.split(" ");
				chineseName = chineseName[chineseName.length-1];
				
			let englishName = item.ORDER_ITEM_PRODUCT.split(" " + chineseName);
				englishName = englishName[0];
			
			item.ITEMCHNAME = chineseName;
			item.ITEMENNAME = englishName;
			item.PICKUP_ITEMS = JSON.parse(item.PICKUP_ITEMS);
		}); 	

		return uniqueData;
	}


	render() {
		return (
			<div className="completedOrder-wrapper">
				<div className="head-section container-fluid">
					<div className="order-info row">
						<div className="col-3 col-lg-2"><h3>Order No: {this.state.COMPLETED_ORDER.ORDER_ID}</h3></div>
						<div className="col-4 col-lg-2"><h3>Customer: {this.state.COMPLETED_ORDER.CUSTOMER}</h3></div>
						<div className="col-5 col-lg-4"><h3>Order Received: {Moment(this.state.COMPLETED_ORDER.ORDER_TIME).format('YYYY-MM-DD  HH:mm:s')}</h3></div>
						<div className="col-6 col-lg-2"><h3>Sales: {this.state.COMPLETED_ORDER.PERSON}</h3></div>
						<div className="col-6 col-lg-2"><h3>Pickup: {this.state.COMPLETED_ORDER.PICKUP_PERSON}</h3></div>
					</div>
				</div>
				<div className="main-section">
					{this.state.COMPLETED_ORDER.STATUS === "COMPLETED"? 
					<div className="container-fluid">
						<div className="row header-container">
							<div className="col-4 text-left"><h3>Item</h3></div>
							<div className="col-1"><h3>Order Qty</h3></div>
							<div className="col-7">
								<div className="row">
									<div className="col-2"><h3>Shelf No.</h3></div>
									<div className="col-2"><h3>Manu.</h3></div>
									<div className="col-4"><h3>Exp Date</h3></div>
									<div className="col-2"><h3>Pick Up Qty</h3></div>
									<div className="col-2"><h3>Tablet Qty</h3></div>
								</div>
							</div>
						</div>
						{this.state.ORDER_ITEMS.map((item,key)=>
							<div className="row item-container" key={`item${key}`}>
								<div className="col-4 text-left"><h3>{item.ITEMENNAME}</h3><h3>{item.ITEMCHNAME}</h3></div>
								<div className="col-1"><h3>{item.ORDER_ITEM_QTY}</h3></div>
								<div className="col-7">
								{item.PICKUP_ITEMS?
								item.PICKUP_ITEMS.map((diffItem,diffKey)=>
									diffItem.PICKUPVALUE > 0 ?
									<div className="row" key={`diffItem${diffKey+1}`}>
										<div className="col-2"><h3>{diffItem.SHELF_NO}</h3></div>
										<div className="col-2"><h3>{diffItem.MANUFACTURE}</h3></div>
										<div className="col-4"><h3>{Moment(diffItem.EXPIRE_DATE).format('YYYY-MM-DD')}</h3></div>
										<div className="col-2"><h3>{diffItem.PICKUPVALUE}</h3></div>
										<div className="col-2"><h3>{diffItem.TABLETQTY}</h3></div>
									</div>
									:
									null
									)
								:
								null
								}
								</div>
								
							</div>
						)}
					</div>
					:
					<div className="container-fluid">
						<div className="row header-container">
							<div className="col-1"><h3>Index</h3></div>
							<div className="col-8 text-left"><h3>Item</h3></div>
							<div className="col-3"><h3>QTY</h3></div>
						</div>
						{this.state.ORDER_ITEMS.map((item,key)=>
							<div className="row item-container" key={`item${key}`}>
								<div className="col-1"><h3>{key+1}</h3></div>
								<div className="col-8 text-left"><h3>{item.ITEMENNAME}</h3><h3>{item.ITEMCHNAME}</h3></div>
								<div className="col-3"><h3>{item.ORDER_ITEM_QTY}</h3></div>
							</div>
						)}
					</div>
					}
					<div className="noteContainer">
						{this.state.ORDER_NOTES.map((note,key) =>
							
							<div className={`container-fluid note-row ${key === 0? `firstRow`:``}`} key={`note${key+1}`}>
								<div className="row note-header">
									<div className="col-4 col-md-4 text-center"><h4>Time: {Moment(note.TIME).format('YYYY-MM-DD HH:mm:ss')}</h4></div>
									<div className="col-4 col-md-4 text-center"><h4>Author: {note.PERSON}</h4></div>
									<div className="col-4 col-md-4 text-center"><h4>Status: {note.STATUS}</h4></div>
								</div>
								<div className="note-info">
									<h4 className="text-left">{note.NOTE}</h4>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
