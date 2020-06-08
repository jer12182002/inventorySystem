import React from 'react';
import './holdItemsDisplay.scss';

import $ from 'jquery';

export default class holdItemsDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allHoldItems : this.props.allHoldItems
		}
	}



	componentWillReceiveProps(newProps) {
	  if (this.state.allHoldItems !== newProps.allHoldItems) {
	    this.setState({allHoldItems: newProps.allHoldItems});
	  }
	}
	

	
	


	//===================================== Button Function ==================================== 
	holdExpandClick(e) {
		e.preventDefault();
		if($('#hold-expand-btn').text() === "Expand") {
			$('.holditemsdisplay-wrapper .main-section').removeClass("display-none");
			$('#hold-expand-btn').text("Close");
		}else {
			$('.holditemsdisplay-wrapper .main-section').addClass("display-none");
			$('#hold-expand-btn').text("Expand");
		}
	}


	restockBtnsFunction(e, key, action) {
		e.preventDefault();
		if(action === "restock") {
			$(`#holdRe-stock-container${key}`).addClass("display-none");
			$(`#hold-btns${key}`).removeClass("display-none");
		}
		else if (action === "clear"){
			$(`#hold-btns${key}`).addClass("display-none");	
			$(`#holdRe-stock-container${key}`).removeClass("display-none");
		}
	}


	sortToggleBtnClick(e, field) {
		e.preventDefault();

		let fieldBtnText = $(`#invhold${field}-sortToggleBtn`).text();
		let sortedData = this.props.quickSort(field, this.state.allHoldItems, 0 , this.state.allHoldItems.length-1);
			
		if(fieldBtnText === 'ASC') {
			
			$(`#invhold${field}-sortToggleBtn`).text('DESC');
		}else {
			sortedData.reverse();
			$(`#invhold${field}-sortToggleBtn`).text('ASC');
		}

		this.setState({allHoldItems:sortedData});
	}



	render() {
		return (
			<div className="holditemsdisplay-wrapper category-wrappr">
				<div className="header-section">
					<div className="title-container">
						<h3 className="title">Hold Items</h3>
					</div>
					<div className="qty-container">
						<h3 className="inline-b"><strong>{this.state.allHoldItems.length}</strong> Items Are On Hold</h3>
					</div>
					<div>
						<button id="hold-expand-btn" type="button" onClick={e=>this.holdExpandClick(e)}>Expand</button>
					</div>
				</div>
				<div className="main-section display-none">
					<div className="scroll-container">
						<table className="block items-table table">
							<thead>
								<tr>
									<td className="verticalMiddle number">Index</td>
									<td>Name<br/><button id="invholdENGLISH_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"ENGLISH_NAME")}>ASC</button></td>
									<td>商品名稱<br/><button id="invholdCHINESE_NAME-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"CHINESE_NAME")}>ASC</button></td>
									{this.props.loggedUser.TYPE_VIEW ? 
										<td>Type<br/><button id="invholdTYPE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"TYPE")}>ASC</button></td> : null
									}

									<td>Mfr.<br/><button id="invholdMANUFACTURE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"MANUFACTURE")}>ASC</button></td>
									
									{this.props.loggedUser.EXP_VIEW ?
										<td>Expiry Date<br/><button id="invholdEXPIRE_DATE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"EXPIRE_DATE")}>ASC</button></td> : null
									}

									{this.props.loggedUser.GRAM_VIEW ? 
										<td className="number">Gram<br/><button id="invholdGRAM-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"GRAM")}>ASC</button></td> :null
									}
									<td>Hold For<br/><button id="invholdPERSON-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"PERSON")}>ASC</button></td>

									{this.props.loggedUser.QTY_VIEW ?
										<td className="number">Hold Qty<br/><button id="invholdHOLD_QTY-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"HOLD_QTY")}>ASC</button></td> : null
									}


									{this.props.loggedUser.EXP_VIEW ?
										<td>Hold Exp<br/><button id="invholdDATE-sortToggleBtn" onClick= {e=>this.sortToggleBtnClick(e,"DATE")}>ASC</button></td> : null
									}

									{this.props.loggedUser.QTY_MODIFY? 
										<td className="verticalMiddle">Action</td> : null
									}

								</tr>
							</thead>

							<tbody>
								{this.state.allHoldItems.map((item,key)=> 
									<tr key={key+1}>
										<td>{key+1}</td>
										<td className="text-left bg-width">{item.ENGLISH_NAME}</td>
										<td className="text-left bg-width">{item.CHINESE_NAME}</td>
										{this.props.loggedUser.TYPE_VIEW ?
											<td>{item.TYPE}</td> : null
										}
										<td>{item.MANUFACTURE}</td>

										{this.props.loggedUser.EXP_VIEW ?
											<td>{item.EXPIRE_DATE}</td> : null
										}

										{this.props.loggedUser.GRAM_VIEW ?
											<td>{item.GRAM}</td> : null
										}
										<td>{item.PERSON}</td>

										{this.props.loggedUser.QTY_VIEW ? 
											<td>{item.HOLD_QTY}</td> : null
										}

										{this.props.loggedUser.EXP_VIEW ?
											<td>{item.DATE === '0000-00-00'? '' : item.DATE}</td> : null
										}

										{this.props.loggedUser.QTY_MODIFY ?
											<td>
												<div id={`holdRe-stock-container${key}`}>
													<button className="btn btn-primary" stype="button" onClick = {e =>this.restockBtnsFunction(e,key,"restock")}>Restock</button>
												</div>
												<div id={`hold-btns${key}`} className="display-none">
													<button type="button" className="btn btn-success" onClick = {e => {this.props.restockAction(item);this.restockBtnsFunction(e,key,"clear");}}>Confirm</button>
													<button type="button" className="btn btn-warning" onClick = {e => this.restockBtnsFunction(e,key,"clear")}>Cancel</button>
												</div>
											</td>
											:
											null
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
