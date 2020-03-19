import React from 'react';
import {BrowserRouter as Switch,Router, Route} from 'react-router-dom';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";


import Header from "./components/header/header";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Account from "./components/login/account/account";
import Register from "./components/login/register/register";
import LoginReset from "./components/login/loginReset/loginReset";

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends React.Component {

state = {
  accountInfo: [],
  affectedAccount:[]
}

receiveFromChild = (childrenData) => {
  if(childrenData) {
    this.setState ({
      accountInfo: childrenData
    });
    cookies.set('user',childrenData);
  }
}

saveAffectedAccount = (receivedAffectedAccount)=>{
  console.log("123123");
}

componentDidMount(){
  let cookieUser = cookies.get('user');

  if(cookieUser){
    this.setState({
      accountInfo : cookieUser
    });
  }
}
render(){
  return (
  <div className="main-wrapper">
     
      <Header accountInfo = {this.state.accountInfo}/>

       {this.state.accountInfo.ACCESS_LEVEL<3 ? (
      <Switch>
        <Route exact path = "/login/account/register" forcerefresh={true}>
          <Register accountInfo = {this.state.accountInfo}/>
        </Route>
      </Switch>
      ):null
      }
      <Switch>
      	
        <Route exact path="/login">
          <Login getDataFromChildren = {this.receiveFromChild} />
        </Route> 
        <Route exact path = "/login/account">
          <Account accountInfo = {this.state.accountInfo}/>
        </Route>
        <Route exact path = "/login/account/resetpassword">
          <LoginReset/>
        </Route>
        <Route exact path="/">
          <Home accountInfo = {this.state.accountInfo}/>
        </Route>
      </Switch>


     
    </div>
  );
}
}
export default App;
