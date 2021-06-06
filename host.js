var express = require('express');
var app = express();
var RiveScript = require("rivescript");
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));

var bot = [];
var serverBot = [];

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
     
        res.render('chat_bot', );
    });

    run(port);

    app.post('/chat', cors(corsOptions), function(req, res) {
        var host = req.headers["host"];
        var p = host.split(':');
        port=p[1];
        const obj = JSON.parse(JSON.stringify(req.body));
        console.log("Human says : "+obj["message"]);
        bot[port].reply("local-user", obj["message"]).then(function(reply) {
            console.log("The bot says: " + reply);
            //res.send(reply);
            var json = {"message": obj["message"], "reponse" : reply};
            res.render('chat_bot', { "bot" : json});

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