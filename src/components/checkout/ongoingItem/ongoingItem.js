import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';
import $ from 'jquery';
import "./ongoingItem.scss";



export default class ongoingItem extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
			ORDER_ID : this.props.location.state.ORDER_ID,
			ONGOING_ORDER:[],
			ORDER_ITEMS:[]
		}
	}

	loadOrderInfo() {
		console.log(this.state.ORDER_ID);
		fetch(`http://localhost:4000/checkout/ongoingorder?orderId=${this.state.ORDER_ID}`)
		.then(res => res.json())
		.then(data=> {
			if(data.data) {
				this.setState({ONGOING_ORDER:data.data.order[0], ORDER_ITEMS: this.organizeData(data.data.orderItems)},()=>console.log(this.state.ORDER_ITEMS));
			}
		})
	}




	componentDidMount() {
		this.loadOrderInfo()
	}


	//******************************** Helper Functions *****************************************
		organizeData(data) {
		let uniqueData = [];

		data.forEach(item=> {
			if(uniqueData.some((uniqueItem,index)=>{
				if(uniqueItem.ORDER_ITEM_ID === item.ORDER_ITEM_ID) {
					uniqueData[index].DIFFERENT_TYPE.push(
						{
							ID: item.ID,
							EXPIRE_DATE: item.EXPIRE_DATE,
							SHELF_NO: item.SHELF_NO,
							MANUFACTURE: item.MANUFACTURE,
							QTY: item.QTY
						}
					);

					return true;
				}
				return false;
				})){
			}else {
				uniqueData.push(
					{
						ORDER_ITEM_ID: item.ORDER_ITEM_ID,
						ITEMNAME: item.ORDER_ITEM_PRODUCT,
						ORDER_ITEM_QTY: item.ORDER_ITEM_QTY,
						DIFFERENT_TYPE : 
						[
							{
								ID: item.ID,
								EXPIRE_DATE: item.EXPIRE_DATE,
								SHELF_NO: item.SHELF_NO,
								MANUFACTURE: item.MANUFACTURE,
								QTY: item.QTY
							}
						]
					}
				);	
			}
		});

		//SET DEFAULTVALUE
		uniqueData.map(item=>{
			let orderQty = item.ORDER_ITEM_QTY;
			item.DIFFERENT_TYPE.map(diffItem=>{
				diffItem.DEFAULTVALUE = diffItem.QTY > orderQty? orderQty : diffItem.QTY;
				orderQty -= diffItem.QTY > orderQty? orderQty : diffItem.QTY;
			})
		});

		return uniqueData;
	}


	pickUpQtyChange(e,itemId,diffId,diffKey,key) {
		e.preventDefault();

		if(parseInt($(`#${key}pickupQty${diffKey}`).val()) < 0 ) {
			$(`#${key}pickupQty${diffKey}`).val(0);
		}

		let items = this.state.ORDER_ITEMS;

		items.forEach(item => {
			item.DIFFERENT_TYPE.forEach(diffItem =>{
				if(diffItem.ID === diffId) {
					if(parseInt($(`#${key}pickupQty${diffKey}`).val()) > diffItem.QTY) {
						$(`#${key}pickupQty${diffKey}`).val(diffItem.QTY);
					}
					diffItem.DEFAULTVALUE = parseInt($(`#${key}pickupQty${diffKey}`).val());
				}
			});
		});

		this.setState({ORDER_ITEMS : items},()=>this.wanringChecker(this.state.ORDER_ITEMS,itemId,key));		
	}

	wanringChecker(items,itemId,key){
		console.log(items);
		items.forEach(item=> {
			if(itemId === item.ORDER_ITEM_ID){
				
				if(item.ORDER_ITEM_QTY != item.DIFFERENT_TYPE.reduce((acc,diffItem)=>acc+diffItem.DEFAULTVALUE,0)) {
					$(`#orderQty${key}`).addClass("warning");
				}else {
					$(`#orderQty${key}`).removeClass("warning");
				}
			}
		})
	}


	render() {
		return (
			<div className="ongoingItem-wrapper">
				<div className="header-section"></div>
				<div className="main-section container-fluid">
					<div className="order-info row ">
						<div className="col-6 col-md-2"><h4>Order No: {this.state.ORDER_ID}</h4></div>
						<div className="col-6 col-md-3"><h4>Customer: {this.state.ONGOING_ORDER.CUSTOMER}</h4></div>
						<div className="col-6 col-md-4"><h4>Time Received: {Moment(this.state.ONGOING_ORDER.ORDER_TIME).format('YYYY-MM-DD  h:mm:s')}</h4></div>
						<div className="col-6 col-md-3"><h4>Status: {this.state.ONGOING_ORDER.STATUS}</h4></div>
					</div>

					 {/*desktop display*/}
					<div className="order-detail-head row">
						<div className="col-5 col-md-5"><h3>Item</h3></div>
						<div className="col-1 col-md-1"><h3 className="text-center">Order Qty</h3></div>
						<div className="col-6 col-md-6">
							<div className="row">
								<div className="col-2"><h3 className="text-center">Shelf No.</h3></div>
								<div className="col-3"><h3 className="text-center">Manu.</h3></div>
								<div className="col-3"><h3 className="text-center">Exp Date</h3></div>
								<div className="col-2"><h3 className="text-center">Stock Qty</h3></div>
								<div className="col-2"><h3 className="text-center">PickUp Qty</h3></div>
							</div>
						</div>
					</div>

					{this.state.ORDER_ITEMS.map((item,key)=>
						<div className="row item-detail" key={key+1}>
							<div className="col-5 col-md-5"><h4>{item.ITEMNAME}</h4></div>
							<div id={`orderQty${key+1}`} className="col-1 col-md-1"><h4 className="text-center">{item.ORDER_ITEM_QTY}</h4></div>
							<div className="col-6 col-md-6">
								{item.DIFFERENT_TYPE.map((diffItem,diffKey)=>
								<div className="row" key={`diffKey${diffKey}`}>
									<div className="col-2"><h4 className="text-center">{diffItem.SHELF_NO}</h4></div>
									<div className="col-3"><h4 className="text-center">{diffItem.MANUFACTURE}</h4></div>
									<div className="col-3"><h4 className="text-center">{Moment(diffItem.EXPIRE_DATE).format('YYYY-MM-DD')}</h4></div>
									<div className="col-2"><h4 className="text-center">{diffItem.QTY}</h4></div>
									<div className="col-2 text-center"><input id={`${key+1}pickupQty${diffKey+1}`} type="number" className="pickupQty text-center" defaultValue={diffItem.DEFAULTVALUE} onChange={e => this.pickUpQtyChange(e,item.ORDER_ITEM_ID,diffItem.ID,diffKey+1,key+1)}></input></div>
								</div>
								)}
							</div>	
						</div>
					)}

					{/*mobile display*/}

					<div className="actionContainer">
						<label className="block">Note:</label>
						<textarea className="block"></textarea>
						<button type="button" className="block btn btn-success">Push</button>
					</div>
					
				</div>
			</div>
		);
	}
}
