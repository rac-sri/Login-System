const express = require('express');
const app = express();
const mongoose = require('mongoose');
const body-parser = require('body-parser');

app.use(body-parser.json());
app.use(body-parser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req,res)=>
{
	res.sendFile( __dirname+'/login.html');
});

app.post('/', (req , res)=>{
	console.log(req.body);
});
app.listen(3000);