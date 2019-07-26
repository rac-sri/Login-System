const express = require('express');
const app = express();
const mongoose = require('mongoose');
const body = require('body-parser');
const joi = require('joi');
const {auth , compare} = require('./views/js/auth');
const jwt = require('jsonwebtoken');


app.use(body.json());
app.use(body.urlencoded({extended: true}));
app.use(express.static('public'));


//database
	mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true})
	.then(()=>console.log('Connected to mongodb'))
	.catch(err => console.error("Failed"));


const schema = new mongoose.Schema({
	name : { type : String,
			minlength : 5,
			maxlength : 20,
			required : true
		},
	password: String
});

const data= mongoose.model('User', schema);


async function userData(req , res){
	let pre = await data.findOne({name: req.body.name});
	if(pre) res.send('User already registered');

else{
	let epass = await auth(req.body.password)

 const newuser= new data({
 		name : req.body.name,
 		password :epass
 });


//let result = validateuser(newuser);

 //f(result){
const result = await newuser.save();
console.log(result);

const signature = jwt.sign({_id: newuser.id} , "jwtpvtkey");
res.header('x-auth-token', signature).send(newuser.id);

}
//}
//else
//console.log("Invalid Details");
}



//validation
// function validateuser(userd)
// {
	
// 	const sch = {
// 		name: joi.string().min(2).max(20),
// 		password : joi.string().min(5).max(30)
// 	};

// 	return result = joi.validate(userd , sch);
// }
app.post('/me' , async (req , res)=>
{
	const token = req.header('x-auth-token');
	if(!token)  res.status(401).send('Access denied.No token provided');

	try{
		const decoded = jwt.verify(token , 'jwtpvtkey');
		req.user = decoded;
		res.send('Successfull');
	}
	catch(ex)
	{
		res.status(400).send('Invalid token');
	}

});



app.post('/login' , async (req , res)=>
{

const correct = data.findOne({name : req.body.name}).select({name : 0});
if(!correct)  return res.status(400).send("Invalid Username or Password");

console.log(correct.password);

const passcomp = compare(req , correct);
if(!passcomp) { console.log("innnncorrect");return res.status(400).send("Invalid Username or Password");}

res.send("Sucessfule");


});



app.get('/', (req,res)=>
{
	res.sendFile( __dirname+'/login.html');
});

app.post('/', (req , res)=>{
	userData(req , res);
	console.log(req.body);
});
app.listen(3000);