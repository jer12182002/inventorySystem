import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.scss';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class header extends React.Component {

	logoutClick = (e)=>{
		e.preventDefault();
		cookies.remove("RenDeInc-LoggedUser");
		this.props.logoutBtnClicked();
	}



	render() {
		return (
			<div className="header-wrapper">
				<header>

					<h1><NavLink to="/">Ren De Inc Inventory System</NavLink></h1>
				
					{this.props.accountInfo.USERNAME?
						(<ul>
							<li><button href="/" id="logout-btn" onClick = {e => {this.logoutClick(e)}}>Log Out</button></li>
							<li><NavLink to="/login/account" activeClassName="header-nav-active">{this.props.accountInfo.USERNAME}</NavLink></li>
							<li><NavLink to="/inventory" activeClassName="header-nav-active">Inventory</NavLink></li>
							<li><NavLink to="/checkout" activeClassName="header-nav-active">Checkout</NavLink></li>
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
