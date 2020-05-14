import React from 'react';
import './activityLogs.scss';

import Moment from 'moment';
export default class activityLogs extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			accountInfo: this.props.accountInfo,
			inventoryLogs:[],
			chk_pickupLogs:[], 
			self_inventoryLogs:[],
			self_chk_pickupLogs:[]
		}
	}


	fetchAllLogs() {
		fetch("http://localhost:4000/login/account/displayActivities")
		.then(res=>res.json())
		.then(data=> {
			if(data && (data.inventoryLog[0] || data.chk_pickupLog[0])) {

				this.setState(
					{
						inventoryLogs: data.inventoryLog, 
						chk_pickupLogs: data.chk_pickupLog,
						self_inventoryLogs: data.inventoryLog.filter(f=> f.PERSON === this.state.accountInfo.USERNAME), 
						self_chk_pickupLogs: data.chk_pickupLog.filter(f=> f.PERSON === this.state.accountInfo.USERNAME)
					}
				);
			}
		})
	}

	componentDidMount() {
		this.fetchAllLogs();
	}

	render() {
		return (
			<div className="activityLogs-wrapper">
				{this.state.accountInfo.ACCESS_LEVEL < 3 ? 
				<>
				{this.state.inventoryLogs.length >0 ?
				<div className="block inventoryActivityLog-container">
					<h3>Inventory Logs</h3>
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Time</th>
								<th>Action</th>
								<th>Detail</th>
								<th>Person</th>
							</tr>
						</thead>
						<tbody>
						{this.state.inventoryLogs.map((log, key)=>
							<tr key={`invLog-${key+1}`}>
								<td>{key+1}</td>
								<td>{Moment(log.TIME).format('YYYY-MM-DD HH:MM:SS')}</td>
								<td className="logAction">{log.ACTION}</td>
								<td className="logDetail">{log.DETAIL}</td>
								<td>{log.PERSON}</td>
							
							</tr>
						)}
						</tbody>
					</table>
				</div>
				:
				null
				}

				{this.state.chk_pickupLogs.length >0 ?
				<div className="block chk_pickupActivityLog-container">
					<h3>Checkout & Pickup Logs</h3>
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Time</th>
								<th>Action</th>
								<th>Detail</th>
								<th>Person</th>
							</tr>
						</thead>
						<tbody>
						{this.state.chk_pickupLogs.map((log, key)=>
							<tr key={`chk_pickupLog-${key+1}`}>
								<td>{key+1}</td>
								<td>{Moment(log.TIME).format('YYYY-MM-DD HH:MM:SS')}</td>
								<td className="logAction">{log.ACTION}</td>
								<td className="logDetail">{log.DETAIL}</td>
								<td>{log.PERSON}</td>
							
							</tr>
						)}
						</tbody>
					</table>
				</div>
				:
				null
				}
			
				</>
				:

				<>
				{this.state.self_inventoryLogs.length > 0 ?
				<div className="block inventoryActivityLog-container">
					<h3>Inventory Logs</h3>
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Time</th>
								<th>Action</th>
								<th>Detail</th>
							</tr>
						</thead>
						<tbody>
						{this.state.self_inventoryLogs.map((log, key)=>
							<tr key={`invLog-${key+1}`}>
								<td>{key+1}</td>
								<td>{Moment(log.TIME).format('YYYY-MM-DD HH:MM:SS')}</td>
								<td className="logAction">{log.ACTION}</td>
								<td className="logDetail">{log.DETAIL}</td>
							</tr>
						)}
						</tbody>
					</table>
				</div>
				:
				null
				}

				{this.state.self_chk_pickupLogs.length >0 ?
				<div className="block chk_pickupActivityLog-container">
					<h3>Checkout & Pickup Logs</h3>
					<table>
						<thead>
							<tr>
								<th>Index</th>
								<th>Time</th>
								<th>Action</th>
								<th>Detail</th>
								<th>Person</th>
							</tr>
						</thead>
						<tbody>
						{this.state.self_chk_pickupLogs.map((log, key)=>
							<tr key={`chk_pickupLog-${key+1}`}>
								<td>{key+1}</td>
								<td>{Moment(log.TIME).format('YYYY-MM-DD HH:MM:SS')}</td>
								<td className="logAction">{log.ACTION}</td>
								<td className="logDetail">{log.DETAIL}</td>							
							</tr>
						)}
						</tbody>
					</table>
				</div>
				:
				null
				}
				</>
				}

			</div>
		);
	}
}
