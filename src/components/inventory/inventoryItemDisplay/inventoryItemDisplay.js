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
			allItems: this.props.allItems,
			checkedItem:[]
		}

		

		if(this.state.loggedUser.TYPE_MODIFY || this.state.loggedUser.ADD_ITEM) {
			this.loadSelect();
		}
	}


	componentWillReceiveProps(newProps) {
	  if (this.state.allItems !== newProps.allItems) {
	    this.setState({allItems: newProps.allItems});
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

//=================================================================================	





insertHoldItem (id,key) {
	let holdItem = {};
	holdItem.ITEM_ID = id;
	holdItem.PERSON = $(`#holdName${key}`).val();
	holdItem.HOLD_QTY = $(`#holdQty${key}`).val();
	holdItem.DATE = $(`#holdDate${key}`).val();

	if(holdItem.PERSON === '' || holdItem.HOLD_QTY <= 0 || (holdItem.DATE != '' && holdItem.DATE <= this.props.today)) {
		alert("Error! You are missed some infomation for hold item !!");
	}

	else {
		fetch(`http://localhost:4000/inventory/addhold?holdItem=${JSON.stringify(holdItem)}`)
		.then(res => res.json())
		.then(data=> {
			if(data.data === 'success') {
				this.props.loadAllItem();
			} 
		})
	}
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
		$("#hold-btn"+key).addClass("display-none");
	}

	clickSave(e,key,id) {
		e.preventDefault();

		let updatedItemInfo = this.state.allItems.filter(item => id === item.ID)[0];
	
		if(this.state.loggedUser.NAME_MODIFY) {
			updatedItemInfo.ENGLISH_NAME = $.trim($("#NAME_EN_M" + id).val());
			updatedItemInfo.CHINESE_NAME = $.trim($("#NAME_CH_M" + id).val());
		}
		 
		if(this.state.loggedUser.TYPE_MODIFY) {
			updatedItemInfo.TYPE = $("#TYPE_MODIFY" + id).val();
		}

		if(this.state.loggedUser.SHELF_MODIFY) {
			updatedItemInfo.SHELF_NO = $.trim($("#SHELF_M" + id).val().toUpperCase());
		}

		if(this.state.loggedUser.QTY_MODIFY) {
			updatedItemInfo.QTY = parseInt(updatedItemInfo.HOLD_QTY) + parseInt($("#QTY_MODIFY" + id).val());
		}

		if(this.state.loggedUser.EXP_MODIFY) {
			updatedItemInfo.EXPIRE_DATE = $("#EXP_M" + id).val();
		}

		if(this.state.loggedUser.GRAM_MODIFY) {
			updatedItemInfo.GRAM = $("#GRAM_M" + id).val();
		}

		updatedItemInfo.LAST_MODIFIED_BY = this.state.loggedUser.USERNAME;
		
		this.props.updateItem(updatedItemInfo);
		this.setInvisible(key);
		$("#hold-btn"+key).removeClass("display-none");

		this.props.loadAllNotificationItems();
	}

	clickCancel(e,key) {
		e.preventDefault();
		this.setInvisible(key);
		$("#hold-btn"+key).removeClass("display-none");
	}

	clickDelete(e,id,key){
		e.preventDefault();
		this.props.deleteItem(id);
		this.setInvisible(key);
		$("#hold-btn"+key).removeClass("display-none");
	}
	

	setInvisible(key){
		$("#edit-btn"+key).removeClass("display-none");
		$("#functional-Btns"+key).addClass("display-none");
		$(".editToggle"+key).addClass("display-none");
	}


	clickHold(e,key) {
		e.preventDefault();
		$(`#hold-functional-Btns${key}`).removeClass("display-none");
		$(`#hold-btn${key}`).addClass("display-none");
		$(`#edit-btn${key}`).addClass("display-none");
	}

	clickHoldAdd(e,key,id) {
		e.preventDefault();
		this.insertHoldItem(id,key);
		$(`#hold-functional-Btns${key}`).addClass("display-none");
		$(`#hold-btn${key}`).removeClass("display-none");
		$(`#edit-btn${key}`).removeClass("display-none");
		$(`#holdName${key}`).val('');
	    $(`#holdQty${key}`).val('');
		$(`#holdDate${key}`).val('');
		this.props.loadAllHoldItems();
	}

	clickHoldCancel(e,key){
		e.preventDefault();
		$(`#hold-functional-Btns${key}`).addClass("display-none");
		$(`#hold-btn${key}`).removeClass("display-none");
		$(`#edit-btn${key}`).removeClass("display-none");
	}

	holdQtyChange(e,key,qty) {
		e.preventDefault();
		if($(`#holdQty${key}`).val() > qty) {
			$(`#holdQty${key}`).val(qty);
		} else if($(`#holdQty${key}`).val() < 0){
			$(`#holdQty${key}`).val(0);
		}
	}

	filterCallFromChild(filterArr){
		this.setState({allItems:this.props.setStateWithRowSpan(filterArr)});
	}



	render() {

		return (
			<div className="inventoryitemdisplay-wrapper">

				<div className="header-section">
					<div>
						<h3 className="title">All Inventory Items</h3>
					</div>
				
				</div>
				
				<div className="main-section">
					<table className="block items-table table">
						<thead>
						<tr>
							<td className="margin-center text-center number">Index</td>

							<td className="margin-center text-center number">RowSpan</td>
							

							<td className="name">En_Name</td>

							<td className="name">商品名稱</td>

							{this.state.loggedUser.TYPE_VIEW || this.state.loggedUser.TYPE_MODIFY ?
								<td className="margin-center text-center">Type</td> : null
							}

							<td className="margin-center text-center number">Shelf No</td>
							
							<td>Manufacturer</td>


							{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
								<td className="margin-center text-center number">Hold QTY</td> : null
							}

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

							{this.state.loggedUser.NAME_MODIFY  || this.state.loggedUser.TYPE_MODIFY ||
							 this.state.loggedUser.SHELF_MODIFY || this.state.loggedUser.QTY_MODIFY  || 
							 this.state.loggedUser.EXP_MODIFY   || this.state.loggedUser.GRAM_MODIFY || 
							 this.state.loggedUser.DELETE_ITEM ?
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
										<p id={`NAME_EN_V${item.ID}`}>{item.ENGLISH_NAME}</p>
										{this.state.loggedUser.NAME_MODIFY? 
											<input key={`${item.ENGLISH_NAME}${item.ID}${key+1}`} id={`NAME_EN_M${item.ID}`} type="text" className={`editToggle${key} display-none`} defaultValue={item.ENGLISH_NAME}/>
											:null
										}
									</td>


									

									
									<td className="name">
										<p id={`NAME_CH_V${item.ID}`}>{item.CHINESE_NAME}</p>
										{this.state.loggedUser.NAME_MODIFY? 
											<input key={`${item.CHINESE_NAME}${item.ID}${key+1}`} id={`NAME_CH_M${item.ID}`} type="text" className={`editToggle${key} display-none`} defaultValue={item.CHINESE_NAME}/>:null
										}
									</td>

								

									{this.state.loggedUser.TYPE_VIEW?
										this.state.loggedUser.TYPE_MODIFY? 
											<td className="margin-center text-center">
												<p id={`TYPE_VIEW${item.ID}`} data-id={`TYPE_MODIFY${item.ID}`}>{item.TYPE}</p>
												<select key={`${item.TYPE}${key+1}`} id={`TYPE_MODIFY${item.ID}`} className={`editToggle${key} display-none`}>
													{this.state.types.map((type,keyIndex)=>
														<option key={keyIndex}>{type.ITEM_TYPE}</option>					
													)}
												</select>
											</td>
											: 
											<td className="margin-center text-center">
												<p>{item.TYPE}</p>
											</td> 
										:null
									}


							

									<td className="margin-center text-center number">
										<p>{item.SHELF_NO}</p>
										{this.state.loggedUser.SHELF_MODIFY ? 
											<input key={`${item.SHELF_NO}${key+1}`} id={`SHELF_M${item.ID}`}type="text" className={`editToggle${key} display-none shelf_no`} defaultValue={item.SHELF_NO}/> : null
										}
									</td>
									


									<td id={`menu${item.ID}`} className="highlightColor">{item.MANUFACTURE}</td>
									

									{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
										<td className="margin-center text-center number">
											{item.HOLD_QTY === 0? 
												<p>0</p> : <p className = "hold-highlight">{item.HOLD_QTY}</p>
											}
										</td> : null
									} 


									{this.state.loggedUser.QTY_VIEW ?
										this.state.loggedUser.QTY_MODIFY?
											<td className="margin-center text-center number">
												<p>{item.QTY - item.HOLD_QTY}</p>
												<input key={`${item.QTY-item.HOLD_QTY}${key+1}`} id={`QTY_MODIFY${item.ID}`} type="number"  className={`editToggle${key} display-none`} defaultValue={item.QTY - item.HOLD_QTY}/>
											</td>
											:<td className="margin-center text-center number">
												<p>{item.QTY - item.HOLD_QTY}</p>
											</td>
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
											:<td className="margin-center text-center">
												<p>{item.EXPIRE_DATE}</p>
											</td>	
										:null
									}


									{this.state.loggedUser.GRAM_VIEW ?
										this.state.loggedUser.GRAM_MODIFY?
											<td className="margin-center text-center">
												<p>{item.GRAM}</p>
												<input key={`${item.GRAM}${key+1}`} id={`GRAM_M${item.ID}`} type="number" className={`editToggle${key} display-none`} defaultValue={item.GRAM}/>
											</td>
											:<td className="margin-center text-center">
												<p>{item.GRAM}</p>
											</td>	
										:null
									}


									{this.state.loggedUser.NAME_MODIFY  ||  this.state.loggedUser.TYPE_MODIFY ||
									 this.state.loggedUser.SHELF_MODIFY ||  this.state.loggedUser.QTY_MODIFY  || 
									 this.state.loggedUser.EXP_MODIFY   ||  this.state.loggedUser.GRAM_MODIFY || 
									 this.state.loggedUser.DELETE_ITEM?
									<td className="margin-center text-center">
										<div id={`edit-btn${key}`} className="inline-f">
											<button type="button" className="btn btn-primary" onClick={(e)=>{this.clickEdit(e,key); this.setTypeDefault(item.ID,item.TYPE)}}>Edit</button>
										</div>

										<div id={`functional-Btns${key}`} className="display-none">
											{this.state.loggedUser.NAME_MODIFY  ||  this.state.loggedUser.TYPE_MODIFY ||
									 		 this.state.loggedUser.QTY_MODIFY   ||  this.state.loggedUser.EXP_MODIFY  || 
									 		 this.state.loggedUser.SHELF_MODIFY ||  this.state.loggedUser.GRAM_MODIFY ? 
											<button type="button" className="btn btn-success" onClick={(e)=>this.clickSave(e,key,item.ID)}>Save</button>
											:null}
											<button type="button" className="btn btn-danger" onClick={(e)=>this.clickCancel(e,key)}>Cancel</button>
											{this.state.loggedUser.DELETE_ITEM?
											<button type="button" className="btn btn-warning" onClick={(e)=>this.clickDelete(e, item.ID,key)}>Delete</button>
											:null}
										</div>

										{this.state.loggedUser.QTY_MODIFY?
											<div id={`hold-btn${key}`} className="inline-f">
												<button type="button" className="btn btn-primary" onClick={(e)=>{this.clickHold(e,key)}}>Hold</button>
											</div>
											:
											null
										}
										{this.state.loggedUser.QTY_MODIFY?
											<div id={`hold-functional-Btns${key}`} className="hold-functional-Btns display-none">
												<div className="block">	
													<input key={`holdName${key}`} id={`holdName${key}`} type="text" placeholder="name"/>	
													<input key={`holdQty${key}`} id={`holdQty${key}`} type="number" defaultValue="0" onChange={(e)=> this.holdQtyChange(e,key,item.QTY-item.HOLD_QTY)}/>
													<input key={`holdDate${key}`} id={`holdDate${key}`} type="date"/>	
												</div>			
												<button type="button" className="btn btn-success" onClick={(e)=>this.clickHoldAdd(e,key,item.ID)}>Add</button>
												<button type="button" className="btn btn-danger" onClick={(e)=>this.clickHoldCancel(e,key,item.ID)}>Cancel</button>
											</div>
											:
											null
										}


									</td> :
									null
									}
								</tr>
							)}
							</tbody>
					</table>
				
				</div>
				<ControlPanel loggedUser={this.state.loggedUser} 
							  types={this.state.types} 
							  filterCall={this.filterCallFromChild.bind(this)}/>
							  )
			</div>
		);
	}
}
