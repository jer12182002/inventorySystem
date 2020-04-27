import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';
import $ from 'jquery';
import "./ongoingItem.scss";



export default class ongoingItem extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
			accountInfo: this.props.location.state.accountInfo,
			ORDER_ID : this.props.location.state.ORDER_ID,
			ONGOING_ORDER:[],
			ORDER_ITEMS:[],
			EMPTY_ITEM: null
		}
	}

	loadOrderInfo() {
		fetch(`http://localhost:4000/checkout/ongoingorder?orderId=${this.state.ORDER_ID}`)
		.then(res => res.json())
		.then(data=> {
			if(data.data) {
				this.setState({ONGOING_ORDER:data.data.order[0], ORDER_ITEMS: this.organizeData(data.data.orderItems)},()=>console.log(this.state.ORDER_ITEMS));
			}
		})
	}


	pushItemToBack(){
		//update person and status in ongoing_order
		//update ITEM_ID, ITEM_QTY, STATUS IN order_item_list
		//insert into checkoutNote

		let today = new Date();
		today = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getMinutes();
	
		let orderInfo = {};

		orderInfo.ORDER_NO = this.state.ORDER_ID;
		orderInfo.ITEMS = this.state.ORDER_ITEMS;
		orderInfo.NOTE = $(`#note${this.state.ORDER_ID}`).val();
		orderInfo.ACCOUNTINFO = this.state.accountInfo.USERNAME;
		orderInfo.PROCESS_TIME = today;
		
		console.log(orderInfo);
		fetch(`http://localhost:4000/checkout/ongoingorder/pushtoback?orderInfo=${JSON.stringify(orderInfo)}`)
		.then(res => res.json())
		.then(data => {})
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
				let chineseName = item.ORDER_ITEM_PRODUCT.split(" ");
				chineseName = chineseName[chineseName.length-1];
				
				let englishName = item.ORDER_ITEM_PRODUCT.split(" " + chineseName);
				englishName = englishName[0];
			
				uniqueData.push(
					{
						ORDER_ITEM_ID: item.ORDER_ITEM_ID,
						ITEMNAME: item.ORDER_ITEM_PRODUCT,
						ITEMCHNAME: chineseName,
						ITEMENNAME: englishName,
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

		//SET PICKUPVALUE
		uniqueData.map(item=>{
			let orderQty = item.ORDER_ITEM_QTY;

			item.DIFFERENT_TYPE.map(diffItem=>{
				if(diffItem.ID === null) {
					this.setState({EMPTY_ITEM : true});
				}else {
					diffItem.PICKUPVALUE = diffItem.QTY > orderQty? orderQty : diffItem.QTY;
					orderQty -= diffItem.QTY > orderQty? orderQty : diffItem.QTY;
				}
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
					diffItem.PICKUPVALUE = parseInt($(`#${key}pickupQty${diffKey}`).val());
				}
			});
		});

		this.setState({ORDER_ITEMS : items},()=>this.wanringChecker(this.state.ORDER_ITEMS,itemId,key));		
	}



	wanringChecker(items,itemId,key){
		console.log(items);
		items.forEach(item=> {
			if(itemId === item.ORDER_ITEM_ID){
				
				if(item.ORDER_ITEM_QTY != item.DIFFERENT_TYPE.reduce((acc,diffItem)=>acc+diffItem.PICKUPVALUE,0)) {
					$(`#orderQty${key}`).addClass("warning");
				}else {
					$(`#orderQty${key}`).removeClass("warning");
				}
			}
		})
	}



	pushBtnClicked(e){
		console.log(this.state.ORDER_ITEMS);
		this.pushItemToBack();
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
							<div className="col-5 col-md-5"><h4>{item.ITEMENNAME}</h4><h4>{item.ITEMCHNAME}</h4></div>
							<div id={`orderQty${key+1}`} className="col-1 col-md-1"><h4 className="text-center">{item.ORDER_ITEM_QTY}</h4></div>
							<div className="col-6 col-md-6">
								{item.DIFFERENT_TYPE.map((diffItem,diffKey)=>
								<div className="row" key={`diffKey${diffKey}`}>
									<div className="col-2"><h4 className="text-center">{diffItem.SHELF_NO}</h4></div>
									<div className="col-3"><h4 className="text-center">{diffItem.MANUFACTURE}</h4></div>
									<div className="col-3"><h4 className="text-center">{Moment(diffItem.EXPIRE_DATE).format('YYYY-MM-DD')}</h4></div>
									<div className="col-2"><h4 className="text-center">{diffItem.QTY}</h4></div>
									<div className="col-2 text-center"><input id={`${key+1}pickupQty${diffKey+1}`} type="number" className="pickupQty text-center" defaultValue={diffItem.PICKUPVALUE} onChange={e => this.pickUpQtyChange(e,item.ORDER_ITEM_ID,diffItem.ID,diffKey+1,key+1)}></input></div>
								</div>
								)}
							</div>	
						</div>
					)}

					{/*mobile display*/}

					<div className="actionContainer">
						<label className="block">Note:</label>
						<textarea id={`note${this.state.ORDER_ID}`} className="block"></textarea>
						{this.state.EMPTY_ITEM? 
							this.state.accountInfo.VIEW_ITEM &&	this.state.accountInfo.ADD_ITEM?
								<Link className ="btn btn-warning" to="/inventory">Add Item</Link>
								:
								<h3>Please report this problem to the correspondant.</h3>

							:
							<button type="button" className="block btn btn-success" onClick = {e => this.pushBtnClicked(e)}>Push</button>
						}
					</div>
					
				</div>
			</div>
		);
	}
}
