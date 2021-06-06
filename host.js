var express = require('express');
var app = express();
var RiveScript = require("rivescript");
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}))

var bot = [];
var serverBot = [];
var data = Array()
function lancementServBot(port,brain){
    bot[port] = new RiveScript();
    var corsOptions = {
      origin: 'http://localhost:'+port+'/chat',
      methods: 'GET,POST,PUT,DELETE',
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    var type = typeof brain;
    console.log(type);
    if(type == "string"){
        if(brain!=""){
            bot[port].loadFile(brain).then(loading_done).catch(loading_error);
        }
    }
    else{
        for(var i=0; i<brain.length; i++){
            if(brain!=""){
                bot[port].loadFile(brain[i]).then(loading_done).catch(loading_error);
            }
        }
    }
    bot[port].sortReplies();

    app.get('/chat', cors(corsOptions), function(req, res) {
        var json = {"message": "Bonjour humain je suis un robot", "reponse" : ""}; 
        data.push(json);
        res.render('chat_bot',{list : data});
    });

    run(port);

    app.post('/chat', cors(corsOptions), function (req, res)  {
               
        const message = JSON.parse(JSON.stringify(req.body));
        bot[port].reply("Utilisateur", message["message"]).then(function(reply) {
            var json = {"message": message["message"], "reponse" : reply};
            data.push(json);
            res.render('chat_bot', { list : data});

        });
    });

    function loading_done() {
      console.log("Bot has finished loading!");
      bot[port].sortReplies();
    }

    function loading_error(error, filename, lineno) {
       console.log("Error when loading files: " + error);
     }
};
    function stop(port){
         console.log("clossing");
         serverBot[port].close();
    };

    function run(port){
        serverBot[port] = app.listen(port, function () {
          console.log('Started listening on : '+port);
        });
    };

module.exports.lancementServBot = lancementServBot;
module.exports.run = run;
module.exports.stop = stop;