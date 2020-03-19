import React from 'react';

export default class editUser extends React.Component {

	componentDidMount(){
		
		console.log(this.props.location.state);
		console.log(this.props);
	}
	render() {
		return (
			<div>edit user</div>
		);
	}
}
