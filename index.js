const express = require('express');
const app = express();
const mongoose = require('mongoose');
const body = require('body-parser');
const joi = require('joi');

app.use(body.json());
app.use(body.urlencoded({extended: true}));
app.use(express.static('public'));


//database
	mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true})
	.then(()=>console.log('Connected to mongodb'))
	.catch(err => console.error("Failed"));


const schema = new mongoose.Schema({
	name : String,
	password: String
});

const data= new mongoose.model('User', schema);


async function userData(req , res){
	

 const newuser= new data({
 		name : "safasdfgasdf",
 		password : "sksfzcczxcxz"
 });


//let result = validateuser(newuser);

 //f(result){
const result = await newuser.save();
console.log(result);
//}
//else
//console.log("Invalid Details");
}



//validation
function validateuser(userd)
{
	
	const sch = {
		name: joi.string().min(2).max(20),
		password : joi.string().min(5).max(30)
	};

	return result = joi.validate(userd , sch);
}


app.get('/', (req,res)=>
{
	res.sendFile( __dirname+'/login.html');
});

app.post('/', (req , res)=>{
	userData(req , res);
	console.log(req.body);
});
app.listen(3000);