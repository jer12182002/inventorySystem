import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.scss';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class header extends React.Component {

	logoutClick = (e)=>{
		e.preventDefault();
		cookies.remove('user');
		this.props.logoutBtnClicked();
	}



	render() {
		return (
			<div className="header-wrapper">
				<header>

					<h1><a href="/">Ren De Inc Inventory System</a></h1>
				
					{this.props.accountInfo.USERNAME?
						(<ul>
							<li><NavLink to="/login/account">{this.props.accountInfo.USERNAME}</NavLink></li>
							<li><NavLink to="/" id="logout-btn" onClick = {e => {this.logoutClick(e)}}>Log Out</NavLink></li>
							<li><NavLink to="/inventory">Inventory</NavLink></li>
							<li><NavLink to="/checkout">Checkout</NavLink></li>
						</ul>)
						:
						(<ul>
							<li><a id="headerUserLink"href="/login">Log In</a></li>
						</ul>)
					}
				</header>

				
			</div>
		);
	}
}

export default header;
