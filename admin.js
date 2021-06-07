const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const process = require('process');
var host = require('./host.js');

const ChatbotService = require("./model/ChatbotService.js");

const ChatbotServiceInstance = new ChatbotService();

const app = express();

const port = 3000;



app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('public'))
app.use(cors());
var corsOptions = {
  origin: 'http://localhost:'+port,
  methods: 'GET,POST,PUT,DELETE',
  optionsSuccessStatus: 200 
};
app.set('view engine', 'ejs');




/*** ROUTE ***/


app.get('/', function(req, res) {
	res.render('afficher_bot');
 });

app.get('/user', function(req, res) {
	res.render('client');
});

app.get('/add', function(req, res){
	res.render("ajouter_bot")
});

app.get('/change',function(req,res){
	res.render('modifier_supprimer_bot')
});

app.get('/chat', function(req, res){
	res.render("chat_bot")
});

/*** REQUETES REST ***/

app.get('/bot',cors(corsOptions), function(req,res) {
	try{
		res.setHeader('Content-Type', 'application/json');	
		res.json(ChatbotServiceInstance.getChatbots());
	}catch(e){
		console.log("An error occured : "+ e);
	}
});

app.get('/bot/:id',cors(corsOptions), function(req,res){
	let chatbot = ChatbotServiceInstance.getChatbot(parseInt(req.params.id));
	if(undefined != chatbot){
		res.setHeader('Content-Type', 'application/json');	
		res.json(chatbot);
	}else{
		res.status(404).send('Page introuvable !');
	}
});



app.post('/bot',cors(corsOptions), function(req,res){
	var portoccupe = false;
	const objbot = JSON.parse(JSON.stringify(req.body));
	var usedport = ChatbotServiceInstance.getPort();

	for (var i = 0; i<usedport.length; i++){
		if (objbot["port"] == usedport[i]){
			portoccupe = true;
		}
	}

	if (portoccupe){
		res.send("Erreur: Port déjà utilisé");
	}

	else{
		var chatbot = ChatbotServiceInstance.addChatbot(objbot);
		host.lancementServBot(objbot["port"],objbot["brain"]);
		res.redirect('/')
	}
});


app.put('/bot',cors(corsOptions),function(req,res){
	if(req.is('json'))
	{
		
			var chatbot = ChatbotServiceInstance.updateBot(req.body);
			if(undefined != chatbot){
				res.setHeader('Content-Type', 'application/json');
				res.json(chatbot);
				console.log("Done updating "+JSON.stringify(chatbot));
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
		res.status(200).send('OK');
		console.log("Done deleting")
	}
	else{
		res.status(404).send('Page introuvable !');
	}
})



/*** LANCEMENT DU SERVEUR ***/


	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
