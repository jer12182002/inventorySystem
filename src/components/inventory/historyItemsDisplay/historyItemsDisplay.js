import React from 'react';
import './historyItemsDisplay.scss';

import $ from 'jquery';
import Moment from 'moment';


export default class historyItemsDisplay extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			allHistoryItems : []
		}
	}


	componentWillReceiveProps(newProps) {
	  if (this.state.allHistoryItems !== newProps.allHistoryItems) {
	    this.setState({allHistoryItems: newProps.allHistoryItems});
	  }
	}

//============================== Work Functions =============================================================


	ivtExpandClick (e) {
		e.preventDefault();
		if($('#ivtHistory-expand-btn').text()==="Expand") {
			$('.historyItemsDisplay-wrapper .main-section').removeClass("display-none");
			$('#ivtHistory-expand-btn').text("Close");
		}
		else {
			$('.historyItemsDisplay-wrapper .main-section').addClass("display-none");
			$('#ivtHistory-expand-btn').text("Expand");	
		}	
	}


	sortToggleBtnClick(e, field) {
		e.preventDefault();

		let fieldBtnText = $(`#invHistory${field}-sortToggleBtn`).text();
		let sortedData = this.props.quickSort(field, this.state.allHistoryItems,0, this.state.allHistoryItems.length-1);
			
		if(fieldBtnText === 'ASC') {
			
			$(`#invHistory${field}-sortToggleBtn`).text('DESC');
		}else {
				sortedData.reverse();
			$(`#invHistory${field}-sortToggleBtn`).text('ASC');
		}

		this.setState({allHistoryItems: this.props.setStateWithRowSpan(sortedData)});
	}





	render() {
		return (
			<div className="historyItemsDisplay-wrapper category-wrappr">
				<div className="header-section">
					<div className="title-container">
						<h3 className="title">History Items</h3>
					</div>
					<div className="qty-container">
						<h3 className="inline-b"><strong>{this.state.allHistoryItems.length}</strong> History Items In Record</h3>	
					</div>
					<div>
						<button id="ivtHistory-expand-btn" type="button" onClick={e=>this.ivtExpandClick(e)}>Expand</button>
					</div>
				</div>

				<div className="main-section display-none">
					<div className="scroll-container">
						<table className="block items-table table">
							<thead>
								<tr>
									<td className="margin-center text-center verticalMiddle number">Index</td>

									<td className="margin-center text-center verticalMiddle number">Row<br/>Span</td>
									

									<td className="name">En_Name<br/><button id="invHistoryENGLISH_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ENGLISH_NAME")}>ASC</button></td>

									<td className="name">商品名稱<br/><button id="invHistoryCHINESE_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CHINESE_NAME")}>ASC</button></td>

									{this.props.loggedUser.TYPE_VIEW || this.props.loggedUser.TYPE_MODIFY ?
										<td className="margin-center text-center">Type<br/><button id="invHistoryTYPE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"TYPE")}>ASC</button></td> : null
									}

									<td className="margin-center text-center number">Shelf No<br/><button id="invHistorySHELF_NO-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"SHELF_NO")}>ASC</button></td>
									
									<td>Manu.<br/><button id="invNotiMANUFACTURE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"MANUFACTURE")}>ASC</button></td>


									{this.props.loggedUser.QTY_VIEW || this.props.loggedUser.QTY_MODIFY?
										<td className="margin-center text-center number">QTY<br/><button id="invHistoryQTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"QTY")}>ASC</button></td> : null
									} 


			 						{this.props.loggedUser.EXP_VIEW || this.props.loggedUser.EXP_MODIFY ?
										<td className="margin-center text-center">Exp<br/><button id="invHistoryEXPIRE_DATE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"EXPIRE_DATE")}>ASC</button></td>: null
									}


									{this.props.loggedUser.GRAM_VIEW || this.props.loggedUser.GRAM_MODIFY ?
										<td className="margin-center text-center">Gram<br/><button id="invHistoryGRAM-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"GRAM")}>ASC</button></td>: null
									}
								</tr>
							</thead>

							<tbody>
								{this.state.allHistoryItems.map((item,key)=>
									<tr key={key+1}>
										<td className="margin-center text-center number">{key+1}</td>
										
										{item.ROWSPAN > 0?
											<td rowSpan={item.ROWSPAN} className="margin-center text-center number">{item.ROWSPAN}</td>
											:null
										}
											
										<td className="text-left bg-width">
											<p id={`NAME_EN_V${item.ID}`}>{item.ENGLISH_NAME}</p>
										</td>

										<td className="text-left bg-width">
											<p id={`NAME_CH_V${item.ID}`}>{item.CHINESE_NAME}</p>
										</td>

										{this.props.loggedUser.TYPE_VIEW?
											<td>
												<p>{item.TYPE}</p>
											</td> 
											:null
										}

										<td>
											<p>{item.SHELF_NO}</p>
										</td>

										<td id={`menu${item.ID}`} className="highlightColor">{item.MANUFACTURE}</td>
											{this.props.loggedUser.QTY_VIEW ?
											<td>
													<p>{item.QTY}</p>
											</td>
											:null
										}


										{this.props.loggedUser.EXP_VIEW ?
											<td className="bg-width">
												<p>{Moment(item.EXPIRE_DATE).format('YYYY-MM-DD')}</p>
											</td>	
											:null
										}

										{this.props.loggedUser.GRAM_VIEW ?
											<td>
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
