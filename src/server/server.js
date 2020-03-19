const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require ('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password:'',
	database:'inventorysystem'
});


var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());

connection.connect();

app.get('/login',(req,res)=>{
	const {account, password } = req.query;
	var sqlQuery = `SELECT * FROM ACCOUNT_LIST WHERE ACCOUNT = '${account}' AND PASSWORD = '${password}'`;
	//sqlQuery = `SELECT * FROM ACCOUNT_LIST WHERE ACCOUNT = 'jason' AND PASSWORD = 'j12345'`;
	
	connection.query(sqlQuery,(err, result) =>{
		if(err){
			res.send(err);
		}else {
				console.log(result);
			return res.json({data:result})
		}
	});
});


app.get('/login/account',(req,res)=>{
	console.log("Get request for fetch data from all user");

	var sqlQuery = `SELECT * FROM account_list where ID != 1`;

	connection.query(sqlQuery,(err,result) => {
		if(err){
			res.send(err);
		}else {
			return res.json({data:result});
		}
	});

});


app.get('/login/account/register',(req,res) =>{
	console.log("Received Data from register page " + req.query);

	const {USERNAME, ACCOUNT, PASSWORD, ACCESS_LEVEL, CREATEDBY, VIEW_ITEM, ADD_ITEM, 
			DELETE_ITEM, NAME_MODIFY, QTY_VIEW, QTY_MODIFY,
			TYPE_VIEW, TYPE_MODIFY, GRAM_VIEW, GRAM_MODIFY,
			EXP_VIEW, EXP_MODIFY, TAG_VIEW, TAG_MODIFY} = req.query;
	var sqlQuery = `INSERT INTO account_list(USERNAME, ACCOUNT, PASSWORD, ACCESS_LEVEL, VIEW_ITEM, ADD_ITEM, DELETE_ITEM, NAME_MODIFY, QTY_VIEW, QTY_MODIFY, TYPE_VIEW, TYPE_MODIFY, GRAM_VIEW, GRAM_MODIFY, EXP_VIEW, EXP_MODIFY, TAG_VIEW, TAG_MODIFY, CREATEDBY) VALUES ('${USERNAME}','${ACCOUNT}','${PASSWORD}','${ACCESS_LEVEL}','${VIEW_ITEM}','${ADD_ITEM}','${DELETE_ITEM}','${NAME_MODIFY}','${QTY_VIEW}','${QTY_MODIFY}','${TYPE_VIEW}','${TYPE_MODIFY}','${GRAM_VIEW}','${GRAM_MODIFY}','${EXP_VIEW}','${EXP_MODIFY}','${TAG_VIEW}','${TAG_MODIFY}','${CREATEDBY}')`;
	
	console.log(sqlQuery);


	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return res.json({data:result})
		}
	});
});



app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

app.listen(4000,()=>{
	console.log("##############Server listening on port 4000");
});