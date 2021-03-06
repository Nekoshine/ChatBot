var express = require('express');
var app = express();
var RiveScript = require("rivescript");
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended : true}))

var bot = []; //Tableau qui contient les bots
var serverBot = []; //Tableau qui contient les serveurs des bots
var data = Array(); //Tableau qui contient les donneés échangées
var cptMessages =0;
/*
Fonction qui va permettre de lancer le bot sur un serveur à part avec un port et un/des cerveau/x spécifié/s.
*/
function bouche(port,brain){
    bot[port] = new RiveScript();
    var corsOptions = {
      origin: 'http://localhost:'+port+'/chat',
      methods: 'GET,POST,PUT,DELETE',
      optionsSuccessStatus: 200 
    };
    var type = typeof brain;
    console.log(type);
    if(type == "string"){ // On vérifie ici si il y'a un seul ou plusieurs cerveaux pour ce bot
        if(brain!=""){
            bot[port].loadFile(brain).then(loading_done).catch(loading_error); //On charge le cerveau
        }
    }
    else{
        for(var i=0; i<brain.length; i++){
            if(brain!=""){
                bot[port].loadFile(brain[i]).then(loading_done).catch(loading_error); // On charge chaque cerveau
            }
        }
    }
    lancementServ(port); //Lancement du serveur

    // Lors d'une requête get sur la page du bot, on va donc pré-répondre pour accueillir l'utilisateur
    app.get('/chat/:nom', cors(corsOptions), function(req, res) {
        data =[] //Stockage du message
        nomUser = req.params.nom;
        var json = {"message": "", "reponse" : "Bonjour "+ nomUser + " je suis un robot", "cpt": cptMessages}; //Message à envoyer à l'ejs
        data.push(json);
        res.render('chat_bot',{list : data}); 
    });

    //Lors d'une requête post, cela signifie que l'utilisateur dialogue avec le bot il faut donc préparer la réponse du bot en fonction du cerveau 
    app.post('/chat', cors(corsOptions), function (req, res)  {
        cptMessages++;
        portCerveau = req.headers["host"].split(':')[1]; //On isole le port du bot pour le retrouver dans le tableau
        const message = JSON.parse(JSON.stringify(req.body)); //On récupère le message de l'utilisateur
        bot[portCerveau].reply("Utilisateur", message["message"]).then(function(reply) { //On construit la réponse du bot en fournissant le message envoyé par l'utilisateur
            var json = {"message": message["message"], "reponse" : reply,"cpt" : cptMessages}; //On met en forme la réponse
            data.push(json);
            res.render('chat_bot', { list : data}); //On envoie le tout à l'affichage
        });
    });

    function loading_done() { //Fonction de Rivescript permettant de signaler que le lancement du bot a réussi
      console.log("Cerveau chargé !");
      bot[port].sortReplies();
    }

    function loading_error(error, filename, lineno) { //Fonction de Rivescript permettant de signaler que le lancement du bot a échoué
       console.log("Erreur lors du chargement du cerveau: " + error); 
     }
};
    function arretServer(port){ //Fonction de fermeture du serveur
         console.log("Fermeture du port :"+port);
         serverBot[port].close();
    };

    function lancementServ(port){ // Fonction de lancement du serveur
        serverBot[port] = app.listen(port, function () {
        console.log("Port en écoute :"+port);
        });
    };

module.exports.bouche = bouche;
module.exports.lancementServ = lancementServ;
module.exports.arretServer = arretServer;