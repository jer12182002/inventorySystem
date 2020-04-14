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

//****************************Account*************************************
app.get('/chcekPermission',(req,res)=>{
	var userId = req.query.id;
	const sqlQuery = `SELECT * FROM account_list where ID = ${userId}`;
	
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data:result});
		}
	});
});


app.get('/login',(req,res)=>{
	const {account, password } = req.query;
	var sqlQuery = `SELECT * FROM ACCOUNT_LIST WHERE ACCOUNT = '${account}' AND PASSWORD = '${password}'`;

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
			TYPE_VIEW, TYPE_MODIFY, SHELF_MODIFY, GRAM_VIEW, GRAM_MODIFY,
			EXP_VIEW, EXP_MODIFY, TAG_VIEW, TAG_MODIFY} = req.query;
	var sqlQuery = `INSERT INTO account_list(USERNAME, ACCOUNT, PASSWORD, ACCESS_LEVEL, VIEW_ITEM, ADD_ITEM, DELETE_ITEM, NAME_MODIFY, QTY_VIEW, QTY_MODIFY, TYPE_VIEW, TYPE_MODIFY, SHELF_MODIFY, GRAM_VIEW, GRAM_MODIFY, EXP_VIEW, EXP_MODIFY, TAG_VIEW, TAG_MODIFY, CREATEDBY) VALUES ('${USERNAME}','${ACCOUNT}','${PASSWORD}','${ACCESS_LEVEL}','${VIEW_ITEM}','${ADD_ITEM}','${DELETE_ITEM}','${NAME_MODIFY}','${QTY_VIEW}','${QTY_MODIFY}','${TYPE_VIEW}','${TYPE_MODIFY}','${SHELF_MODIFY}','${GRAM_VIEW}','${GRAM_MODIFY}','${EXP_VIEW}','${EXP_MODIFY}','${TAG_VIEW}','${TAG_MODIFY}','${CREATEDBY}')`;
	
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return res.json({data:result})
		}
	});
});


app.get('/login/account/resetpassword',(req,res)=>{
	console.log("Received Data from resetPassword");
	let userPwdInfo = JSON.parse(req.query.newUserInfo);

	var sqlQuery = `UPDATE account_list set PASSWORD = '${userPwdInfo.newPassword}' where ID = ${userPwdInfo.id}`;
	console.log(sqlQuery);

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else{
			return res.json({data:'success'});
		}
	});

});



app.get('/login/account/displayUsers',(req,res) =>{
	console.log("Get Target User" + req.query);

	var sqlQuery = `SELECT * FROM account_list where ID = ${req.query.id}`;
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			return res.json({data: result})
		}
	});

})


app.get('/login/account/saveUpdatedUser',(req,res)=>{
	let userInfo = JSON.parse(req.query.userInfo);
	
	var sqlQuery = `UPDATE account_list set ACCESS_LEVEL = ${userInfo.ACCESS_LEVEL}, VIEW_ITEM = ${userInfo.VIEW_ITEM}, ADD_ITEM = ${userInfo.ADD_ITEM}, DELETE_ITEM = ${userInfo.DELETE_ITEM}, NAME_MODIFY=${userInfo.NAME_MODIFY}, QTY_VIEW = ${userInfo.QTY_VIEW}, QTY_MODIFY = ${userInfo.QTY_MODIFY}, TYPE_VIEW = ${userInfo.TYPE_VIEW}, TYPE_MODIFY = ${userInfo.TYPE_MODIFY}, SHELF_MODIFY = ${userInfo.SHELF_MODIFY}, GRAM_VIEW = ${userInfo.GRAM_VIEW}, GRAM_MODIFY = ${userInfo.GRAM_MODIFY}, EXP_VIEW = ${userInfo.EXP_VIEW}, EXP_MODIFY = ${userInfo.EXP_MODIFY}, TAG_VIEW = ${userInfo.TAG_VIEW}, TAG_MODIFY = ${userInfo.TAG_MODIFY} where ID = ${userInfo.ID}`;
	console.log(sqlQuery);

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	});
});

//*******************************************************************************************




//****************************Inventroy******************************************************
app.get('/inventory/loadSelect',(req,res)=>{

	var sqlQuery = 'SELECT ITEM_TYPE FROM item_list_type_list';
	console.log('Get request from inventory/loadSelect');
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return res.json({data: result});
		}
	});
});



