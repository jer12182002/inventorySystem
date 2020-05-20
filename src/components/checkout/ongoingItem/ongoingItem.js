import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'moment';
import $ from 'jquery';
import "./ongoingItem.scss";



export default class ongoingItem extends React.Component {
	intervalName = "chkoutOrderNote";

	constructor(props) {
		super(props);	
		this.state = {
			accountInfo: this.props.location.state.accountInfo,
			ORDER_ID : this.props.location.state.ORDER_ID,
			ONGOING_ORDER:[],
			ORDER_ITEMS:[],
			ORDER_NOTES: [],
			ITEM_NOT_ENOUGH: null
		}
	}

	loadOrderInfo() {
		fetch(`http://localhost:4000/checkout/ongoingorder?orderId=${this.state.ORDER_ID}`)
		.then(res => res.json())
		.then(data=> {
			if(data.data) {
				this.setState({ONGOING_ORDER : data.data.order[0]});

				if(data.data.order[0].STATUS === "RECEIVED") {
					this.setState({ORDER_ITEMS: this.organizeData(data.data.orderItems)});
				}else if(data.data.order[0].STATUS === "PUSHED BACK"){
					this.setState({ORDER_ITEMS : this.organizeDataForPushBack(data.data.orderItems)});
				}
				else if(data.data.order[0].STATUS === "IN PROCESS"){
					this.loadPickupOrderInfo();
				}
				
			}
		})
	}


	loadPickupOrderInfo() {
		fetch(`http://localhost:4000/check/ongoingorder/inprocess?orderId=${this.state.ORDER_ID}`)
		.then(res => res.json())
		.then(data => {
			if(data.data){
				let orderItems = data.data.forEach(item => {
					let chineseName = item.ORDER_ITEM_PRODUCT.split(" ");
					chineseName = chineseName[chineseName.length-1];
				
					let englishName = item.ORDER_ITEM_PRODUCT.split(" " + chineseName);
					englishName = englishName[0];

					item.ITEMCHNAME = chineseName;
					item.ITEMENNAME = englishName;
					item.DIFFERENT_TYPE = JSON.parse(item.DIFFERENT_TYPE);
				});

				orderItems = data.data;
				this.setState({ORDER_ITEMS : orderItems});
			}
		});
	}


	loadNotes() {
		fetch(`http://localhost:4000/checkout/order/loadnotes?orderId=${this.state.ORDER_ID}`)
		.then(res => res.json())
		.then(data => {
			if(data.data) {
				this.setState({ORDER_NOTES : data.data});
			}
		})
	}

	



	pushItemToBack(){
		
		let orderInfo = {};

		orderInfo.ORDER_NO = this.state.ORDER_ID;
		orderInfo.ITEMS = this.state.ORDER_ITEMS;
		orderInfo.NOTE = $(`#note${this.state.ORDER_ID}`).val();
		orderInfo.ACCOUNTINFO = this.state.accountInfo.USERNAME;
		orderInfo.PROCESS_TIME = this.getTime();
		orderInfo.CURRENTSTATUS = this.state.ONGOING_ORDER.STATUS;

		orderInfo.NEXTSTATUS = "IN PROCESS";
		
		fetch(`http://localhost:4000/checkout/ongoingorder/pushtoprocess?orderInfo=${JSON.stringify(orderInfo)}`)
		.then(res => res.json())
		.then(data => {
			if(data.data && data.data === "success") {
				window.location.reload();
			}
		})

	}



