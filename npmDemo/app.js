//importing express
const express = require('express');
//importing body-parser
const bodyParser=require('body-parser');
//cors middleware is imported
const cors=require('cors');
//mongoose middleware is imported
const mongoose=require('mongoose');
//creating application object
const app = express();


//mongoose is connected to the database
mongoose.connect('mongodb://localhost:27017/biz2credit');
//cors middleware is registered
app.use(cors());
//registering the bodyParser to process json body
app.use(bodyParser.json());

//Model object is created for the document
const User = mongoose.model('users', 
{ 
 name: String, 
 mailId: String,
 mobileNo: String
 });

//method to process a post request
app.post('/users',function(req,res){
    console.log('Following object will be saved: ',req.body);
    let newUser=new User(req.body);
    newUser.save().then(()=>{
    res.json({'status':'successfully saved.'});
   });
});



//Asking the application to start listening request on a specific port
app.listen(7070,()=>{
    console.log('application started on port 7070.');
});