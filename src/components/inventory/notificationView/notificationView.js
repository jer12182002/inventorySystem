import React from 'react';
import './notificationView.scss';
import $ from 'jquery';

export default class notificationView extends React.Component {
	constructor(props) {
		super(props);

		
		console.log(this.props.allNotificationItems);
		this.state = {
			loggedUser: this.props.loggedUser,
			allNotificationItems: this.props.allNotificationItems
		}	

	}


	componentWillReceiveProps(newProps) {
	  if (this.state.allNotificationItems !== newProps.allNotificationItems) {
	    this.setState({allNotificationItems: newProps.allNotificationItems});
	  }
	}
	
	componentDidMount() {
		this.props.loadAllNotificationItems(this.props.defaultExpiryDate);
	}




//========================================= Display Functions ========================================================================




//============================== Work Functions =============================================================
	sortToggleBtnClick(e, field) {
		e.preventDefault();

		let fieldBtnText = $(`#invNoti${field}-sortToggleBtn`).text();
		let sortedData = this.state.allNotificationItems;
			
		if(fieldBtnText === 'ASC') {
			sortedData = sortedData.sort((a,b)=>a[field].toString().localeCompare(b[field].toString()));
			$(`#invNoti${field}-sortToggleBtn`).text('DESC');
		}else {
			sortedData = sortedData.sort((a,b)=>b[field].toString().localeCompare(a[field].toString()));
			$(`#invNoti${field}-sortToggleBtn`).text('ASC');
		}

		this.setState({allNotificationItems:this.props.setStateWithRowSpan(sortedData)});
	}



	changeDate(e){
		e.preventDefault();
		if($("#date-picker").val() === '') {
			$("#date-picker").val(this.props.defaultExpiryDate);
		}

		this.props.loadAllNotificationItems($("#date-picker").val());
		//this.props.loadAllItem('',$("#date-picker").val());
	}


	ivtExpandClick (e) {
		e.preventDefault();
		if($('#ivt-expand-btn').text()==="Expand") {
			$('.notificationview-wrapper .main-section').removeClass("display-none");
			$('#ivt-expand-btn').text("Close");
		}
		else {
			$('.notificationview-wrapper .main-section').addClass("display-none");
			$('#ivt-expand-btn').text("Expand");	
		}	
	}




	render() {
		return (
			<div className = "notificationview-wrapper">
				<div className="header-section">
					<h3 className="title">About Expired Products Notification</h3>
					<div>
						<h3 className="inline-b"><strong>{this.state.allNotificationItems.length}</strong> Items Will Expire After: </h3>
						<input id="date-picker"  type="date" defaultValue = {this.props.defaultExpiryDate} onChange= {e => this.changeDate(e)}/>
					</div>
					<div>
						<button id="ivt-expand-btn" type="button" onClick={e=>this.ivtExpandClick(e)}>Expand</button>
					</div>
				</div>
				
				<div className="main-section display-none">
					<div className="scroll-container">
						<table className="block items-table table">
							<thead>
								<tr>
									<td className="margin-center text-center number">Index</td>

									<td className="margin-center text-center number">RowSpan</td>
									

									<td className="name">En_Name<button id="invNotiENGLISH_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ENGLISH_NAME")}>ASC</button></td>

									<td className="name">商品名稱<button id="invNotiCHINESE_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CHINESE_NAME")}>ASC</button></td>

									{this.state.loggedUser.TYPE_VIEW || this.state.loggedUser.TYPE_MODIFY ?
										<td className="margin-center text-center">Type<button id="invNotiTYPE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"TYPE")}>ASC</button></td> : null
									}

									<td className="margin-center text-center number">Shelf No<button id="invNotiSHELF_NO-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"SHELF_NO")}>ASC</button></td>
									
									<td>Manufacturer<button id="invNotiMANUFACTURE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"MANUFACTURE")}>ASC</button></td>


									{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
										<td className="margin-center text-center number">QTY<button id="invNotiQTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"QTY")}>ASC</button></td> : null
									} 


									{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
										<td className="margin-center text-center number">Total QTY<button id="invNotiT_QTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"T_QTY")}>ASC</button></td> : null
									} 


			 						{this.state.loggedUser.EXP_VIEW || this.state.loggedUser.EXP_MODIFY ?
										<td className="margin-center text-center">Exp<button id="invNotiEXPIRE_DATE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"EXPIRE_DATE")}>ASC</button></td>: null
									}


									{this.state.loggedUser.GRAM_VIEW || this.state.loggedUser.GRAM_MODIFY ?
										<td className="margin-center text-center">Gram<button id="invNotiGRAM-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"GRAM")}>ASC</button></td>: null
									}
								</tr>
							</thead>

							<tbody>
								{this.state.allNotificationItems.map((item,key)=>
									<tr key={key+1}>
										<td className="margin-center text-center number">{key+1}</td>
										
										{item.ROWSPAN > 0?
											<td rowSpan={item.ROWSPAN} className="margin-center text-center number">{item.ROWSPAN}</td>
											:null
										}
											
										<td className="name">
											<p id={`NAME_EN_V${item.ID}`}>{item.ENGLISH_NAME}</p>
										</td>

										<td className="name">
											<p id={`NAME_CH_V${item.ID}`}>{item.CHINESE_NAME}</p>
										</td>

										{this.state.loggedUser.TYPE_VIEW?
											<td className="margin-center text-center">
												<p>{item.TYPE}</p>
											</td> 
											:null
										}

										<td className="margin-center text-center number">
											<p>{item.SHELF_NO}</p>
										</td>

										<td id={`menu${item.ID}`} className="highlightColor">{item.MANUFACTURE}</td>
											{this.state.loggedUser.QTY_VIEW ?
											<td className="margin-center text-center number">
													<p>{item.QTY}</p>
											</td>
											:null
										}

										{this.state.loggedUser.QTY_VIEW ?
											item.ROWSPAN > 0? //allow to display number
												<td rowSpan = {item.ROWSPAN} className="margin-center text-center number">{item.T_QTY}</td>
												:null
											:null
										}

										{this.state.loggedUser.EXP_VIEW ?
											<td className="margin-center text-center">
												<p>{item.EXPIRE_DATE}</p>
											</td>	
											:null
										}

										{this.state.loggedUser.GRAM_VIEW ?
											<td className="margin-center text-center">
												<p>{item.GRAM}</p>
											</td>	
											:null
										}
									</tr>
								)}
									
							</tbody>
						</table>
					</div>
				</div>
			</div>

		);
	}
}
