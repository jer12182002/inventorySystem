import React from 'react';
import './activityLogs.scss';

import $ from 'jquery';
import Moment from 'moment';
export default class activityLogs extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			accountInfo: this.props.accountInfo,
			inventoryLogs_BACKUP:[],
			chk_pickupLogs_BACKUP:[],
			inventoryLogs:[],
			chk_pickupLogs:[]
		}
	}


	fetchAllLogs() {
		fetch("http://localhost:4000/login/account/displayActivities")
		.then(res=>res.json())
		.then(data=> {
			if(data && (data.inventoryLog[0] || data.chk_pickupLog[0])) {
				if(this.state.accountInfo.ACCESS_LEVEL <3) {
					this.setState(
						{
							inventoryLogs_BACKUP: data.inventoryLog, 
							chk_pickupLogs_BACKUP: data.chk_pickupLog,
							inventoryLogs: data.inventoryLog, 
							chk_pickupLogs: data.chk_pickupLog
						}
					);

				}else {
					this.setState(
						{
							inventoryLogs_BACKUP: data.inventoryLog.filter(f=> f.PERSON === this.state.accountInfo.USERNAME), 
							chk_pickupLogs_BACKUP: data.chk_pickupLog.filter(f=> f.PERSON === this.state.accountInfo.USERNAME),
							inventoryLogs: data.inventoryLog.filter(f=> f.PERSON === this.state.accountInfo.USERNAME), 
							chk_pickupLogs: data.chk_pickupLog.filter(f=> f.PERSON === this.state.accountInfo.USERNAME)
						}
					);
				}
			}
		});
	}

	searchKeyword (e,type) {
		e.preventDefault();
		
		if(type==="inventory") {
			let keyupValue = $.trim($("#inventroyLogs-search").val()).toLowerCase();
			if(keyupValue === "") {
				this.setState({inventoryLogs:this.state.inventoryLogs_BACKUP});
			}else {
				let filterData = this.state.inventoryLogs_BACKUP.filter(f => 
					Moment(f.TIME).format('YYYY-MM-DD').includes(keyupValue)||
					f.ACTION.toLowerCase().includes(keyupValue)||
					f.DETAIL.toLowerCase().includes(keyupValue)||
					f.PERSON.toLowerCase().includes(keyupValue)
				);
				this.setState({inventoryLogs: filterData});
			}
		}else {
			let keyupValue = $.trim($("#chk_PickLogs-search").val()).toLowerCase();
			if(keyupValue === "") {
				this.setState({chk_pickupLogs:this.state.chk_pickupLogs_BACKUP});
			}else {
				let filterData = this.state.chk_pickupLogs_BACKUP.filter(f => 
					Moment(f.TIME).format('YYYY-MM-DD').includes(keyupValue)||
					f.ACTION.toLowerCase().includes(keyupValue)||
					f.DETAIL.toLowerCase().includes(keyupValue)||
					f.PERSON.toLowerCase().includes(keyupValue)
				);
				this.setState({chk_pickupLogs: filterData});
			}
		}
	}


	sortLogs(e, type, field) {
		e.preventDefault();
		let btnText = $(`#${type}-${field}-sortToggle`).text();
		let sortData = [];

		if(type === "inventory") {
			sortData = this.state.inventoryLogs;
		}else {
			sortData = this.state.chk_pickupLogs;
		}

		sortData = sortData.sort((a,b)=>{
			return btnText === "ASC"? a[field.toUpperCase()].localeCompare(b[field.toUpperCase()]) : b[field.toUpperCase()].localeCompare(a[field.toUpperCase()]);
		})

		 $(`#${type}-${field}-sortToggle`).text(btnText === "ASC"? "DESC" : "ASC");
		
		if(type === "inventory") {
			this.setState({inventoryLogs:sortData});
		}else {
			this.setState({chk_pickupLogs:sortData});
		}

	}



	componentDidMount() {
		this.fetchAllLogs();
	}




	render() {
		return (
			<div className="activityLogs-wrapper">
				
				<div className="block activityLogs-container">
					<div className="log-header">
						<h3>Inventory Logs</h3>
						<div className="search-container inline-b">
							<h4>Filter: </h4>
							<input id="inventroyLogs-search" type="text" onKeyUp={e=>this.searchKeyword(e,"inventory")}/>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Time<button id="inventory-time-sortToggle" onClick={e=> this.sortLogs(e,"inventory","time")}>ASC</button></th>
								<th>Action<button id="inventory-action-sortToggle" onClick={e=> this.sortLogs(e,"inventory","action")}>ASC</button></th>
								<th>Detail<button id="inventory-detail-sortToggle" onClick={e=> this.sortLogs(e,"inventory","detail")}>ASC</button></th>
								{this.state.accountInfo.ACCESS_LEVEL<3?
								<th>Person<button id="inventory-person-sortToggle" onClick={e=> this.sortLogs(e,"inventory","person")}>ASC</button></th>:null
								}
							</tr>
						</thead>
						<tbody>
						{this.state.inventoryLogs.map((log, key)=>
							<tr key={`invLog-${key+1}`}>
								<td>{key+1}</td>
								<td>{Moment(log.TIME).format('YYYY-MM-DD HH:MM:SS')}</td>
								<td className="logAction">{log.ACTION}</td>
								<td className="logDetail">{log.DETAIL}</td>
								{this.state.accountInfo.ACCESS_LEVEL<3?
								<td>{log.PERSON}</td>
								:
								null
								}
							</tr>
						)}
						</tbody>
					</table>
				</div>
				
				
				<div className="block activityLogs-container">
					<div className="log-header">
						<h3>Checkout & Pickup Logs</h3>
						<div className="search-container inline-b">
							<h4>Filter: </h4>
							<input id="chk_PickLogs-search" type="text" onKeyUp={e=>this.searchKeyword(e,"chk_pickup")}/>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Time<button id="chk_pickup-time-sortToggle" onClick={e=> this.sortLogs(e,"chk_pickup","time")}>ASC</button></th>
								<th>Action<button id="chk_pickup-action-sortToggle" onClick={e=> this.sortLogs(e,"chk_pickup","action")}>ASC</button></th>
								<th>Detail<button id="chk_pickup-detail-sortToggle" onClick={e=> this.sortLogs(e,"chk_pickup","detail")}>ASC</button></th>
								{this.state.accountInfo.ACCESS_LEVEL<3?
								<th>Person<button id="chk_pickup-person-sortToggle" onClick={e=> this.sortLogs(e,"chk_pickup","person")}>ASC</button></th>:null
								}
							</tr>
						</thead>
						<tbody>
						{this.state.chk_pickupLogs.map((log, key)=>
							<tr key={`chk_pickupLog-${key+1}`}>
								<td>{key+1}</td>
								<td>{Moment(log.TIME).format('YYYY-MM-DD HH:MM:SS')}</td>
								<td className="logAction">{log.ACTION}</td>
								<td className="logDetail">{log.DETAIL}</td>
								{this.state.accountInfo.ACCESS_LEVEL<3?
								<td>{log.PERSON}</td>
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
