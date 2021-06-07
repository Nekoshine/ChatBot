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


// Routes qui vont rediriger vers les pages d'affichage 

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


//Lors d'une requête get on va charger les chatbots sur la page
app.get('/bot',cors(corsOptions), function(req,res) {
	res.setHeader('Content-Type', 'application/json');	
	res.json(ChatbotServiceInstance.getChatbots()); //Récupération des bots
});

//Permet de récupérer un bot précis dans la liste des bots
app.get('/bot/:id',cors(corsOptions), function(req,res){
	let chatbot = ChatbotServiceInstance.getChatbot(parseInt(req.params.id)); //Récupération du bot depuis la liste qui à l'id spécifié
	if(undefined != chatbot){
		res.setHeader('Content-Type', 'application/json');	
		res.json(chatbot); //Renvoi du bot trouvé
	}else{
		res.status(404).send('Page introuvable !');
	}
});


//La requête post permet de lancer le serveur du bot si c'est possible 
app.post('/bot',cors(corsOptions), function(req,res){
	var portOccupe = false;
	const futurChatBot = JSON.parse(JSON.stringify(req.body)); //On récupère le bot qui va être créer
	var portsUtilises = ChatbotServiceInstance.getPort(); //On récupère les ports déjà utilisés 

	for (var i = 0; i<portsUtilises.length; i++){ 
		if (futurChatBot["port"] == portsUtilises[i]){ // On vérifie que le nouveau port n'est pas déjà utilisé
			portOccupe = true;
		}
	}

	if (portOccupe){ //Si il l'est on annule la requête
		res.send("Erreur: Port déjà utilisé");
	}

	else{ //Sinon on ajoute le bot à la liste et on lance le serveur
		var chatbot = ChatbotServiceInstance.addChatbot(futurChatBot); // Ajout du bot à la liste des bots
		host.lancementServBot(futurChatBot["port"],futurChatBot["brain"]); //Lancement du serveur du bot
		res.redirect('/')
	}
});

//La requête put permet de mettre à jour un bot 
app.put('/bot',cors(corsOptions),function(req,res){
	if(req.is('json')){		
			var chatbot = ChatbotServiceInstance.updateBot(req.body); //Modification du bot dans la liste
			if(undefined != chatbot){
				res.setHeader('Content-Type', 'application/json');
				res.json(chatbot);
			}
			else{
				res.status(404).send('Page introuvable !');
				}
			}
	})

	//La requête delete permet la suppression du bot qui à l'id spécifié
app.delete('/bot/:id',cors(corsOptions),(req,res)=>{
	let id = ChatbotServiceInstance.deleteChatbot(parseInt(req.params.id)); //Suppression du bot de la liste
	if (undefined != id){
		res.setHeader('Content-Type', 'text/plain');
		res.status(200).send('OK');
	}
	else{
		res.status(404).send('Page introuvable !');
	}
})

//Lancement du server de l'admin

	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
