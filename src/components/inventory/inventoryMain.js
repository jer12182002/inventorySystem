import React from 'react';

import Notification from './notificationView/notificationView';
import HoldItemsDisplay from './holdItemsDisplay/holdItemsDisplay';
import InventroyItemsDisplay from './inventoryItemDisplay/inventoryItemDisplay';


export default class inventoryMain extends React.Component {

	constructor(props) {
		super(props);


		let date = new Date();

		this.state = {
			accountInfo: this.props.accountInfo,
			allItems: [],
			allHoldItems: [],
			allNotificationItems: [],
			today: date.toISOString().slice(0, 10), 
			defaultExpiryDate : date.getFullYear() + "-" + ("0" + (date.getMonth() + 5)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
		}

		//this.loadAllHoldItems = this.loadAllHoldItems.bind(this);
	}

	componentDidMount() {
		this.loadAllItem();
		this.loadAllHoldItems();
	}
	

	loadAllItem(receviedFilter=''){
		fetch(`http://localhost:4000/inventory/loadAllItem?filter=${receviedFilter}`)
		.then(res => res.json())
		.then(data =>{

			if(data.data){
				this.setState({allItems: this.setStateWithRowSpan(data.data)});
			}	
		});
	}



	loadAllHoldItems() {
		fetch('http://localhost:4000/inventory/loadAllHoldItem')
		.then(res => res.json())
		.then(data =>{
			if(data.data){
				this.setState({allHoldItems: data.data});
			}			
		});
	}


	loadAllNotificationItems(dateValue = this.state.defaultExpiryDate,receviedFilter=''){
		fetch(`http://localhost:4000/inventory/loadAllItem?filter=${receviedFilter}`)
		.then(res => res.json())
		.then(data =>{

			if(data.data){
				let filteredItems = data.data.filter(item => item.EXPIRE_DATE <= dateValue);
				this.setState({allNotificationItems: this.setStateWithRowSpan(filteredItems)});
			}	
			
		});
	}


	updateItem(updatedItemInfo) {
		fetch(`http://localhost:4000/inventory/updateItems?updatedItem=${JSON.stringify(updatedItemInfo)}`)
		    .then(res =>res.json())
			.then(data => {
			   	if(data.data.affectedRows) {
					this.loadAllItem();
				}else {
					alert("Something went wrong !!");
				}
			}
		);
	}

	deleteItem (id){
		let deleteInfo = {};
		deleteInfo.ITEM_ID = id;
		deleteInfo.PERSON = this.state.accountInfo.USERNAME;
		console.log(deleteInfo);
		fetch(`http://localhost:4000/inventory/deleteItem?deleteInfo=${JSON.stringify(deleteInfo)}`)
		.then(res => res.json())
		.then(data =>{
			console.log(data);
			if(data.data === 'success') {
				this.loadAllItem();
				this.loadAllHoldItems(); 
			}else {
				alert("Something went wrong !!@@");
			}

		})
	}




	restockAction(item) {
		let restockInfo = {};

		restockInfo.ID = item.ID;
		restockInfo.ITEM_ID = item.ITEM_ID;
		restockInfo.HOLD_QTY = item.HOLD_QTY;
		restockInfo.PERSON = this.state.accountInfo.USERNAME;

		fetch(`http://localhost:4000/inventory/restockHold?restockInfo=${JSON.stringify(restockInfo)}`)
		.then(res => res.json())
		.then(data => {
			if(data.data === "success") {
				this.loadAllHoldItems();
				this.loadAllItem();
			}
		});
	}


//============================= Display Functions ===================================
	setStateWithRowSpan(recivedData){
		recivedData.map((data,index)=>{
	
			let rowSpan = 1;

			if(index != recivedData.length-1 
				&& recivedData[index+1].ENGLISH_NAME === data.ENGLISH_NAME 
				&& recivedData[index+1].CHINESE_NAME === data.CHINESE_NAME 
				&& recivedData[index+1].TYPE === data.TYPE) {
					rowSpan = recivedData.filter(r => r.ENGLISH_NAME === data.ENGLISH_NAME && r.CHINESE_NAME === data.CHINESE_NAME && r.TYPE === data.TYPE).length;
			}
			if(index>=1 
				&& recivedData[index-1].ENGLISH_NAME === data.ENGLISH_NAME 
				&& recivedData[index-1].CHINESE_NAME === data.CHINESE_NAME 	
				&& recivedData[index-1].TYPE === data.TYPE) {
					rowSpan = 0;
			}			
			data.ROWSPAN = rowSpan;		
		})
		return recivedData;
	}



	

	render() {
		//<InventroyItemsDisplay loggedUser = {this.state.accountInfo}/>
		//
		
		return (
			<div className= "inventorymain-wrapper">
				{this.state.accountInfo.VIEW_ITEM? 
				<div className = "invtory-viewable">
					{this.state.accountInfo.EXP_VIEW ?	
						<Notification loggedUser = {this.state.accountInfo}
									  allNotificationItems = {this.state.allNotificationItems}
									  defaultExpiryDate = {this.state.defaultExpiryDate}
									  loadAllNotificationItems = {this.loadAllNotificationItems.bind(this)}
									  setStateWithRowSpan = {this.setStateWithRowSpan.bind(this)}/>
					    :
					    null
					}

					<HoldItemsDisplay loggedUser = {this.state.accountInfo} 
									  allHoldItems= {this.state.allHoldItems} 
									  today = {this.state.today}
									  loadAllHoldItems = {this.loadAllHoldItems.bind(this)} 
									  loadAllItem = {this.loadAllItem.bind(this)} 
									  restockAction = {this.restockAction.bind(this)}/>

					<InventroyItemsDisplay loggedUser = {this.state.accountInfo} 
										   allItems = {this.state.allItems} 
										   today = {this.state.today}
										   loadAllItem = {this.loadAllItem.bind(this)} 
										   loadAllHoldItems = {this.loadAllHoldItems.bind(this)}
										   loadAllNotificationItems = {this.loadAllNotificationItems.bind(this)}
										   updateItem = {this.updateItem.bind(this)}
										   deleteItem = {this.deleteItem.bind(this)}
										   setStateWithRowSpan = {this.setStateWithRowSpan.bind(this)}/>
										   
				</div>
				:null
				}
			</div>
		);
	}
}
