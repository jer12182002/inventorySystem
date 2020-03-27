import React from 'react';
import './inventoryControlPanel.scss';


import $ from 'jquery';
export default class inventoryControlPanel extends React.Component {



	clickAddBtn (e){
		e.preventDefault();

		let newItem = {};

		if($("#addType").val()
		   && $.trim($("#addShelf").val()) 
		   && $.trim($("#addManufact").val())
		   && $.trim($("#addENName").val())
		   && $.trim($("#addCHName").val())
		   && $.trim($("#addQty").val())
		   && $.trim($("#addExp").val())
		   && $.trim($("#addGram").val())
		   ){
			newItem.type = $("#addType").val();
			newItem.shelfNo = $.trim($("#addShelf").val().toUpperCase());
			newItem.manufacturer = $.trim($("#addManufact").val());
		   	newItem.ENname = $.trim($("#addENName").val());
		   	newItem.CHname = $.trim($("#addCHName").val());
		   	newItem.qty = $.trim($("#addQty").val());
		   	newItem.exp = $.trim($("#addExp").val());
		    newItem.gram = $.trim($("#addGram").val()); 
		    newItem.createdBy = this.props.loggedUser;

		    fetch(`http://localhost:4000/inventory/addNewItem?newItem=${JSON.stringify(newItem)}`)
		    .then(res => res.json())
		    .then(data => {
		    	if(data.data === 'success') {
		    		window.location.reload();
		    	}
		    });

		}else {
			alert("You are missing some information about new Item, please fill in");
		}
	}



	filterItem(){
		this.props.filterDisplay($.trim($("#itemFilter").val().toUpperCase()));
	}




	filterDisplayBtnClick(e){
		e.preventDefault();
		this.props.saveDisplayClearBtnInChild('display');
		$('.saveFilter-container').addClass('display-none');
		$('.clearDisplayFilter-container').removeClass('display-none');
	}

	filterClearBtnClick(e){
		e.preventDefault();
		this.props.saveDisplayClearBtnInChild('clear');
		$('.clearDisplayFilter-container').addClass('display-none');
		$('.saveFilter-container').removeClass('display-none');
	}




	render() {	
		console.log(this.props.loggedUser);
		return (
			<div className="controlPanel-wrapper">
				<div className="main-section">
					<div className="inline-b">
						<label>Type:</label>
						<select id="addType">
						{this.props.types.map((type,keyIndex)=>
							<option key={keyIndex}>{type.ITEM_TYPE}</option>					
						)}
						</select>

						<label>Shelf No.:</label>
						<input id="addShelf" type="text"></input>

						<label>Manaufacturer:</label>
						<input id="addManufact" type="text"></input>

						<label>En Name:</label>
						<input id="addENName" type="text"></input>

						<label>CH Name:</label>
						<input id="addCHName" type="text"></input>

						<label>QTY:</label>
						<input id="addQty" type="number"></input>

						<label>Exp:</label>
						<input id="addExp" type="date"></input>

						<label>Gram: </label>
						<input id="addGram" type="number"></input>

						<button id="addBtn" className="btn btn-success" onClick = {(e)=>{this.clickAddBtn(e)}}>Add</button>
					</div>

					<div className="inline-f filter-Section">
						<input id="itemFilter" type="text" onChange= {this.filterItem.bind(this)}/>
						
						<div className="saveFilter-container">
							<button id="displayFilter" type="button" className="btn btn-success" onClick={(e)=>this.filterDisplayBtnClick(e)}>Display</button>
						</div>
						<div className="clearDisplayFilter-container display-none">
							<button id="clearDisplayFilter"type="button" className="btn btn-success" onClick={(e)=>this.filterClearBtnClick(e)}>Clear</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
