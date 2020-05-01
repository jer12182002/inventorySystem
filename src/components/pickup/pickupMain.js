import React from 'react';

export default class pickupMain extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			accountInfo: this.props.accountInfo
		}
	}

	componetDidMount(){
		
	}


	render() {
		return (
			<div className ="pick-wrapper">
				<div className="header-section">Pick up page {this.state.accountInfo.USERNAME}</div>
				<div className="main-section"></div>
			</div>
		);
	}
}
