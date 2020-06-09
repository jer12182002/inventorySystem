import React from 'react';
import './inventoryItemDisplay.scss';


import Moment from 'moment';
import $ from 'jquery';


export default class inventoryItemDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedUser: this.props.loggedUser,
			types: [],
			allItems: this.props.allItems,
			checkedItem:[],
			aboutExpiredDate:''
		}

		if(this.state.loggedUser.TYPE_MODIFY || this.state.loggedUser.ADD_ITEM) {
			this.loadSelect();
		}
	}


	componentWillReceiveProps(newProps) {
	  if (this.state.allItems !== newProps.allItems) {
	  	let aboutExpiredDate = new Date(newProps.today);
	  	aboutExpiredDate = aboutExpiredDate.setMonth(aboutExpiredDate.getMonth()+4);
	  	
	    this.setState({allItems: newProps.allItems , aboutExpiredDate: Moment(aboutExpiredDate).format('YYYY-MM')});
	  }
	}


//======================== Preset load ============================================
	loadSelect(){
		fetch(`${process.env.REACT_APP_INVENTROY_API}/inventory/loadSelect`)
		.then(res => res.json())
		.then(datas => {
			this.setState({types: datas.data});
		});
	}

//=================================================================================	





	insertHoldItem (id,key) {
		let holdItem = {};
		holdItem.ITEM_ID = id;
		holdItem.RECIPIENT = $(`#holdName${key}`).val();
		holdItem.HOLD_QTY = $(`#holdQty${key}`).val();
		holdItem.DATE = $(`#holdDate${key}`).val();
		holdItem.PERSON = this.state.loggedUser.USERNAME;
		if(holdItem.PERSON === '' || holdItem.HOLD_QTY <= 0 || (holdItem.DATE !== '' && holdItem.DATE <= this.props.today)) {
			alert("Error! You are missed some infomation for hold item !!");
		}

		else {
			fetch(`${process.env.REACT_APP_INVENTROY_API}/inventory/addhold?holdItem=${JSON.stringify(holdItem)}`)
			.then(res => res.json())
			.then(data=> {
				if(data.data === 'success') {
					this.props.loadAllItem();
					this.props.loadAllHoldItems();
				} 
			})
		}
	}



	setTypeDefault(id,type){
		$("#TYPE_MODIFY"+id).val(type);
	}





	sortToggleBtnClick(e, field) {
		e.preventDefault();

		let fieldBtnText = $(`#inv${field}-sortToggleBtn`).text();
		let sortedData = this.props.quickSort(field,this.state.allItems, 0 , this.state.allItems.length-1);
			
		if(fieldBtnText === 'ASC') {
		
			$(`#inv${field}-sortToggleBtn`).text('DESC');
		}else {
			sortedData.reverse();
			$(`#inv${field}-sortToggleBtn`).text('ASC');
		}

		
		
		this.setState({allItems: this.props.setStateWithRowSpan(sortedData)});
	}
//=================================================================================

