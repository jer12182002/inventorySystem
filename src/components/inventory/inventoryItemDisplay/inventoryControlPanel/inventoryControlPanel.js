import React from 'react';
import './inventoryControlPanel.scss';
import BulkItemImporter from'./bulkItemImporter/bulkItemImporter';

import $ from 'jquery';


export default class inventoryControlPanel extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			loggedUser: this.props.loggedUser,
			defaultAllItems:[],
			allItems:[],
			checkedId:[]
		}
		this.loadAllItem('',true);
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
		   	newItem.CHname = $.trim($("#addCHName").val().replace(/\s\s/g, ''));
		   	newItem.qty = $.trim($("#addQty").val());
		   	newItem.exp = $.trim($("#addExp").val());
		    newItem.gram = $.trim($("#addGram").val()); 
		    newItem.createdBy = this.props.loggedUser.USERNAME;

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

	//===============================Load Data========================================
	loadAllItem(receviedFilter='',defaultCall=false){
		fetch(`http://localhost:4000/inventory/loadAllItem?filter=${receviedFilter}`)
		.then(res => res.json())
		.then(data =>{
			if(data) {
				if(defaultCall) {
					this.setState({defaultAllItems:data.data});
				}

				data.data.forEach(item=>{
					if(this.state.checkedId.includes(item.ID)){
							item.checked = true;
					}
				});

				this.setState({allItems: data.data});
			}
		});
	}

	setDefault(){
		this.setState({checkedId:[]});
		this.loadAllItem('',true);
		this.props.filterCall(this.state.allItems);
		$('.checkBoxDisplay:checkbox').prop('checked', false).removeAttr('checked');
	}
	//================================================================================




	//===============================Event Listener===================================
	filterItemOnChange(){
		this.loadAllItem($.trim($("#itemFilter").val().toUpperCase()));
	}



	filterBtn(){
		if($("#filterBtn").text()==="Filter"){
			$("#itemFilter").removeClass("display-none");
			$(".selectfilter-container").removeClass("display-none");
			$("#filterBtn").text("Close");
		}else {
			$("#itemFilter").addClass("display-none");
			$(".selectfilter-container").addClass("display-none");
			$("#filterBtn").text("Filter");
			$("#showBtn").addClass("display-none");
			this.setDefault();	
		}
	}



	hideBtn(e) {
		e.preventDefault();
		$("#showBtn").removeClass("display-none");
		$(".selectfilter-container").addClass("display-none");
	}


	showBtn(e) {
		e.preventDefault();
		$(".selectfilter-container").removeClass("display-none");
		$("#showBtn").addClass("display-none");	
	}




	selectCheckBox(e,id){
		e.stopPropagation();

	 	let checkedIdArray = this.state.checkedId;

	 	let checkedItems = [];


	    if($(`#checkbox${id}`).prop("checked")){
	     		checkedIdArray.push(id);   // push in anyway, then delete the duplicate later
	    }else {
	    	checkedIdArray = checkedIdArray.filter(ele => {
	    		return ele !== id;
	    	});
	    }

	    checkedIdArray = checkedIdArray.filter((v,i)=>checkedIdArray.indexOf(v)===i);  // delete the duplicate

	   
	    this.state.defaultAllItems.forEach(item=>{
	    	if(checkedIdArray.includes(item.ID)){
	    		checkedItems.push(item);
	    	}
	    });

		this.setState({checkedId:checkedIdArray});
		this.props.filterCall(checkedItems);
	}



	//=============================================================================

	render() {	
		return (
			<div className="controlPanel-wrapper">
				<div className="main-section">

				{this.props.loggedUser.ADD_ITEM? 
					<>
					<div className="inline-b">
						<label>Type:</label>
						<select id="addType">
						{this.props.types.map((type,keyIndex)=>
							<option key={keyIndex}>{type.ITEM_TYPE}</option>					
						)}
						</select>

						<label>Shelf No.:</label>
						<input id="addShelf" type="text"></input>

						<label>Manu:</label>
						<input id="addManufact" type="text"></input>

						<label>Name:</label>
						<input id="addENName" type="text"></input>

						<label>商品名稱:</label>
						<input id="addCHName" type="text"></input>

						<label>QTY:</label>
						<input id="addQty" type="number"></input>

						<label>Exp:</label>
						<input id="addExp" type="date"></input>

						<label>Gram: </label>
						<input id="addGram" type="number"></input>

						<button id="addBtn" className="btn btn-success" onClick = {(e)=>{this.clickAddBtn(e)}}>Add</button>
						<BulkItemImporter loggedUser={this.state.loggedUser} types={this.props.types}/>
					</div>
					</>
					:null}
					
					<div className="inline-f filter-Section">
						<input id="itemFilter" type="text" className="display-none" onChange= {e=>this.filterItemOnChange(e)}/>
						<button id="showBtn" type="button" className="display-none" onClick={e=>this.showBtn(e)}>Show</button>
						<button id="filterBtn" type="button" className="btn btn-warning" onClick={e=>this.filterBtn(e)}>Filter</button>
					</div>
				</div>

				<div className="selectfilter-container block display-none" >
					
					<div className="selectAll">
						<h3 className="inline-b">CheckItem</h3>
						<button id="hideBtn" type="button" onClick={e=>this.hideBtn(e)}>Hide</button>
					</div>
						
					<ul className="scroll-container">
						{this.state.allItems.map((item,key)=>
							<li key={`${key}${item.ID}`}>
								<input key={`${key}${item.ID}`} id={`checkbox${item.ID}`} className="checkBoxDisplay inline-b" type="checkbox" defaultChecked={item.checked} onChange={e=>this.selectCheckBox(e,item.ID)}/>	
								<p className="inline-b">{item.ENGLISH_NAME}-{item.CHINESE_NAME}<br/>
								{this.state.loggedUser.EXP_VIEW?<strong>{item.EXPIRE_DATE}-</strong>: null}
								<strong>{item.MANUFACTURE}</strong></p>
							</li>					
						)}						

					</ul>

				</div>
			</div>
		);
	}
}
