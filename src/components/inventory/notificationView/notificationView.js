import React from 'react';
import './notificationView.scss';
import $ from 'jquery';

export default class notificationView extends React.Component {
	constructor(props) {
		super(props);

		let date = new Date();

		this.state = {
			loggedUser: this.props.loggedUser
		}


	}



	
	componentDidMount() {
		this.props.loadAllNotificationItems(this.props.defaultExpiryDate);
		//this.props.loadAllItem('',this.props.defaultExpiryDate);
	}




//========================================= Display Functions ========================================================================




//============================== Work Functions =============================================================
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
						<h3 className="inline-b"><strong>{this.props.allNotificationItems.length}</strong> Items Will Expire After: </h3>
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
									

									<td className="name">En_Name</td>

									<td className="name">商品名稱</td>

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
								</tr>
							</thead>

							<tbody>
								{this.props.allNotificationItems.map((item,key)=>
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
