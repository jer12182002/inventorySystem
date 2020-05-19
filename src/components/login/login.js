import {Link} from 'react-router-dom';
import React, { Component} from 'react';
import "./login.scss";


import $ from 'jquery';
class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        user:[],
        loggedInUserInfo: this.props.accountInfo
    }
  }




  accessLevel(level){
    var levelText = '';
    
    if(level === 1) {
      levelText = 'IT Admin';
    }else if (level === 2) {
      levelText = 'Manager';
    }else if(level === 3) {
      levelText = 'User';
    }

    return levelText;
  }

  getAccount(){
    fetch(`http://localhost:4000/login?account=${this.state.user.account}&password=${this.state.user.password}`)
    .then(res => res.json())
    .then(data => {
      if(data.data[0]){
      this.setState({loggedInUserInfo: data.data[0]},()=>{
        this.props.saveAccountFromLogIn(this.state.loggedInUserInfo);
      });
      }
    });
  }

	checkEmptyInput(){
		var goodInput= false;
    if($("#login_acc").val() && $("#login_pwd").val()){
      goodInput = true;
		}else {
			$(".login-wrapper .statusText").text("Please tpye valid account and password");
      $(".login-wrapper .statusText").addClass("warning-status");
		}
    return goodInput;
	}



  loginBtnClicked(e) {
    e.preventDefault();
    var account = $("#login_acc").val();
    var password = $("#login_pwd").val();
    this.setState({user:{account,password}},()=> this.getAccount());

  }


  logoutBtnClicked(e) {
    e.preventDefault();
    this.setState({
      user:[],
      loggedInUserInfo:[]
    },
    ()=>{
          // $(".login-wrapper .statusText").text("Successfully Logged Out");
          // $(".login-wrapper .loggedInBtns").addClass("display-none");
          // $(".login-wrapper .beforeLoggedInBtns").removeClass("display-none");
    this.props.clearAccountInfo();
    });
  }  
  

 
    
    render() {
        return (
        <div className="login-wrapper">
    	    <div className="header-section">
            <h1>Please type in your login information</h1>
          </div>
        	
          <div className="main-section">
        		<div className="login-panel block">
        			<form name="login" method="POST">
        			

        				{this.state.loggedInUserInfo.ID>0?
                  <div>
                    <div className="block loggedInBtns">
                      <button type="button"id="logoutBtn" className="btn" onClick = {e => this.logoutBtnClicked(e)}>Log Out</button>
                      <Link to="/" className="btn">Home Page</Link>
                      <Link to="/inventory" className="btn">Inventory</Link>
                      <Link to="/checkout" className="btn">Check out</Link>
                    </div>  
                  </div>
                  :
                  <div>  
                    <div className="block">
                      <label id="label_acc" className="block">Account</label>
                      <input id="login_acc" name="account"/>
                    </div>
                    <div className="block">
                      <label id="label_pwd" className="block">Password</label>
                      <input id="login_pwd" type="password" name="password"/>
                    </div>
                    <div className="block beforeLoggedInBtns">
                      <button type="button" id="loginBtn" className="btn" onClick = {e => this.loginBtnClicked(e)}>Login</button>
                      <Link to="/login/account/resetpassword" className="btn">Forget</Link>
                    </div>                    
                  </div>
                }

        			</form>
        		</div>
        		<div className = "statusText-container block">
        			<h3 className = "statusText success-status">
              {this.state.loggedInUserInfo.ID > 0? 
                "You have Successfully Logged In": null
              }
              </h3>
        		</div>
        	</div>
    </div>
        );
    }
}

export default Login;
