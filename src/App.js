import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";


import Header from "./components/header/header";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Account from "./components/login/account/account";
import Register from "./components/login/register/register";
import LoginReset from "./components/login/loginReset/loginReset";
import EditUser from "./components/login/editUser/editUser";

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends React.Component {

state = {
  accountInfo: []
}

receiveFromChild = (childrenData) => {
  if(childrenData) {
    this.setState ({
      accountInfo: childrenData
    });
    cookies.set('user',childrenData);
  }

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
      <Router>
         <Route exact path = "/login/account/editUser" component={EditUser}/>
         <Route exact path = "/login/account/register">
          <Register accountInfo = {this.state.accountInfo}/>
        </Route>
      </Router>
      ):null
      }
      <Router>
      	<Route exact path="/">
          <Home accountInfo = {this.state.accountInfo}/>
        </Route>
        <Route exact path="/login">
          <Login getDataFromChildren = {this.receiveFromChild} />
        </Route> 
        <Route exact path = "/login/account">
          <Account accountInfo = {this.state.accountInfo}/>
        </Route>
        <Route exact path = "/login/reset">
          <LoginReset/>
        </Route>

      </Router>


     
    </div>
  );
}
}
export default App;
