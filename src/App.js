import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";


import Header from "./components/header/header";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Account from "./components/login/account/account";
import Register from "./components/login/register/register";
import LoginReset from "./components/login/loginReset/loginReset";

import InventoryMain from './components/inventory/inventoryMain';

import CheckOut from './components/checkout/checkoutMain';
import OngoingItem from "./components/checkout/ongoingItem/ongoingItem";

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends React.Component {
intervalName = "accountCheck";

constructor(props){
  super(props);

  this.state = {
    accountInfo: []
  }
}





checkPermissionBySeconds(){
  this.intervalId = setInterval (()=>{
    if(this.state.accountInfo.ID){
       fetch(`http://localhost:4000/chcekPermission?id=${this.state.accountInfo.ID}`)
       .then(res => res.json())
       .then(data => {
          if(JSON.stringify(data.data[0]) != JSON.stringify(this.state.accountInfo)) {
            this.setState({accountInfo:data.data[0]});
          }
       });
    }
    console.log("load account every second");
  },1000)
}

saveAccountFromLogIn(userLogin){
  console.log(userLogin);
  if(userLogin) {
    this.setState ({accountInfo: userLogin},()=>{
      let time = new Date();
      time.setHours(time.getHours() + 2);

      let cookiesUser = {ACCOUNT: userLogin.ACCOUNT, PASSWORD: userLogin.PASSWORD, expires: time};
      cookies.set('RenDeInc-LoggedUser', cookiesUser,{expires:time});
     

      this.checkPermissionBySeconds();
    });
  }
}

clearAccountInfo(){
  this.setState({accountInfo:[]});
}


cookiesUserLogin(cookiesUser) {
  fetch(`http://localhost:4000/login?account=${cookiesUser.ACCOUNT}&password=${cookiesUser.PASSWORD}`)
    .then(res => res.json())
    .then(data => {
      if(data.data[0]){
        this.saveAccountFromLogIn(data.data[0]);
      }
    });
}



componentDidMount(){
  let cookiesUser = cookies.get("RenDeInc-LoggedUser");
  if(cookiesUser){
    this.cookiesUserLogin(cookiesUser);
  }
}


componentWillUnmount(){
  clearInterval(this.intervalId);
}




render(){
  return (
  <div className="main-wrapper">
    <Router>
      <Header accountInfo = {this.state.accountInfo} logoutBtnClicked = {this.clearAccountInfo.bind(this)}/>
      <Route exact path="/login" component = {props => <Login accountInfo = {this.state.accountInfo} saveAccountFromLogIn = {this.saveAccountFromLogIn.bind(this)} clearAccountInfo= {this.clearAccountInfo.bind(this)} />}/>     
      <Route exact path = "/login/account" component = {props => (<Account accountInfo = {this.state.accountInfo}/>)}/>            
      <Route exact path = "/login/account/resetpassword" component = {() => <LoginReset accountInfo = {this.state.accountInfo}/>}/>
      <Route exact path="/" component = { props => <Home accountInfo = {this.state.accountInfo}/>}/>

      {this.state.accountInfo.ACCESS_LEVEL < 3 ? (
        <div>
        <Route exact path = "/login/account/register" component = {()=> <Register accountInfo = {this.state.accountInfo}/>}/>
        <Route exact path = "/inventory" component = {()=> <InventoryMain accountInfo = {this.state.accountInfo}/>}/>
        <Route exact path = "/checkout" component = {()=> <CheckOut accountInfo = {this.state.accountInfo}/>}/>
        <Route exact path = "/checkout/ongoingorder" component = {OngoingItem}/>
        </div>
      ):null}
    </Router>     
       
    </div>
  );
}
}
export default App;