//============================== All btns click ===================================
	



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
			updatedItemInfo.ENGLISH_NAME = $.trim($("#NAME_EN_M" + id).val().toLowerCase().replace(/\s\s/g, '').replace(/[^a-zA-Z0-9-]+(.)/g, (m, chr) => ' '+ chr.toUpperCase())).replace(/^[a-z]/g,c => c.toUpperCase());
			updatedItemInfo.CHINESE_NAME = $.trim($("#NAME_CH_M" + id).val().toString().split("").filter(char => /\p{Script=Han}/u.test(char)).join(""))+$.trim($("#NAME_CH_M" + id).val().toString().replace(/[^0-9]/gi,''));

		}
		 
		if(this.state.loggedUser.TYPE_MODIFY) {
			updatedItemInfo.TYPE = $("#TYPE_MODIFY" + id).val();
		}

		if(this.state.loggedUser.SHELF_MODIFY) {
			updatedItemInfo.SHELF_NO = $.trim($("#SHELF_M" + id).val().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toUpperCase());
			
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
		this.props.loadAllHoldItems();
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

	ivtExpandClick (e) {
		e.preventDefault();
		if($('#ivtItem-expand-btn').text()==="Expand") {
			$('.inventoryitemdisplay-wrapper .main-section').removeClass("display-none");
			$('#ivtItem-expand-btn').text("Close");
		}
		else {
			$('.inventoryitemdisplay-wrapper .main-section').addClass("display-none");
			$('#ivtItem-expand-btn').text("Expand");	
		}	
	}

	render() {
		return (
			<div className="inventoryitemdisplay-wrapper  category-wrappr">

				<div className="header-section">
					<div className="title-container">
						<h3 className="title">All Inventory Items</h3>
					</div>
					<div className="qty-container">
						<h3 className="inline-b"><strong>{this.state.allItems.length}</strong> Items In Stock</h3>	
					</div>
					<div>
						<button id="ivtItem-expand-btn" type="button" onClick={e=>this.ivtExpandClick(e)}>Expand</button>
					</div>
				</div>
				
				<div className="main-section display-none">
					<table className="block items-table table">
						<thead>
						<tr>
							<td className="verticalMiddle">Index</td>

							<td className="verticalMiddle">Row<br/>Span</td>
							

							<td>Name<br/><button id="invENGLISH_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ENGLISH_NAME")}>ASC</button></td>

							<td>商品名稱<br/><button id="invCHINESE_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CHINESE_NAME")}>ASC</button></td>

							{this.state.loggedUser.TYPE_VIEW || this.state.loggedUser.TYPE_MODIFY ?
								<td>Type<br/><button id="invTYPE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"TYPE")}>ASC</button></td> : null
							}

							<td>Shelf No<br/><button id="invSHELF_NO-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"SHELF_NO")}>ASC</button></td>
							
							<td>Mfr.<br/><button id="invMANUFACTURE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"MANUFACTURE")}>ASC</button></td>


							{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
								<td>Hold QTY<br/><button id="invHOLD_QTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"HOLD_QTY")}>ASC</button></td> : null
							}

							{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
								<td>QTY<br/><button id="invQTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"QTY")}>ASC</button></td> : null
							} 

							{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
								<td>Total QTY<br/><button id="invT_QTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"T_QTY")}>ASC</button></td> : null 
							} 


	 						{this.state.loggedUser.EXP_VIEW || this.state.loggedUser.EXP_MODIFY ?
								<td>Exp<br/><button id="invEXPIRE_DATE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"EXPIRE_DATE")}>ASC</button></td>: null
							}


							{this.state.loggedUser.GRAM_VIEW || this.state.loggedUser.GRAM_MODIFY ?
								<td >Gram<br/><button id="invGRAM-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"GRAM")}>ASC</button></td>: null
							}

							{this.props.holdLock && this.state.loggedUser.QTY_MODIFY?
								<td className="verticalMiddle">Hold Qty</td>:null
							}

							{this.props.editLock?
								this.state.loggedUser.NAME_MODIFY  || this.state.loggedUser.TYPE_MODIFY ||
								 this.state.loggedUser.SHELF_MODIFY || this.state.loggedUser.QTY_MODIFY  || 
								 this.state.loggedUser.EXP_MODIFY   || this.state.loggedUser.GRAM_MODIFY || 
								 this.state.loggedUser.DELETE_ITEM ?
									<td className="verticalMiddle">Action</td>:null
								
								:
								null

							}


						</tr>
						</thead>

							<tbody>
							{this.state.allItems.map((item,key)=>
								<tr key={key+1}>
									<td className="margin-center text-center ">{key+1}</td>
									
									{item.ROWSPAN > 0?
										<td rowSpan={item.ROWSPAN} className="margin-center text-center">{item.ROWSPAN}</td>
										:null
									}
										
									<td className="text-left bg-width">
										<p id={`NAME_EN_V${item.ID}`}>{item.ENGLISH_NAME}</p>
										{this.state.loggedUser.NAME_MODIFY? 
											<input key={`${item.ENGLISH_NAME}${item.ID}${key+1}`} id={`NAME_EN_M${item.ID}`} type="text" className={`editToggle${key} text-left display-none`} defaultValue={item.ENGLISH_NAME}/>
											:null
										}
									</td>


									

									
									<td className="text-left bg-width">
										<p id={`NAME_CH_V${item.ID}`}>{item.CHINESE_NAME}</p>
										{this.state.loggedUser.NAME_MODIFY? 
											<input key={`${item.CHINESE_NAME}${item.ID}${key+1}`} id={`NAME_CH_M${item.ID}`} type="text" className={`editToggle${key} text-left display-none`} defaultValue={item.CHINESE_NAME}/>:null
										}
									</td>

								

									{this.state.loggedUser.TYPE_VIEW?
										this.state.loggedUser.TYPE_MODIFY? 
											<td className="margin-center text-center sm-width">
												<p id={`TYPE_VIEW${item.ID}`} data-id={`TYPE_MODIFY${item.ID}`}>{item.TYPE}</p>
												<select key={`${item.TYPE}${key+1}`} id={`TYPE_MODIFY${item.ID}`} className={`editToggle${key} display-none sm-input`}>
													{this.state.types.map((type,keyIndex)=>
														<option key={keyIndex}>{type.ITEM_TYPE}</option>					
													)}
												</select>
											</td>
											: 
											<td className="margin-center text-center sm-width">
												<p>{item.TYPE}</p>
											</td> 
										:null
									}


							

									<td className="margin-center text-center sm-width">
										<p>{item.SHELF_NO}</p>
										{this.state.loggedUser.SHELF_MODIFY ? 
											<input key={`${item.SHELF_NO}${key+1}`} id={`SHELF_M${item.ID}`}type="text" className={`editToggle${key} sm-input display-none shelf_no`} defaultValue={item.SHELF_NO}/> : null
										}
									</td>
									


									<td id={`menu${item.ID}`} className={`highlightColor sm-width ${item.MANUFACTURE}`}>{item.MANUFACTURE}</td>
									

									{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
										item.HOLD_QTY === 0? 
										<td className="margin-center text-center sm-width">
											<p>0</p>
										</td>
										:
										<td className="margin-center text-center sm-width hold-highlight">
											<p className = "hold-highlight">{item.HOLD_QTY}</p>
										</td>
										
										: null
									} 


									{this.state.loggedUser.QTY_VIEW ?
										this.state.loggedUser.QTY_MODIFY?
											<td className="margin-center text-center sm-width">
												<p>{item.QTY - item.HOLD_QTY}</p>
												<input key={`${item.QTY-item.HOLD_QTY}${key+1}`} id={`QTY_MODIFY${item.ID}`} type="number"  className={`editToggle${key} sm-input display-none`} defaultValue={item.QTY - item.HOLD_QTY}/>
											</td>
											:<td className="margin-center text-center sm-width">
												<p>{item.QTY - item.HOLD_QTY}</p>
											</td>
										:null
									}

									

									{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY ?
										item.ROWSPAN > 0? //allow to display number
											<td rowSpan = {item.ROWSPAN} className="margin-center text-center sm-width">{item.T_QTY}</td>
											: 
											null
										:
										null
									}
									



									{this.state.loggedUser.EXP_VIEW ?
										this.state.loggedUser.EXP_MODIFY? 
											<td className={`bbg-width ${Moment(item.EXPIRE_DATE).format('YYYY-MM') <= Moment(this.props.toady).format('YYYY-MM')? 'expired-date':Moment(item.EXPIRE_DATE).format('YYYY-MM') < this.state.aboutExpiredDate? 'about-expired' : ''  }`}>
												<p>{item.EXPIRE_DATE}</p>
		
												<input key={`${item.EXPIRE_DATE}${key+1}`} id={`EXP_M${item.ID}`} type="date" className={`editToggle${key} sm-input display-none `} defaultValue={item.EXPIRE_DATE}/>
											</td>
											:<td className={`bg-width ${Moment(item.EXPIRE_DATE).format('YYYY-MM') <= Moment(this.props.toady).format('YYYY-MM')? 'expired-date': Moment(item.EXPIRE_DATE).format('YYYY-MM') < this.state.aboutExpiredDate? 'about-expired' : '' }`}>
												<p>{item.EXPIRE_DATE}</p>
											</td>	
										:null
									}


									{this.state.loggedUser.GRAM_VIEW ?
										this.state.loggedUser.GRAM_MODIFY?
											<td className="sm-width">
												<p>{item.GRAM}</p>
												<input key={`${item.GRAM}${key+1}`} id={`GRAM_M${item.ID}`} type="number" className={`editToggle${key} sm-input display-none`} defaultValue={item.GRAM}/>
											</td>
											:<td className="sm-width">
												<p>{item.GRAM}</p>
											</td>	
										:null
									}

									{this.props.editLock || this.props.holdLock?
										this.state.loggedUser.NAME_MODIFY  ||  this.state.loggedUser.TYPE_MODIFY ||
										this.state.loggedUser.SHELF_MODIFY ||  this.state.loggedUser.QTY_MODIFY  || 
										this.state.loggedUser.EXP_MODIFY   ||  this.state.loggedUser.GRAM_MODIFY || 
										this.state.loggedUser.DELETE_ITEM?
										<td className="margin-center text-center bg-width">
											{this.props.editLock?
											<div id={`edit-btn${key}`} className="inline-f">
												<button type="button" className="btn btn-primary" onClick={(e)=>{this.clickEdit(e,key); this.setTypeDefault(item.ID,item.TYPE)}}>Edit</button>
											</div>
											:null
											}

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

											{this.state.loggedUser.QTY_MODIFY && this.props.holdLock?
												<div className="inline-f">
													<input id={`holdQty${item.ID}`}type="number" min="0" max={`${item.QTY-item.HOLD_QTY}`}></input>
												</div>
												/*
												<div id={`hold-btn${key}`} className="inline-f">
													<button type="button" className="btn btn-primary" onClick={(e)=>{this.clickHold(e,key)}}>Hold</button>
												</div>
												*/
												:
												null
											}
											{this.state.loggedUser.QTY_MODIFY?
												<div id={`hold-functional-Btns${key}`} className="hold-functional-Btns display-none">
													<div className="block">	
														<input key={`holdName${key}`} id={`holdName${key}`} type="text" placeholder="name"/>	
														<input key={`holdQty${key}`} id={`holdQty${key}`} className="sm-input inline-b ss-input" type="number" defaultValue="0" onChange={(e)=> this.holdQtyChange(e,key,item.QTY-item.HOLD_QTY)}/>
														<input key={`holdDate${key}`} id={`holdDate${key}`} className="sm-input inline-b" type="date"/>	
													</div>			
													<button type="button" className="btn btn-success" onClick={(e)=>this.clickHoldAdd(e,key,item.ID)}>Add</button>
													<button type="button" className="btn btn-danger" onClick={(e)=>this.clickHoldCancel(e,key,item.ID)}>Cancel</button>
												</div>
												:
												null
											}
										</td> :
										null
									:
									null
									}
								</tr>
							)}
							</tbody>
					</table>
				
				</div>
			
			</div>
		);
	}
}
