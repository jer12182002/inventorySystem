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
			allItems: [],
			checkedItem:[]
		}

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



	loadAllItem(receviedFilter=''){
		fetch(`http://localhost:4000/inventory/loadAllItem?filter=${receviedFilter}`)
		.then(res => res.json())
		.then(data =>{

			if(data.data){
				this.setState({allItems: this.setStateWithRowSpan(data.data)});
			}	
		});
	}


//=================================================================================	


//================================= Logical Functions =============================


updateItem(id) {
	let updatedItemInfo = {}
	
	updatedItemInfo.itemId = id;
	updatedItemInfo.ENGLISH_NAME = $.trim($("#NAME_EN_M" + id).val());
	updatedItemInfo.CHINESE_NAME = $.trim($("#NAME_CH_M" + id).val());
    updatedItemInfo.TYPE = $("#TYPE_MODIFY" + id).val();
    updatedItemInfo.SHELF_NO = $.trim($("#SHELF_M" + id).val().toUpperCase());
    updatedItemInfo.QTY = $("#QTY_MODIFY" + id).val();
    updatedItemInfo.EXPIRE_DATE = $("#EXP_M" + id).val();
    updatedItemInfo.GRAM = $("#GRAM_M" + id).val();

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
	setTypeDefault(id,type){
		$("#TYPE_MODIFY"+id).val(type);
	}

	clickEdit(e, key){
		e.preventDefault();
		$("#edit-btn"+key).addClass("display-none");
		$("#functional-Btns"+key).removeClass("display-none");
		$(".editToggle"+key).removeClass("display-none");
	}

	clickSave(e,key,id) {
		e.preventDefault();
		this.updateItem(id);
		this.setInvisible(key);
		
		//window.location.reload();
	}

	clickCancel(e,key) {
		e.preventDefault();
		this.setInvisible(key);
	}

	clickDelete(e,id){
		e.preventDefault();
		this.deleteItem(id);

		//window.location.reload();
	}
	

	setInvisible(key){
		$("#edit-btn"+key).removeClass("display-none");
		$("#functional-Btns"+key).addClass("display-none");
		$(".editToggle"+key).addClass("display-none");
	}


	filterCallFromChild(filterArr){
		// receive objArray from child

		this.setState({allItems:this.setStateWithRowSpan(filterArr)});
		
	}


	saveDisplayClearBtnFromChild(status) {
		
		// if(status === 'display') {
		// 	let checkedItemArray = [];
			
		// 	this.state.checkedItem.map((item,key) => {
		// 		if(item.checked) {
		// 			console.log('@@'+item.ENGLISH_NAME);
		// 			checkedItemArray.push(item);
		// 		}
		// 	});

		// 	this.setState({allItems:this.setStateWithRowSpan(checkedItemArray)});
		// 	checkedItemArray.map((item,key)=>{
		// 		$(`#checkbox${item.ID}`).prop("checked",true);
		// 	});

		// }
		// else {
		// 	this.setState({checkedItem:[]});
		// 	this.loadAllItem();
		// 	this.state.allItems.map((item,key)=>{
		// 			$(`#checkbox${item.ID}`).prop("checked",false);
		// 	});
		// }
	}



//===========================================================================
	


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



	// clickCheckBox(e,id){
	// 	e.stopPropagation();

	// 	let checkedArray = this.state.allItems;
		
	// 	checkedArray.map((item,key)=>{
	// 		if(item.ID === id) {
	// 			if(item.checked != true){
	// 				item.checked = $(`#checkbox${id}`).prop("checked");
	// 			}else {
	// 				item.checked = false;
	// 			}
	// 		}
	// 	});

	// 	console.log(checkedArray);
	// 	this.setState({checkedItem:checkedArray});



	// }



	render() {
		return (
			<div className="inventoryitemdisplay-wrapper">
				<div className="notification-panel"></div>

				<div className="header-section">Item Info</div>
				
				<div className="main-section">

				<table className="block items-table table">
					<thead>
					<tr>
						<td className="margin-center text-center number">Index</td>

						<td className="margin-center text-center number">RowSpan</td>
						

						<td className="name">En_Name</td>

						<td className="name">CH_name</td>

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
								
								{item.ROWSPAN > 0?
									<td rowSpan={item.ROWSPAN} className="margin-center text-center number">{item.ROWSPAN}</td>
									:null
								}
									
								<td className="name">
									<p>{item.ENGLISH_NAME}</p>
									{this.state.loggedUser.NAME_MODIFY? 
										<input key={`${item.ENGLISH_NAME}${key+1}`} id={`NAME_EN_M${item.ID}`} type="text" className={`editToggle${key} display-none`} defaultValue={item.ENGLISH_NAME}/>:null
									}
								</td>


								

								
								<td className="name">
									<p>{item.CHINESE_NAME}</p>
									{this.state.loggedUser.NAME_MODIFY? 
										<input key={`${item.CHINESE_NAME}${key+1}`} id={`NAME_CH_M${item.ID}`} type="text" className={`editToggle${key} display-none`} defaultValue={item.CHINESE_NAME}/>:null
									}
								</td>

							

								{this.state.loggedUser.TYPE_VIEW?
									this.state.loggedUser.TYPE_MODIFY? 
										<td className="margin-center text-center">
											<p data-id={`TYPE_MODIFY${item.ID}`}>{item.TYPE}</p>
											<select key={`${item.TYPE}${key+1}`} id={`TYPE_MODIFY${item.ID}`} className={`editToggle${key} display-none`}>
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
										<input key={`${item.SHELF_NO}${key+1}`} id={`SHELF_M${item.ID}`}type="text" className={`editToggle${key} display-none shelf_no`} defaultValue={item.SHELF_NO}/> : null
									}
								</td>
								

								<td id={`menu${item.ID}`} className="highlightColor">{item.MANUFACTURE}
									
								</td>
								



								{this.state.loggedUser.QTY_VIEW ?
									this.state.loggedUser.QTY_MODIFY?
										<td className="margin-center text-center number">
											<p>{item.QTY}</p>
											<input key={`${item.QTY}${key+1}`} id={`QTY_MODIFY${item.ID}`} type="number"  className={`editToggle${key} display-none`} defaultValue={item.QTY}/>
										</td>
										:<td className="margin-center text-center number">{item.QTY}</td>
									:null
								}

								

								{this.state.loggedUser.QTY_VIEW ?
									this.state.loggedUser.QTY_MODIFY?
										item.ROWSPAN > 0? //allow to display number
											<td rowSpan = {item.ROWSPAN} className="margin-center text-center number">{item.T_QTY}</td>
											:null
										:	
										item.ROWSPAN > 0? //allow to display number
											<td rowSpan = {item.ROWSPAN} className="margin-center text-center number">{item.T_QTY}</td>
											:null
									:null
								}



								{this.state.loggedUser.EXP_VIEW ?
									this.state.loggedUser.EXP_MODIFY? 
										<td className="margin-center text-center">
											<p>{item.EXPIRE_DATE}</p>
											<input key={`${item.EXPIRE_DATE}${key+1}`} id={`EXP_M${item.ID}`} type="date" className={`editToggle${key} display-none`} defaultValue={item.EXPIRE_DATE}/>
										</td>
										:<td className="margin-center text-center">{item.EXPIRE_DATE}</td>	
									:null
								}


								{this.state.loggedUser.GRAM_VIEW ?
									this.state.loggedUser.GRAM_MODIFY?
										<td className="margin-center text-center">
											<p>{item.GRAM}</p>
											<input key={`${item.GRAM}${key+1}`} id={`GRAM_M${item.ID}`} type="number" className={`editToggle${key} display-none`} defaultValue={item.GRAM}/>
										</td>
										:<td className="margin-center text-center">{item.GRAM}</td>	
									:null
								}


								{this.state.loggedUser.NAME_MODIFY || this.state.loggedUser.TYPE_MODIFY ||
								 this.state.loggedUser.QTY_MODIFY || this.state.loggedUser.EXP_MODIFY || 
								 this.state.loggedUser.GRAM_MODIFY ?
								<td className="margin-center text-center">
									<div id={`edit-btn${key}`} className="inline-f">
										<button type="button" className="btn btn-primary" onClick={(e)=>{this.clickEdit(e,key); this.setTypeDefault(item.ID,item.TYPE)}}>Edit</button>
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
					(<ControlPanel loggedUser={this.state.loggedUser}types={this.state.types} filterCall={this.filterCallFromChild.bind(this)}/>):null
					}
				}

				
			</div>
		);
	}
}
