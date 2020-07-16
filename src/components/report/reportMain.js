import React from 'react';
import './reportMain.scss';

import {Link} from 'react-router-dom';


export default class reportMain extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className ="reportMain-wrapper">
				<div className="head-section text-center">
					<h1>Reports</h1>
				</div>
				<div className="main-section container-fluid">
					<div className = "row">
						<div className ="col-12 col-md-4 text-center">
							<Link to = {{
								pathname:"/report/precursor"
							}}>Precursor</Link>
						</div>
					</div>
				</div>
				
			</div>
		);
	}
}
