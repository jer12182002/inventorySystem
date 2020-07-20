import React from 'react';
import './precursor.scss';
import PrecursorControlPanel from './precursorControlPanel/precursorControlPanel';
import PrecursorItemsControlPanel from './precursorItemsControlPanel/precursorItemsControlPanel';

import $ from 'jquery';

export default class precursor extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			allItems:[],
			allPrecursorItems:[],
			precursors:[], 
			precursorItems:[],
			selectedPrecursor_id: '', 
			newPrecursorItem:'', 
			selectedPrecursorItem_id:'', 
			orderDetails: [], 
			orderDetailsDisplay:[], 
			startDate : `${new Date().getFullYear()}-01-01`,
			endDate: new Date().toISOString().slice(0, 10)
		}
	}

	componentDidMount() {
		//load all precursors and items from database
		this.resetState();
		this.loadAllItems();
		this.loadAllPrecursors();
		this.loadOrderDetails();

	}


	resetState() {
		this.setState({
			allItems:[],
			allPrecursorItems:[],
			precursors:[], 
			precursorItems:[],
			selectedPrecursor_id: '', 
			newPrecursorItem:'', 
			selectedPrecursorItem_id:'',
			orderDetails: [],
			orderDetailsDisplay:[]
		})
	}


	loadAllItems(receviedFilter='') {
		console.log("loadAllITEMS");
		fetch(`http://localhost:4000/inventory/loadAllItem?filter=${receviedFilter}`)
			.then(res => res.json())
			.then(data =>{
				if(data.data){
					let allItems = [];

					data.data.forEach(item => {
						if(allItems.findIndex(x => x ===`${item.ENGLISH_NAME} ${item.CHINESE_NAME}`) === -1) {
							allItems.push(`${item.ENGLISH_NAME} ${item.CHINESE_NAME}`);
						}
					})
					
					this.setState({allItems: allItems});
				}	
		});
	}

	loadAllPrecursors() {
		console.log("loadAllPrecursors");
		fetch(`http://localhost:4000/report/precursor/loadallprecursors`)
		.then(res => res.json())
		.then(data => {
			if(data && data.data) {
			this.setState(	
							{ 
								allPrecursorItems: data.data,
								precursors: this.organizePrecursorsData(data.data)
							}

						);
							  
			}
		})
	}


	loadOrderDetails() {
		console.log("Load order Details");

		fetch(`http://localhost:4000/report/precursor/displayreport`)
		.then(res => res.json())
		.then(data => {
			if(data.data) {
				data.data.forEach(order => {
					order.PICKUP_ITEMS = JSON.parse(order.PICKUP_ITEMS);
					order.PROCESS_TIME = new Date(order.PROCESS_TIME).toISOString().slice(0, 10);
				});

				this.setState({orderDetails: data.data, orderDetailsDisplay: this.organizeOrderDetails(data.data)});
			}
		})
	}



	organizePrecursorsData(data) {
		let precursorsArr = [];
		
		data.forEach(precursor =>{
				let index = precursorsArr.findIndex(x => x.ID === precursor.ID);

				if( index === -1) {
					precursorsArr.push(
						{
							ID: precursor.ID, 
							PRECURSOR: precursor.NAME, 
							PRECURSOR_ITEMS: [
							{
							 	ITEM_ID: precursor.ITEM_ID,
							 	ITEM_NAME: precursor.ITEM_NAME,
							 	RATION: precursor.RATION
							}
							]
						}
					);
				}else {
					precursorsArr[index].PRECURSOR_ITEMS.push(
						{
							ITEM_ID: precursor.ITEM_ID,
							ITEM_NAME: precursor.ITEM_NAME,
							RATION: precursor.RATION
						}
					);
				}
			}
		);

		return precursorsArr;
	}



	organizeOrderDetails(startDate = this.state.startDate, endDate = this.state.endDate) {

		return this.state.orderDetails.filter(orderDetails => orderDetails.PROCESS_TIME >= startDate && orderDetails.PROCESS_TIME <= endDate);
	}


	//========================================Precursor============================================================

	updateSelectPrecursorId(id){
		this.setState(
						{
							selectedPrecursor_id:id, 
							precursorItems: this.state.allPrecursorItems.filter(item => item.ID === id)
						}
					);
	}

	
	precursorAction(e, action) {
		e.preventDefault();

		let precursor = $.trim($("#precursor").val().toLowerCase().replace(/\s\s/g, '').replace(/[^a-zA-Z]/g,''));

		if(action === "add") {
			this.precursorActionAdd(precursor);
		}else if (action === "update") {
			this.precursorActionUpdate(precursor);
		}else if(action ==="delete") {
			this.precursorActionDelete(precursor);
		}
	}


	precursorActionAdd(precursor) {
		if(precursor) {
			fetch(`http://localhost:4000/report/precursor/addprecursor`,
			  	{	
			  		method:'POST',  
			    	headers: {
			    	    'Content-Type': 'application/json'
			    	},
			    	body: JSON.stringify({
			    		precursor: precursor
			    	})
			    }
			).then(res => res.json())
			.then(data => {
			 	if(data.data && data.data === "success") {
			 		this.refreshDataAfterAction("Added");
			 	}
			})
		}else {
			alert("Please put in valid information");
		}
	}


	precursorActionUpdate (precursor) {
		if(precursor) {
			fetch(`http://localhost:4000/report/precursor/updateprecursor`, 
				{
					method:'POST', 
					headers: {
						'Content-Type':'application/json'
					}, 
					body: JSON.stringify({
						precursor : {
							precursor_id : this.state.selectedPrecursor_id, 
							newName : precursor
						}
					})

				}
			)
			.then(res => res.json())
			.then(data => {
				if(data.data && data.data === "success") {
			 		this.refreshDataAfterAction("Updated");
			 	}	
			})
		}
	}



	precursorActionDelete(precursor){
		if(precursor) {
			let precursorWithItemsToDelete = [];

			this.state.precursors.forEach(precursorList => {
				if(precursorList.PRECURSOR === precursor) {
					precursorWithItemsToDelete.push(precursorList);
				}
			})

			if(precursorWithItemsToDelete.length) {
				console.log(precursorWithItemsToDelete);
				fetch('http://localhost:4000/report/precursor/deleteprecursor',
					{
						method:'POST',
						headers:{
							'Content-Type':'application/json'
						},
						body: JSON.stringify({
							precursor: precursorWithItemsToDelete	
						})
					}
				)
				.then(res => res.json())
				.then(data => {
					if(data.data && data.data === "success") {
						this.refreshDataAfterAction("Deleted");
					}
				})
			}else {
				alert("Wrong precursor, please check your input");
			}
		}
	}

	

	//=====================================Precursor New Item============================================================
	updateSelectPrecursorItem(item) {
		this.setState({newPrecursorItem : item});
	}

	updateSelectedPrecursorItem_idToBeRemoved(id) {
		this.setState({selectedPrecursorItem_id : id});
	}


	addPrecursorItemClick (e) {
		let ration = $("#precursor-ration").val();

		if(this.state.selectedPrecursor_id && this.state.newPrecursorItem && ration) {
			fetch('http://localhost:4000/report/precursor/addnewprecursoritem', 
				{
					method : "POST", 
					headers : {
						"Content-Type":"application/json"
					}, 
					body : JSON.stringify({
						precursor : {
							precursorID : this.state.selectedPrecursor_id, 
							newItem : this.state.newPrecursorItem, 
							ration: ration
						}
					})
				}
			)
			.then(res => res.json())
			.then(data => {
				if(data.data && data.data === 'success') {
					this.refreshDataAfterAction("Added");
				}
			});
		}else {
			alert("Invalid input, please check you have clicked the PRECURSOR, ITEM to be added, and tpye in ration");
		}
	}



	removePrecursorItemClick (e) {
		e.preventDefault();

		fetch('http://localhost:4000/report/precursor/removeprecursoritem', {
			method : "POST", 
			headers: {
				"Content-Type" : "application/json"
			}, 
			body : JSON.stringify({
				precursorItem : {
					ID : this.state.selectedPrecursorItem_id
				}
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.data && data.data === "success") {
				this.refreshDataAfterAction("Removed");
				
			}
		})
	}



	refreshDataAfterAction(status) {
		alert(status);
		this.componentDidMount();
		$("#precursor").val("");
		$("#allItemSearch").val("");
		$("#precursor-ration").val("");
	}



	//=============================Date on change========================================================
 	dateOnChangeClicked(e) {
 		e.preventDefault();
 		
 		if($("#startDate").val() >= $("#endDate").val()) {
 			alert("@#@!#");
 			$("#startDate").val(this.state.startDate);
 			$("#endDate").val(this.state.endDate);
 		}

 		this.setState({
 			startDate : $("#startDate").val(),
			endDate : $("#endDate").val(),
			orderDetailsDisplay : this.organizeOrderDetails( $("#startDate").val(),$("#endDate").val())
 		})
 		
 		console.log(this.organizeOrderDetails( $("#startDate").val(),$("#endDate").val()));
 	}




	render() {
		return (
			<div className="precursor-wrapper">
				<div className="head-section text-center">
					<h1>Precursor Report</h1>
				</div>
				<div className="main-section">
					<PrecursorControlPanel 
						precursors = {this.state.precursors}
						selectedPrecursor_id = {this.state.selectedPrecursor_id}
						updateSelectPrecursorId = {this.updateSelectPrecursorId.bind(this)}
						precursorAction={this.precursorAction.bind(this)}/>

					<PrecursorItemsControlPanel
						allItems = {this.state.allItems}
						precursorItems = {this.state.precursorItems}
						loadAllItems={this.loadAllItems.bind(this)}
						updateSelectPrecursorItem = {this.updateSelectPrecursorItem.bind(this)}
						addPrecursorItemClick = {this.addPrecursorItemClick.bind(this)}
						updateSelectedPrecursorItem_idToBeRemoved = {this.updateSelectedPrecursorItem_idToBeRemoved.bind(this)}
						removePrecursorItemClick = {this.removePrecursorItemClick.bind(this)}
					/>


					<div className="precursor-display-section text-center">
						{this.state.selectedPrecursor_id === '' ?
							<h2>Please choose precursor to generate report</h2>
							:
							<>
							<h2>display</h2>
							<div className="precursorDisplay-header">
								<input id = "startDate" type="date" defaultValue={this.state.startDate} onChange = {e => this.dateOnChangeClicked(e)}></input>
								<input id = "endDate" type="date" defaultValue={this.state.endDate} onChange = {e => this.dateOnChangeClicked(e)}></input>
							</div>
							<div className="precursorDisplay-body">
							</div>
							</>
						}
					</div>

				</div>
			</div>
		);
	}
}
