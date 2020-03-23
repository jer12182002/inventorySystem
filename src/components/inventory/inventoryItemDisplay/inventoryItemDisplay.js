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
			//console.log(data.data);
			this.setState({allItems: data.data});
		});
	}
	


	clickEdit(e, key){
		e.preventDefault();
		$("#edit-btn"+key).addClass("display-none");
		$("#functional-Btns"+key).removeClass("display-none");
	}

	render() {

		return (
			<div className="inventoryitemdisplay-wrapper">
				<div className="notification-panel"></div>

				<div className="header-section">Item Info</div>
				
				<div className="main-section">

				<table className="block items-table table">
					<thead>
					<tr>
						<td className="margin-center text-center">
							Row
						</td>

						<td>En_Name</td>

						<td>CH_name</td>

						{this.state.loggedUser.TYPE_VIEW || this.state.loggedUser.TYPE_MODIFY ?
							<td className="margin-center text-center">Type</td> : null
						}

						<td className="margin-center text-center">Shelf No</td>
						<td>Manufacturer</td>


						{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
							<td className="margin-center text-center">QTY</td> : null
						} 

						{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
							<td className="margin-center text-center">Total QTY</td> : null
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
						<td className="margin-center text-center">{key+1}</td>


						<td>
							<p>{item.ENGLISH_NAME}</p>
							{this.state.loggedUser.NAME_MODIFY? 
								<input type="text"></input>:null
							}
						</td>
						
						<td>
							<p>{item.CHINESE_NAME}</p>
							{this.state.loggedUser.NAME_MODIFY? 
								<input type="text"></input>:null
							}
						</td>

					

						{this.state.loggedUser.TYPE_VIEW?
							this.state.loggedUser.TYPE_MODIFY? 
								<td className="margin-center text-center">
									<p>{item.TYPE}</p>
									<select id={`TYPE_MODIFY${key}`}>
										{this.state.types.map((type,keyIndex)=>
											<option key={keyIndex}>{type.ITEM_TYPE}</option>					
										)}
									</select>
								</td>
								: <td className="margin-center text-center">{item.TYPE}</td> 
							:null
						}


				

						<td className="margin-center text-center">{item.SHELF_NO}</td>
						
						<td>{item.MANUFACTURE}</td>
						
						{this.state.loggedUser.QTY_VIEW ?
							this.state.loggedUser.QTY_MODIFY?
								<td className="margin-center text-center">
									<p>{item.QTY}</p>
									<input id={`QTY_MODIFY${key}`}type="number"></input>
								</td>
								:<td className="margin-center text-center">{item.QTY}</td>
							:null
						}



						{this.state.loggedUser.QTY_VIEW || this.state.loggedUser.QTY_MODIFY?
							<td className="margin-center text-center">{item.QTY}</td> : null
						} 


						{this.state.loggedUser.EXP_VIEW ?
							this.state.loggedUser.EXP_MODIFY? 
								<td className="margin-center text-center">
									<p>{item.EXPIRE_DATE}</p>
									<input type="date"></input>
								</td>
								:<td className="margin-center text-center">{item.EXPIRE_DATE}</td>	
							:null
						}


						{this.state.loggedUser.GRAM_VIEW ?
							this.state.loggedUser.GRAM_MODIFY?
								<td className="margin-center text-center">
									<p>{item.GRAM}</p>
									<input type="number"></input>
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
								<button type="button" className="btn btn-success">Save</button>
								<button type="button" className="btn btn-danger">Cancel</button>
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
