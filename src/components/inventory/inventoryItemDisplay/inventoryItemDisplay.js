import React from 'react';
import './inventoryItemDisplay.scss';


import $ from 'jquery';
import ControlPanel from './inventoryControlPanel/inventoryControlPanel';

export default class inventoryItemDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedUser: this.props.loggedUser,
			types: [],
			allItems: []
		}

		console.log(this.props.loggedUser);
		this.loadAllItem();

		if(this.state.loggedUser.TYPE_MODIFY || this.state.loggedUser.ADD_ITEM) {
			this.loadSelect();
		}
	}
//======================== Preset load ============================================
	loadSelect(){
		fetch(`http://localhost:4000/inventory/loadSelect`)
		.then(res => res.json())
		.then(datas => {
			this.setState({types: datas.data});
		});
	}

	loadAllItem(){
		fetch('http://localhost:4000/inventory/loadAllItem')
		.then(res => res.json())
		.then(data =>{
			console.log(data.data);
			this.setState({allItems: data.data});
		});
	}

	highlightColor(key){
		if($("#menu"+key).text().toUpperCase().search("STTW")>=0){
			$("#menu"+key).addClass('hightLighYellow');
		}else if(($("#menu"+key).text().toUpperCase().search("STSC")>=0)){
			$("#menu"+key).addClass('hightLighBlue');
		}
	}
//=================================================================================	


//================================= Logical Functions =============================


updateItem(key,id) {
	let updatedItemInfo = {}
	
	updatedItemInfo.itemId = id;
	updatedItemInfo.ENGLISH_NAME = $.trim($("#NAME_EN_M" + key).val());
	updatedItemInfo.CHINESE_NAME = $.trim($("#NAME_CH_M" + key).val());
    updatedItemInfo.TYPE = $("#TYPE_MODIFY" + key).val();
    updatedItemInfo.SHELF_NO = $.trim($("#SHELF_M" + key).val().toUpperCase());
    updatedItemInfo.QTY = $("#QTY_MODIFY" + key).val();
    updatedItemInfo.EXPIRE_DATE = $("#EXP_M" + key).val();
    updatedItemInfo.GRAM = $("#GRAM_M" + key).val();

    fetch(`http://localhost:4000/inventory/updateItems?updatedItem=${JSON.stringify(updatedItemInfo)}`)
    .then(res =>res.json())
    .then(data => {

    	if(data.data.affectedRows) {
			this.loadAllItem();
		}else {
			alert("Something went wrong !!");
		}
    });
}



deleteItem (id){
	fetch(`http://localhost:4000/inventory/deleteItem?itemId=${id}`)
	.then(res => res.json())
	.then(data =>{
		if(data.data === 'success') {
			this.loadAllItem();
		}else {
			alert("Something went wrong !!");
		}

	})
}















//=================================================================================

//============================== All btns click ===================================
	loadDefaultSelect(key){
		$("#TYPE_MODIFY" + key).val($("#TYPE_MODIFY"+key).data("defaultvalue"));
	}


	clickEdit(e, key){
		e.preventDefault();
		$("#edit-btn"+key).addClass("display-none");
		$("#functional-Btns"+key).removeClass("display-none");
		$(".editToggle"+key).removeClass("display-none");
		this.loadDefaultSelect(key);
	}

	clickSave(e,key,id) {
		e.preventDefault();
		this.updateItem(key,id);
		this.setInvisible(key);
	}

	clickCancel(e,key) {
		e.preventDefault();
		this.setInvisible(key);
	}

	clickDelete(e,id){
		e.preventDefault();
		this.deleteItem(id);
	}
	

	setInvisible(key){
		$("#edit-btn"+key).removeClass("display-none");
		$("#functional-Btns"+key).addClass("display-none");
		$(".editToggle"+key).addClass("display-none");
	
	}
