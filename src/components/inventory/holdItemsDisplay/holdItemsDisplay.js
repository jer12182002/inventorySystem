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


	render() {
		return (
			<div className="holditemsdisplay-wrapper">
				<div className="header-section">
					<div>
						<h3 className="title">Hold Items</h3>
					</div>
					<div>
						<h3 className="inline-b"><strong>{this.state.allHoldItems.length}</strong> Items Are On Hold: </h3>
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
									<td className="margin-center text-center number">Index</td>
									<td>name</td>
									<td>商品名稱</td>
									{this.props.loggedUser.TYPE_VIEW ? 
										<td className="margin-center text-center">Type</td> : null
									}

									<td>Manufacturer</td>
									{this.props.loggedUser.EXP_VIEW ?
										<td className="margin-center text-center">Expiry Date</td> : null
									}

									{this.props.loggedUser.GRAM_VIEW ? 
										<td className="margin-center text-center number">Gram</td> :null
									}
									<td>Hold For</td>

									{this.props.loggedUser.QTY_VIEW ?
										<td className="margin-center text-center number">Hold Qty</td> : null
									}


									{this.props.loggedUser.EXP_VIEW ?
										<td className="margin-center text-center">Hold Exp</td> : null
									}

									{this.props.loggedUser.QTY_MODIFY? 
										<td className="margin-center text-center">Action</td> : null
									}

								</tr>
							</thead>

							<tbody>
								{this.state.allHoldItems.map((item,key)=> 
									item.DATE === this.props.today?
									this.props.restockAction(item)
									
									:

									<tr key={key+1}>
										<td className="margin-center text-center">{key+1}</td>
										<td>{item.ENGLISH_NAME}</td>
										<td>{item.CHINESE_NAME}</td>
										{this.props.loggedUser.TYPE_VIEW ?
											<td className="margin-center text-center">{item.TYPE}</td> : null
										}
										<td>{item.MANUFACTURE}</td>

										{this.props.loggedUser.EXP_VIEW ?
											<td className="margin-center text-center">{item.EXPIRE_DATE}</td> : null
										}

										{this.props.loggedUser.GRAM_VIEW ?
											<td className="margin-center text-center number">{item.GRAM}</td> : null
										}
										<td>{item.PERSON}</td>

										{this.props.loggedUser.QTY_VIEW ? 
											<td className="margin-center text-center number">{item.HOLD_QTY}</td> : null
										}

										{this.props.loggedUser.EXP_VIEW ?
											<td className="margin-center text-center">{item.DATE === '0000-00-00'? '' : item.DATE}</td> : null
										}

										{this.props.loggedUser.QTY_MODIFY ?
											<td className="margin-center text-center">
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
