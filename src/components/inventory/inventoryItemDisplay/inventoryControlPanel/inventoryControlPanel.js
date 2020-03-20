import React from 'react';
import './inventoryControlPanel.scss';

export default class inventoryControlPanel extends React.Component {

	constructor(props) {
		super(props);
		this.loadSelect();

		this.state = {
			types: []
		}
	}


	loadSelect(){
		console.log('load');
		fetch(`http://localhost:4000/inventory/loadSelect`)
		.then(res => res.json())
		.then(data => {
			this.setState({types: data.data});
			console.log(this.state.types);
		});
	}

	render() {
		return (
			<div className="controlPanel-wrapper">
				<div className="inline-b">
					<label>Type</label>
				
				{this.state.types.map((index, type) =>
						<h1 key={index}>{type.ITEM_TYPE}</h1>
				 )}
					
					
					<button className="btn btn-success">Add</button>
				</div>
			</div>
		);
	}
}