app.get('/inventory/addNewItem',(req,res)=>{
	let newItem = JSON.parse(req.query.newItem);
	console.log('Get request to add newItem');

	let sqlQuery = `INSERT INTO item_list(TYPE, SHELF_NO,MANUFACTURE,ENGLISH_NAME,CHINESE_NAME, QTY,EXPIRE_DATE,GRAM,CREATED_BY,LAST_MODIFIED_BY) VALUES ('${newItem.type}', '${newItem.shelfNo}', '${newItem.manufacturer}', '${newItem.ENname}','${newItem.CHname}', '${newItem.qty}', '${newItem.exp}','${newItem.gram}', '${newItem.createdBy}', '${newItem.createdBy}')`;
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	});
});

app.get('/inventory/loadAllItem',(req,res)=>{
	let filter = req.query.filter;

	let sqlQuery = `SELECT I.ID, I.TYPE, I.SHELF_NO, I.MANUFACTURE, I.ENGLISH_NAME,I.CHINESE_NAME,I.HOLD_QTY, I.QTY, T.T_QTY, DATE_FORMAT(I.EXPIRE_DATE, "%Y-%m-%d") AS EXPIRE_DATE,GRAM,I.CREATED_BY,I.LAST_MODIFIED_BY,ROWSPAN FROM item_list I INNER JOIN (SELECT CHINESE_NAME AS T_CHINESE_NAME,TYPE AS T_TYPE, SUM(QTY) AS T_QTY,'Filter' AS ROWSPAN FROM item_list GROUP BY CHINESE_NAME, TYPE) T ON I.CHINESE_NAME = T.T_CHINESE_NAME AND I.TYPE = T.T_TYPE WHERE UPPER(I.TYPE) LIKE '%${filter}%' OR UPPER(I.SHELF_NO) LIKE '%${filter}%' OR UPPER(I.MANUFACTURE) LIKE '%${filter}%' OR UPPER(I.ENGLISH_NAME) LIKE '%${filter}%' OR UPPER(I.CHINESE_NAME) LIKE '%${filter}%' OR EXPIRE_DATE LIKE '%${filter}%' Order by I.CHINESE_NAME, I.TYPE`;
	
	console.log('Get all item for inventory');
	console.log(sqlQuery);

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})

});


app.get('/inventory/updateItems',(req,res)=>{
	let updatedItem = JSON.parse(req.query.updatedItem);
	let sqlQuery = `UPDATE item_list SET ENGLISH_NAME = '${updatedItem.ENGLISH_NAME}',CHINESE_NAME = '${updatedItem.CHINESE_NAME}',TYPE = '${updatedItem.TYPE}',SHELF_NO = '${updatedItem.SHELF_NO}' ,QTY = '${updatedItem.QTY}'`;
		sqlQuery += updatedItem.EXPIRE_DATE? `,EXPIRE_DATE = '${updatedItem.EXPIRE_DATE}'`:``
		sqlQuery += `,GRAM = '${updatedItem.GRAM}' WHERE ID = '${updatedItem.ID}'`;

	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}
		else {
			console.log(result);
			return (res.json({data:result}));
		}
	})
});

app.get('/inventory/deleteItem',(req,res)=>{
	let {itemId} = req.query;
	console.log({itemId});

	let sqlQuery = `DELETE FROM item_list where ID = ${itemId}`;

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			return (res.json({data:'success'}));
		} 
	})
})



app.get('/inventory/addhold',(req,res)=>{

	let holdItem = JSON.parse(req.query.holdItem);
	
	let sqlQuery = `INSERT INTO hold_item_list (ITEM_ID, PERSON, HOLD_QTY, DATE) VALUES ('${holdItem.ITEM_ID}', '${holdItem.PERSON}','${holdItem.HOLD_QTY}', '${holdItem.DATE}')`;


	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			connection.query(`UPDATE item_list set HOLD_QTY = (SELECT HOLD_QTY FROM item_list where ID = ${holdItem.ITEM_ID}) + ${holdItem.HOLD_QTY} where ID = ${holdItem.ITEM_ID}`,(err,result)=>{
				if(err) {
					res.send(err);
				}
				else {
					return (res.json({data:'success'}));
				}
			});
		}
	})

})
	



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