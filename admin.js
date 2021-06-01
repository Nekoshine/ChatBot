const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const process = require('process');

const ChatbotService = require("./model/ChatbotService.js");

const ChatbotServiceInstance = new ChatbotService();

const app = express();

const port = 3000;



app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(cors());
var corsOptions = {
  origin: 'http://localhost:'+port,
  methods: 'GET,POST,PUT,DELETE',
  optionsSuccessStatus: 200 
};
app.set('view engine', 'ejs');




/*** ROUTE ***/


app.get('/', function(req, res) {
	res.render('admin');
 });
 
  
/*** REQUETES REST ***/

app.get('/bot',cors(corsOptions), function(req,res) {
	try{
		res.setHeader('Content-Type', 'application/json');	
		res.json(ChatbotServiceInstance.getChatbots());
	}catch(e){
		console.log("An error occured : "+ e);
	}
	next();
});

app.get('/bot/:id',cors(corsOptions), function(req,res){
	let chatbot = ChatbotServiceInstance.getChatbot(req.params.id);
	if(undefined != chatbot){
		res.setHeader('Content-Type', 'application/json');	
		res.json(chatbot);
	}else{
		res.status(404).send('Page introuvable !');
	}
});



app.post('/bot',cors(corsOptions), function(req,res){
	if(req.is('json')) //on devrait toujours tester le type et aussi la taille!
    {
		var chatbot = ChatbotServiceInstance.addChatbot(req.body);
		res.setHeader('Content-Type', 'application/json');
        res.json(chatbot);
        console.log("Done adding "+JSON.stringify(chatbot) );
	}
	else{
		res.send(400, 'Bad Request !');
	}
});


app.put('/bot',cors(corsOptions),function(req,res){
	if(req.is('json'))
	{
		var chatbot = ChatbotServiceInstance.update(req.body);
		if(undefined != chatbot){
			res.setHeader('Content-Type', 'application/json');
			res.json(chatbot);
			console.log("Done updating "+JSON.stringify(todo));
		}
		else{
			res.status(404).send('Page introuvable !');
	}
}
})





app.delete('/bot/:id',cors(corsOptions),(req,res,next)=>{
	let id = ChatbotServiceInstance.deleteChatbot(parseInt(req.params.id));
	if (undefined != id){
		res.setHeader('Content-Type', 'text/plain');
		res.send(200,'OK');
	}
	else{
		res.send(404, 'Page introuvable !');
	}
})



/*** LANCEMENT DU SERVEUR ***/

ChatbotService.create().then(ts=>{
	ChatbotServiceInstance=ts;
	app.listen(process.env.port, process.env.host, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});