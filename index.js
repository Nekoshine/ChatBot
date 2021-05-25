const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');

const ChatbotService = require("./model/ChatbotService.js");

let ChatbotServiceInstance = new ChatbotService();

const app = express();

const port = 3000
const brains = [
	'./brain.rive'
 	];


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.set('view engine', 'ejs');


app.get('/', (req, res, next)=>{
	//nothing to do
	next();
});

app.post('/:name:idbrain', (req,res,next)=>{
	name =  String(req.params.id);
	idbrain = parseInt(req.params.idbrain);
	brain = listbrain[idbrain];  
	try{
		ChatbotServiceInstance.addChatbot(name,idbrain);
	}catch(e){
		console.log("An error occured : "+ e);
	}
	next();
})

app.put('/:name:idbrain',(req,res,next)=>{
	id = parseInt(req.params.id);
	try{
		ChatbotServiceInstance.changebrainChatbot(id,idbrain);
	}catch(e){
		console.log("An error occured : "+ e);
	}
	res.redirect("/");
})

app.delete('/:id',(req,res,next)=>{
	id = parseInt(req.params.id);
	try{
		ChatbotServiceInstance.removeChatbot(id);
	}catch(e){
		console.log("An error occured : "+ e);
	}
	res.redirect("/");
})




app.use((req,res,next)=>{
	res.render('pages/form',{list:ChatbotServiceInstance.getChatbots()}); 
	next();
})


ChatbotService.create().then(ts=>{
	ChatbotServiceInstance=ts;
	app.listen(process.env.port, process.env.host, () => {
  		console.log(`Example app listening at http://${process.env.host}:${process.env.port}`)
	});
});