//===========================================================================
	render() {
	
		return (
			<div className="inventoryitemdisplay-wrapper">
				<div className="notification-panel"></div>

				<div className="header-section">Item Info</div>
				
				<div className="main-section">

				<table className="block items-table table">
					<thead>
					<tr>
						<td className="margin-center text-center number">Row</td>

						<td className="margin-center text-center number">RowSpan</td>

						<td>En_Name</td>

						<td>CH_name</td>

						{this.state.loggedUser.TYPE_VIEW || this.state.loggedUser.TYPE_MODIFY ?
							<td className="margin-center text-center">Type</td> : null
						}

						<td className="margin-center text-center number">Shelf No</td>
						
						<td>Manufacturer</td>


						{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
							<td className="margin-center text-center number">QTY</td> : null
						} 

						{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
							<td className="margin-center text-center number">Total QTY</td> : null
						} 


 						{this.state.loggedUser.EXP_VIEW || this.state.loggedUser.EXP_MODIFY ?
							<td className="margin-center text-center">Exp</td>: null
						}


						{this.state.loggedUser.GRAM_VIEW || this.state.loggedUser.GRAM_MODIFY ?
							<td className="margin-center text-center">Gram</td>: null
						}

						{this.state.loggedUser.NAME_MODIFY || this.state.loggedUser.TYPE_MODIFY ||
						 this.state.loggedUser.QTY_MODIFY || this.state.loggedUser.EXP_MODIFY || 
						 this.state.loggedUser.GRAM_MODIFY ?
							<td className="margin-center text-center">Action</td>:null
						}

					</tr>
					</thead>


					<tbody>
					{this.state.allItems.map((item,key)=>
					<tr key={key+1}>
						<td className="margin-center text-center number">{key+1}</td>

						{key != 0?
							this.state.allItems[key-1].ENGLISH_NAME === item.ENGLISH_NAME?
								null
								:
								<td rowSpan={item.ROWSPAN} className="margin-center text-center number">{item.ROWSPAN}</td> 
							:<td className="margin-center text-center number">1</td>
						}

						

							
						<td>
							<p>{item.ENGLISH_NAME}</p>
							{this.state.loggedUser.NAME_MODIFY? 
								<input id={`NAME_EN_M${key}`} type="text" className={`editToggle${key} display-none`} defaultValue={item.ENGLISH_NAME}></input>:null
							}
						</td>


						

						
						<td>
							<p>{item.CHINESE_NAME}</p>
							{this.state.loggedUser.NAME_MODIFY? 
								<input id={`NAME_CH_M${key}`} type="text" className={`editToggle${key} display-none`} defaultValue={item.CHINESE_NAME}></input>:null
							}
						</td>

					

						{this.state.loggedUser.TYPE_VIEW?
							this.state.loggedUser.TYPE_MODIFY? 
								<td className="margin-center text-center">
									<p>{item.TYPE}</p>
									<select id={`TYPE_MODIFY${key}`} className={`editToggle${key} display-none`} data-defaultvalue={item.TYPE} >
										{this.state.types.map((type,keyIndex)=>
											<option key={keyIndex}>{type.ITEM_TYPE}</option>					
										)}
									</select>
								</td>
								: <td className="margin-center text-center">{item.TYPE}</td> 
							:null
						}


				

						<td className="margin-center text-center number">
							<p>{item.SHELF_NO}</p>
							{this.state.loggedUser.SHELF_MODIFY ? 
								<input id={`SHELF_M${key}`}type="text" className={`editToggle${key} display-none shelf_no`} defaultValue={item.SHELF_NO}/> : null
							}
						</td>
						

						<td id={`menu${key}`} onload={this.highlightColor(key)}>{item.MANUFACTURE}</td>
						



						{this.state.loggedUser.QTY_VIEW ?
							this.state.loggedUser.QTY_MODIFY?
								<td className="margin-center text-center number">
									<p>{item.QTY}</p>
									<input id={`QTY_MODIFY${key}`} type="number"  className={`editToggle${key} display-none`} defaultValue={item.QTY}/>
								</td>
								:<td className="margin-center text-center number">{item.QTY}</td>
							:null
						}



						{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
							key != 0?
							this.state.allItems[key-1].ENGLISH_NAME === item.ENGLISH_NAME?
								null
								:
								<td rowSpan={item.ROWSPAN} className="margin-center text-center number">{item.T_QTY}</td>
							:<td className="margin-center text-center number">{item.T_QTY}</td>
							:null							
						} 



						{this.state.loggedUser.EXP_VIEW ?
							this.state.loggedUser.EXP_MODIFY? 
								<td className="margin-center text-center">
									<p>{item.EXPIRE_DATE}</p>
									<input id={`EXP_M${key}`} type="date" className={`editToggle${key} display-none`} data-defaultvalue={item.EXPIRE_DATE}/>
								</td>
								:<td className="margin-center text-center">{item.EXPIRE_DATE}</td>	
							:null
						}


						{this.state.loggedUser.GRAM_VIEW ?
							this.state.loggedUser.GRAM_MODIFY?
								<td className="margin-center text-center">
									<p>{item.GRAM}</p>
									<input id={`GRAM_M${key}`}type="number" className={`editToggle${key} display-none`} defaultValue={item.GRAM}/>
								</td>
								:<td className="margin-center text-center">{item.GRAM}</td>	
							:null
						}


						{this.state.loggedUser.NAME_MODIFY || this.state.loggedUser.TYPE_MODIFY ||
						 this.state.loggedUser.QTY_MODIFY || this.state.loggedUser.EXP_MODIFY || 
						 this.state.loggedUser.GRAM_MODIFY ?
						<td className="margin-center text-center">
							<div id={`edit-btn${key}`}>
								<button type="button" className="btn btn-primary" onClick={(e)=>this.clickEdit(e,key)}>Edit</button>
							</div>
							<div id={`functional-Btns${key}`} className="display-none">
								<button type="button" className="btn btn-success" onClick={(e)=>this.clickSave(e,key,item.ID)}>Save</button>
								<button type="button" className="btn btn-danger" onClick={(e)=>this.clickCancel(e,key)}>Cancel</button>
								<button type="button" className="btn btn-warning" onClick={(e)=>this.clickDelete(e, item.ID)}>Delete</button>
							</div>
						</td> :
						null
						}
					</tr>
					)}
					</tbody>
				</table>
				
				</div>
				


				{this.state.loggedUser.ADD_ITEM? 
					(<ControlPanel loggedUser = {this.state.loggedUser.USERNAME} types={this.state.types}/>):null
				}
			</div>
		);
	}
}