	componentDidMount() {
		this.loadOrderInfo();

		//THIS IS TO MAKE SURE RECEIVING THE REAL TIME MESSAGES
		this.intervalName = setInterval((e)=>{
			this.loadNotes();
		},1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalName);
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
							QTY: item.QTY,
							TYPE: item.TYPE
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
								QTY: item.QTY,
								TYPE: item.TYPE
							}
						]
					}
				);	
			}
		});

		//SET PICKUPVALUE, SET TABLETQTY = 0, AND CHECK FOR SUFFICIENCY OF ITEMS
		uniqueData.forEach(item=>{
			let orderQty = item.ORDER_ITEM_QTY;
			let diffItemSum = 0;
			
			item.DIFFERENT_TYPE.forEach(diffItem=>{
				//CHECK IF WE THERE ARE SUFFICIENT ITEMS IN INVENTORY
				diffItemSum += diffItem.QTY;
				if(diffItem.ID === null) {
					this.setState({ITEM_NOT_ENOUGH : true});
				}else {
					diffItem.PICKUPVALUE = diffItem.QTY > orderQty? orderQty : diffItem.QTY;
					orderQty -= diffItem.QTY > orderQty? orderQty : diffItem.QTY;

					diffItem.TABLETQTY = 0;
				}
			})

			//CHECK IF THERE ARE SUFFICIENT ITEMS IN INVENTORY
			if(item.ORDER_ITEM_QTY > diffItemSum) {
				this.setState({ITEM_NOT_ENOUGH : true});
			}
		});

		return uniqueData;
	}





	organizeDataForPushBack (data) {
		let uniqueData = {};
		
		// This is to kill duplicates
		uniqueData = data.reduce((acc, item)=>{
			if(!acc.find(el=>el["ORDER_ITEM_PRODUCT"] === item["ORDER_ITEM_PRODUCT"])) {
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
			item.DIFFERENT_TYPE = JSON.parse(item.PICKUP_ITEMS);

		//This is to give the inventory QTY to diffItem
			item.DIFFERENT_TYPE.forEach(diffItem => {
				data.forEach(originalItem => {
					if(diffItem.ID === originalItem.ID) {
						diffItem.QTY = originalItem.QTY;

					}
				})
			})
		}); 	


		uniqueData.forEach(item=>{
			
			//CHECK IF THERE ARE SUFFICIENT ITEMS IN INVENTORY
			let diffItemSum = item.DIFFERENT_TYPE.reduce((acc, diffItem)=>acc + diffItem.QTY,0);

			if(item.ORDER_ITEM_QTY > diffItemSum) {
				this.setState({ITEM_NOT_ENOUGH : true});
			}
		});
		return uniqueData;
	} 




	getPickUpData(data){
		let pickupItems = new Set();

		data.filter(item => !pickupItems.has(item["ORDER_ITEM_ID"]) && pickupItems.add(item));
	

	}



	pickUpQtyChange(e,itemId,diffId,diffKey,key) {
		e.preventDefault();

		if(parseInt($(`#${key}pickupQty${diffKey}`).val()) < 0 ) {
			$(`#${key}pickupQty${diffKey}`).val(0);
		}

		if($(`#${key}tabletQty${diffKey}`).val() && parseInt($(`#${key}pickupQty${diffKey}`).val()) < parseInt($(`#${key}tabletQty${diffKey}`).val())) {
			$(`#${key}tabletQty${diffKey}`).val($(`#${key}pickupQty${diffKey}`).val());
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


	tabletQtyChange (e, itemId, diffId, diffKey, key) {
		e.preventDefault();

		let pickupQty = parseInt($(`#${key}pickupQty${diffKey}`).val());
		let tabletQty = parseInt($(`#${key}tabletQty${diffKey}`).val());

		if(tabletQty < 0) {
			$(`#${key}tabletQty${diffKey}`).val(0);			
		}else if(tabletQty > pickupQty) {
			$(`#${key}tabletQty${diffKey}`).val(pickupQty);			
		}
		
		let orderItems = this.state.ORDER_ITEMS;
		orderItems.forEach(item => {
			if(item.ORDER_ITEM_ID === itemId)
				item.DIFFERENT_TYPE.forEach(diffItem => {
					if(diffItem.ID === diffId) {
						diffItem.TABLETQTY = parseInt($(`#${key}tabletQty${diffKey}`).val());
					}
			})
		});

		this.setState({ORDER_ITEMS : orderItems});
	}

	getTime() {
		let today = new Date();
		today = today.getFullYear() + "-" + ("0" + (today.getMonth() +1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2) + " " + ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);

		return today;
	}

	wanringChecker(items,itemId,key){

		items.forEach(item=> {
			if(itemId === item.ORDER_ITEM_ID){
				
				if(item.ORDER_ITEM_QTY !== item.DIFFERENT_TYPE.reduce((acc,diffItem)=>acc+diffItem.PICKUPVALUE,0)) {
					$(`#orderQty${key}`).addClass("warning");
				}else {
					$(`#orderQty${key}`).removeClass("warning");
				}
			}
		})
	}


	pushBtnClicked(e){
		this.pushItemToBack();
	}


	deleteBtnClicked(e) {
		let note = $(`#note${this.state.ORDER_ID}`).val();

		if(!$.trim(note)) {
			alert("You must leave a note to delete this order");
		}else {
			let orderInfo = {};
			orderInfo.ORDER_ID = this.state.ORDER_ID;
			orderInfo.NOTE = note;
			orderInfo.PERSON = this.state.accountInfo.USERNAME;
			orderInfo.PROCESS_TIME = this.getTime();
			
			fetch (`http://localhost:4000/checkout/ongoingorder/deleteorder?orderInfo=${JSON.stringify(orderInfo)}`)
			.then(res=> res.json())
			.then(data => {
				if(data.data && data.data === 'success') {
					window.location.href="/checkout";
				}
			});
		}
	}

	noteInputBtnToggle() {
		$.trim($(`#note${this.state.ORDER_ID}`).val())? $("#deleteBtn").removeClass("disabled") :  $("#deleteBtn").addClass("disabled");
	}



	render() {
		this.loadNotes();
		return (
			<div className="ongoingItem-wrapper">
				<div className="header-section">
					<div className="order-info row ">
						<div className="col-6 col-lg-2"><h4>Order No: {this.state.ORDER_ID}</h4></div>
						<div className="col-6 col-lg-3"><h4>Customer: {this.state.ONGOING_ORDER.CUSTOMER}</h4></div>
						<div className="col-6 col-lg-4"><h4>Time Received: {Moment(this.state.ONGOING_ORDER.ORDER_TIME).format('YYYY-MM-DD  HH:mm:s')}</h4></div>
						<div className="col-6 col-lg-3"><h4>Status: {this.state.ONGOING_ORDER.STATUS}</h4></div>
					</div>
				</div>
				<div className="main-section container-fluid">
					 {/*desktop display*/}
					<div className="order-detail-head row">
						<div className="col-4 col-md-4"><h3>Item</h3></div>
						<div className="col-1 col-md-1"><h3 className="text-center">Order Qty</h3></div>
						<div className="col-7 col-md-7">
							<div className="row">
								<div className="col-2"><h3 className="text-center">Shelf No.</h3></div>
								<div className="col-2"><h3 className="text-center">Manu.</h3></div>
								<div className="col-2"><h3 className="text-center">Exp Date</h3></div>
								<div className="col-2"><h3 className="text-center">Stock Qty</h3></div>
								<div className="col-2"><h3 className="text-center">PickUp Qty</h3></div>
								<div className="col-2">
								{this.state.ONGOING_ORDER.STATUS === "RECEIVED" || this.state.ONGOING_ORDER.STATUS === "PUSHED BACK"?
									<h3 className="text-center">Tablet Qty</h3>:null
								}
								</div>
							</div>
						</div>
					</div>

					{this.state.ORDER_ITEMS.map((item,key)=>
						<div className="row item-detail" key={key+1}>
							<div className="col-4 col-md-4"><h4>{item.ITEMENNAME}</h4><h4>{item.ITEMCHNAME}</h4></div>
							<div id={`orderQty${key+1}`} className="col-1 col-md-1"><h4 className="text-center">{item.ORDER_ITEM_QTY}</h4></div>
							<div className="col-7 col-md-7">
								{item.DIFFERENT_TYPE.map((diffItem,diffKey)=>
								<div className="row" key={`diffKey${diffKey}`}>
									<div className="col-2"><h4 className="text-center">{diffItem.SHELF_NO}</h4></div>
									<div className="col-2"><h4 className="text-center">{diffItem.MANUFACTURE}</h4></div>
									<div className="col-2"><h4 className="text-center">{Moment(diffItem.EXPIRE_DATE).format('YYYY-MM-DD')}</h4></div>
									
									{this.state.ONGOING_ORDER.STATUS === "RECEIVED" || this.state.ONGOING_ORDER.STATUS === "PUSHED BACK"?
										<>
											<div className="col-2"><h4 className="text-center">{diffItem.QTY}</h4></div>
											<div className="col-2 text-center"><input id={`${key+1}pickupQty${diffKey+1}`} type="number" className="pickupQty text-center" defaultValue={diffItem.PICKUPVALUE} min="0" onChange={e => this.pickUpQtyChange(e,item.ORDER_ITEM_ID,diffItem.ID,diffKey+1,key+1)}></input></div>
											{diffItem.TYPE === "Single" || diffItem.TYPE === "Formula"? 
											<div className="col-2 text-center"><input id={`${key+1}tabletQty${diffKey+1}`} type="number" className="tabletQty text-center" defaultValue={diffItem.TABLETQTY} min="0" onChange={e => this.tabletQtyChange(e,item.ORDER_ITEM_ID,diffItem.ID,diffKey+1,key+1)}></input></div>		
											:
											null
											}
										</>
										:
										<>
											<div className="col-2"><h4 className="text-center">{diffItem.PICKUPVALUE}</h4></div> 
											
											{diffItem.TYPE === "Single" || diffItem.TYPE === "Formula"? 
												<>
													<div className="col-2"><h4 className="text-center">{diffItem.TABLETQTY}</h4></div>
													<div className="col-2"><h4 className="text-center warning">{diffItem.TABLETQTY > 0 ? "!" : ""}</h4></div> 
												</>
											:
												<div className="col-2"><h4 className="text-center">{diffItem.TYPE}</h4></div>
											}
										</>
									}
								</div>
								)}
							</div>	
						</div>
					)}

					{/*mobile display*/}



					<div className="noteContainer">
						{this.state.ORDER_NOTES.map((note,key) =>
							<div className={`container-fluid note-row ${key === 0? `firstRow`:``}`} key={`note${key+1}`}>
								<div className="row note-header">
									<div className="col-4 col-md-4 text-center"><h4>Time: {Moment(note.TIME).format('YYYY-MM-DD HH:mm:ss')}</h4></div>
									<div className="col-4 col-md-4 text-center"><h4>Author: {note.PERSON}</h4></div>
									<div className="col-4 col-md-4 text-center"><h4>Status: {note.STATUS}</h4></div>
								</div>
								<div className="note-info">
									<h4>{note.NOTE}</h4>
								</div>
							</div>
						)}
					</div>

					<div className="actionContainer">
						<label className="block">Note:</label>
						<textarea id={`note${this.state.ORDER_ID}`} className="block" onKeyUp={this.noteInputBtnToggle()}></textarea>
						{this.state.ITEM_NOT_ENOUGH? 
							this.state.accountInfo.VIEW_ITEM &&	this.state.accountInfo.ADD_ITEM?
								<Link className ="btn btn-warning" to="/inventory">Add Item</Link>
								:
								<h3>Please report this problem to the correspondant.</h3>

							:
							<button type="button" className="block btn btn-success" onClick = {e => this.pushBtnClicked(e)}>
								{this.state.ONGOING_ORDER.STATUS === "RECEIVED" || this.state.ONGOING_ORDER.STATUS === "PUSHED BACK"? "Push" : "Add Note"}
							</button>
						}
						{this.state.ONGOING_ORDER.STATUS === "IN PROCESS"? 
							null: <button id="deleteBtn" type="button" className="block btn btn-danger disabled" onClick = {e => this.deleteBtnClicked(e)}>Delete</button>
						}
						
					</div>
					
				</div>
			</div>
		);
	}
}
