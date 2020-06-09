import React from 'react';
import './addItem.scss';

import BulkItemImporter from'./bulkItemImporter/bulkItemImporter';

import $ from 'jquery';
export default class addItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedUser: this.props.loggedUser,
			types:[]
		}
	}


	loadTypeSelect(){
		fetch(`${process.env.REACT_APP_INVENTROY_API}/inventory/loadSelect`)
		.then(res => res.json())
		.then(datas => {
			this.setState({types: datas.data});
		});
	}


	componentDidMount() {
		this.loadTypeSelect();
	}


	clickAddBtn (e){
		e.preventDefault();

		let newItem = {};

		if($("#addType").val()
		   && $.trim($("#addShelf").val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '')) 
		   && $.trim($("#addManufact").val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ''))
		   && $.trim($("#addENName").val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ''))
		   && $.trim($("#addCHName").val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ''))
		   && $.trim($("#addQty").val())
		   && $.trim($("#addExp").val())
		   && $.trim($("#addGram").val())
		){
			
			newItem.type = $("#addType").val();
			newItem.shelfNo = $.trim($("#addShelf").val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toUpperCase());
			newItem.manufacturer = $.trim($("#addManufact").val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toUpperCase());
		   	newItem.ENname = $.trim($("#addENName").val().toLowerCase().replace(/\s\s/g, '').replace(/[^a-zA-Z0-9-]+(.)/g, (m, chr) => ' '+ chr.toUpperCase())).replace(/^[a-z]/g,c => c.toUpperCase());
		   	newItem.CHname = ($.trim(data[i].data[4].toString().split("").filter(char => /\p{Script=Han}/u.test(char)).join("")))+$.trim(data[i].data[4].toString().replace(/[^0-9]/gi,''));
		   	newItem.qty = $.trim($("#addQty").val());
		   	newItem.exp = $.trim($("#addExp").val());
		    newItem.gram = $.trim($("#addGram").val()); 
		    newItem.createdBy = this.props.loggedUser.USERNAME;

		    fetch(`${process.env.REACT_APP_INVENTROY_API}/inventory/addNewItem?newItem=${JSON.stringify(newItem)}`)
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


	addItemClick(e) {
		$(".controlPanel-functions").addClass("display-none");
		$(".addItem-wrapper").removeClass("display-none");
		$(".addItem-input-container").removeClass("display-none");
		$(".addFunctonBtns-container").removeClass("display-none");
		$("#addItem-btn").addClass("display-none");
	}

	addCancelClick(e) {
		$(".controlPanel-functions").removeClass("display-none");
		$(".addItem-input-container").addClass("display-none");
		$(".addFunctonBtns-container").addClass("display-none");
		$("#addItem-btn").removeClass("display-none");
	}

	render() {
		return (
			<div className="addItem-wrapper controlPanel-functions">
				<div className="addItem-input-container main-function display-none">
					<div className="inline-b">

						<label>Name:</label>
						<input id="addENName" type="text"></input>

						<label>商品名稱:</label>
						<input id="addCHName" type="text"></input>

						<label>Type:</label>
						<select id="addType">
						{this.state.types.map((type,keyIndex)=>
							<option key={keyIndex}>{type.ITEM_TYPE}</option>					
						)}
						</select>

						<label>Shelf No.:</label>
						<input id="addShelf" type="text"></input>

						<label>Mfr.:</label>
						<input id="addManufact" type="text"></input>

						
						<label>QTY:</label>
						<input id="addQty" type="number"></input>

						<label>Exp:</label>
						<input id="addExp" type="date"></input>

						<label>Gram: </label>
						<input id="addGram" type="number"></input>

					</div>
				</div>
				<div className="action-area">
					<button id="addItem-btn"className="btn btn-primary" onClick = {e => this.addItemClick(e)}>Add Item</button>
					<div className = "addFunctonBtns-container inline-b display-none">
						<button id="addBtn" className="btn btn-success" onClick = {(e)=>{this.clickAddBtn(e)}}>Add</button>
						<BulkItemImporter loggedUser={this.state.loggedUser} types={this.state.types}/>
						<button className = "btn btn-warning" onClick = {e=> this.addCancelClick(e)}>Cancel</button>
					</div>
				</div>
			</div>
		);
	}
}
