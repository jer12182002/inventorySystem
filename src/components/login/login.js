import React, { Component} from 'react';
import "./login.scss";
import $ from 'jquery';
class Login extends Component {
  
  state = {
      user:[],
      loggedInUserInfo:[]
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
    //console.log(`localhost:4000/login?account=${this.state.user.account}&password=${this.state.user.password}`);
    fetch(`http://localhost:4000/login?account=${this.state.user.account}&password=${this.state.user.password}`)
    .then(res => res.json())
    .then(data => {
      if(data.data[0]){
      this.setState({loggedInUserInfo: data.data[0]},()=>{
       // console.log(this.state.loggedInUserInfo);
        $(".login-wrapper .statusText").html("Successfully logged in as : " + this.state.loggedInUserInfo.USERNAME 
          + '<br/> Access Level: ' + this.accessLevel(this.state.loggedInUserInfo.ACCESS_LEVEL));
        this.props.getDataFromChildren(this.state.loggedInUserInfo);
        $('.login-wrapper .statusText').addClass("success-status");
        $('.login-wrapper .statusText').removeClass("warning-status");

        $(".login-wrapper .beforeLoggedInBtns").addClass("display-none");
        $(".login-wrapper .loggedInBtns").removeClass("display-none");
      
      })
      }else {
        $('.login-wrapper .statusText').text('Invalid Account or Password');
        $('.login-wrapper .statusText').removeClass("success-status");
        $('.login-wrapper .statusText').addClass("warning-status");
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

   	componentDidMount(){

   		$("#loginBtn").click(()=>{
   			if(this.checkEmptyInput()){

          var account = $("#login_acc").val();
          var password = $("#login_pwd").val();
          this.setState({user:{account,password}});
          this.getAccount();
          
          // this.props.getDataFromChildren('555555');
        }
   		});

      $("#logoutBtn").click(()=>{
        this.setState({
          user:[],
          loggedInUserInfo:[]
        },
        ()=>{
          console.log("@@@@"+this.state.loggedInUserInfo.ACCESS_LEVEL);
          $(".login-wrapper .statusText").text("Successfully Logged Out");
          $(".login-wrapper .loggedInBtns").addClass("display-none");
          $(".login-wrapper .beforeLoggedInBtns").removeClass("display-none");
        });
      })

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
        				<div className="block">
    	    				<label id="label_acc" className="block">Account</label>
    	    				<input id="login_acc" name="account"/>
        				</div>
        				<div className="block">
    	    				<label id="label_pwd" className="block">Password</label>
    	    				<input id="login_pwd" type="password" name="password"/>
        				</div>
        				<div className="block beforeLoggedInBtns">
    	    				<button type="button" id="loginBtn" className="btn">Login</button>
    	    				<a href="/login/reset" className="btn">Forget</a>
        				</div>
                <div className="block loggedInBtns display-none">
                  <button type="button"id="logoutBtn" className="btn">Log Out</button>
                  <a href="/" className="btn">Home Page</a>
                  <a href="/inventory" className="btn">Inventory</a>
                  <a href="/checkout" className="btn">Check out</a>
                </div>
        			</form>
        		</div>
        		<div className = "statusText-container block">
        			<h3 className = "statusText success-status"></h3>
        		</div>
        	</div>
    </div>
        );
    }
}

export default Login;
