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
			selectedPrecursor_id: ''
		}
	}

	componentDidMount() {
		//load all precursors and items from database
		this.loadAllItems();
		this.loadAllPrecursors();

	}

	loadAllItems(receviedFilter='') {
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


	updateSelectPrecursorId(e, id){
		e.preventDefault();
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
			 		this.precursorActionFinished("Added");
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
			 		this.precursorActionFinished("Updated");
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
						this.precursorActionFinished("Deleted");
					}
				})
			}else {
				alert("Wrong precursor, please check your input");
			}
		}
	}

	precursorActionFinished(status) {
		alert(status);
		this.loadAllPrecursors();
		$(".hidden-btns").addClass('display-none');
		this.setState({selectedPrecursor_id : ''});
		$("#precursor").val("");
		$("#precursor-ration").val("");
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
					/>
					<h2>display</h2>
				</div>
			</div>
		);
	}
}
