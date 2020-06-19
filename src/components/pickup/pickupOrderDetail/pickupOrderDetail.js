import React from 'react';
import Moment from 'moment';
import './pickupOrderDetail.scss';

import $ from 'jquery';

export default class pickupOrderDetail extends React.Component {
	interValName = "pickupOrderDetailNotes";

	constructor(props) {
		super(props);
		this.state = {
			accountInfo : this.props.location.state.accountInfo,
			ORDER_INFO: this.props.location.state.orderInfo,
			ORDER_ITEMS: [],
			ORDER_ITEMS_COUNT: 0,
			NOTES: [], 
			today: new Date().toISOString().slice(0, 10), 
			aboutExpiredDate:null
		}
	}

	loadOrderInfo () {
		fetch(`${process.env.REACT_APP_INVENTROY_API}/pickup/order-detail?orderId=${this.state.ORDER_INFO.ORDER_ID}`)
		.then(res => res.json())
		.then(data => {
			if(data.orderDetail) {
				this.setState({ORDER_ITEMS: this.organizeData(data.orderDetail), ORDER_ITEMS_COUNT : data.orderDetail.length});
			}
		});
	}


	loadNotes() {
		fetch(`${process.env.REACT_APP_INVENTROY_API}/checkout/order/loadnotes?orderId=${this.state.ORDER_INFO.ORDER_ID}`)
		.then(res => res.json())
		.then(data => {
			if(data.data) {
				this.setState({NOTES: data.data});
			}
		})
	}


	componentDidMount() {
		this.loadOrderInfo();

		this.setState({aboutExpiredDate: Moment(new Date(this.state.today).setMonth(new Date(this.state.today).getMonth()+4)).format('YYYY-MM')});
		this.interValName = setInterval(()=>this.loadNotes(),1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalName);
	}



	organizeData (orderDetails) {
		let orderItems = [];

		orderDetails.forEach(item => {
			let chineseName = item.PRODUCT.split(" ");
				chineseName = chineseName[chineseName.length-1];
				
			let englishName = item.PRODUCT.split(" " + chineseName);
				englishName = englishName[0];



			let pickup_items = [];


			let PICKUP_ITEMS = JSON.parse(item.PICKUP_ITEMS);
			PICKUP_ITEMS.forEach((diffItem => {
				let ITEMINFO = [];
				let INVQTY = this.getinventoryiteminformation(diffItem.ID);
				INVQTY.then(data => {ITEMINFO.push(data.data[0])});
				

				pickup_items.push({
					EXPIRE_DATE: diffItem.EXPIRE_DATE, 
					MANUFACTURE: diffItem.MANUFACTURE, 
					PICKUPVALUE: diffItem.PICKUPVALUE, 
					QTY: diffItem.QTY, 
					TABLETQTY: diffItem.TABLETQTY, 
					SHELF_NO: diffItem.SHELF_NO, 
					TYPE: diffItem.TYPE,
					ITEMINFO: ITEMINFO
				})
			}));

			orderItems.push({
								CHINESENAME : chineseName,
								ENGLISHNAME : englishName,
								QTY: item.QTY,
								PICKUP_ITEMS: pickup_items
							})

		})

		return orderItems;
	}



	
	async getinventoryiteminformation(itemId) {
		let itemInfo = await fetch(`${process.env.REACT_APP_INVENTROY_API}/inventory/getinventoryiteminformation?itemId=${itemId}`)
		.then(res => res.json());
		
		return itemInfo;
		
	}


	itemChecked(e,key) {
		e.stopPropagation();

		if($(`#checkbox${key}`).prop("checked")){
			$(`#item${key}`).addClass("itemChecked");
			this.setState({ORDER_ITEMS_COUNT : this.state.ORDER_ITEMS_COUNT - 1});
		} else {
			$(`#item${key}`).removeClass("itemChecked");
			this.setState({ORDER_ITEMS_COUNT : this.state.ORDER_ITEMS_COUNT + 1});
		}
	}


	noteInputBtnToggle() {
		$.trim($("#noteInput").val())? $("#pushBackBtn").removeClass("disabled") :  $("#pushBackBtn").addClass("disabled")
	}

	btnsToggle(e,btnAction) {
		e.preventDefault();

		if((btnAction === "PUSHED BACK" && $.trim($("#noteInput").val())) || btnAction === "COMPLETED") {

	
			let actionInstr = {
				action: btnAction,
				orderNo: this.state.ORDER_INFO.ORDER_ID,
				orderItems: this.state.ORDER_ITEMS,
				note: $("#noteInput").val(),
				PERSON: this.state.accountInfo.USERNAME
			}
			
			fetch(`${process.env.REACT_APP_INVENTROY_API}/pickup/order-detail/pushprocess?`,
				{	method:'POST',  
    				headers: {'Content-Type': 'application/json'},
    				body: JSON.stringify(actionInstr)
    			}	
    		)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if(data.data && data.data === 'success') {
					window.location.href="/pickup";
				}else {
					console.log(data.data);
					alert("something went wrong");
				}
			});

		}else{
			alert("You must leave a note !!!");
		}
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
				<div className="main-section">
					<div className="container-fluid">
						<div className="row header-container">
							<div className="col-1"><h3>Index</h3></div>
							<div className="col-3 text-left"><h3>Item</h3></div>
							<div className="col-1"><h3>Order Qty</h3></div>
							<div className="col-6">
								<div className="row">
									<div className="col-1"><h3>Shelf No.</h3></div>
									<div className="col-2"><h3>Mfr.</h3></div>
									<div className="col-1"><h3>Qty Left</h3></div>
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
											<div className="col-2"><h3>{pickUpItem.MANUFACTURE}</h3></div>
											<div className="col-1"><h3>{pickUpItem.ITEMINFO && pickUpItem.ITEMINFO[0]?pickUpItem.ITEMINFO[0].QTY:'0'}</h3></div>
											<div className={`col-4 ${Moment(pickUpItem.EXPIRE_DATE).format('YYYY-MM') <= Moment(this.props.toady).format('YYYY-MM')? 'expired-date': Moment(pickUpItem.EXPIRE_DATE).format('YYYY-MM') < this.state.aboutExpiredDate? 'about-expired' : ''  }`}><h3>{Moment(pickUpItem.EXPIRE_DATE).format('YYYY-MM-DD')}</h3></div>
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
					

					{this.state.NOTES.map((note,key)=>
						<div className={`container-fluid notes-container ${key === 0? 'first-note': ''}`}  key={`note${key+1}`}>
							<div className="row note-header">
								<div className="col-4"><h4>Time: {Moment(note.TIME).format('YYYY-MM-DD  HH:mm:s')}</h4></div>
								<div className="col-4"><h4>Auther: {note.PERSON}</h4></div>
								<div className="col-4"><h4>Status: {note.STATUS}</h4></div>
							</div>
							<div className="row note-content">
								<h4>{note.NOTE}</h4>
							</div>
						</div>
					)}

					<div className="actionContainer">
						<label className="block">Note:</label>
						<textarea id="noteInput" className="block" onKeyUp={this.noteInputBtnToggle()}></textarea>
						<button id="pushBackBtn" className="block btn btn-warning disabled" onClick={e => this.btnsToggle(e,"PUSHED BACK")}>Push Back</button>
						<button className={`block btn btn-success ${this.state.ORDER_ITEMS_COUNT === 0? "": "disabled"}`} onClick={e=>this.btnsToggle(e, "COMPLETED")}>Finish</button>
					</div>

				</div>
		 	</div>
		);
	}
}
