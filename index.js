const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');

const TaskService = require("./model/TaskService_ArrayImpl.js");

let taskServiceInstance = new TaskService();

const app = express();

if (process.env.port == undefined) {
	process.env.port = 3001
}

if (process.env.host == undefined) {
	process.env.host = "localhost"
}


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.set('view engine', 'ejs');


app.get('/', (req, res, next)=>{
	//nothing to do
	next();
});

app.post('/', (req,res,next)=>{
	try{
		console.log("call to addTask with "+req.body.title)
		taskServiceInstance.addTask(req.body.title);
	}catch(e){
		console.log("An error occured : "+ e);
	}
	next();
})

app.post('/delete',(req,res,next)=>{
	try{
		taskServiceInstance.removeTask(parseInt(req.body.id));
	}catch(e){
		console.log("An error occured : "+ e);
	}
	res.redirect("/");
})


app.use((req,res,next)=>{
	res.render('pages/form',{list:taskServiceInstance.getTasks()}); 
	next();
})


TaskService.create().then(ts=>{
	taskServiceInstance=ts;
	app.listen(process.env.port, process.env.host, () => {
  		console.log(`Example app listening at http://${process.env.host}:${process.env.port}`)
	});
});