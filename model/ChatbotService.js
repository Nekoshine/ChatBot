const Chatbot = require("./Chatbot.js");
const data = require("./db.json");

class ChatbotService {
    constructor(data){
        this.idCpt = 0;
        this.db = new Map();
    }

    //Récupération de la taille de la liste des cerveaux
    getSize(){
        this.db.size;
    }

    //Initialisation de la liste
    static create(){ 
		const service = new ChatbotService();
		return service;
	}

    //Récupération d'un chatbot à l'id donné
    getChatbot(idchatbot){        
        return(this.db.get(idchatbot));
     }

    // Ajout d'un chatbot dans la liste des chatbots
    addChatbot(chatbot){
        const id = this.idCpt;
        let newChatbot ;
        if (undefined !== (newChatbot = new Chatbot(id,chatbot))){
            console.log("Chatbot crée"+ newChatbot);
            this.db.set(newChatbot.id,newChatbot);
            this.idCpt++;
            return this.getChatbot(newChatbot.id);
        }
        else {
            throw Error("Erreur lors de la création du chatbot");
        }
    }
 
    //Suppression d'un chatbot à l'id donné
    deleteChatbot(idchatbot){
        let Chatbot = this.db.get(idchatbot);
        console.log("Chatbots : " + JSON.stringify(Chatbot));
        if (undefined != Chatbot){
            this.db.delete(idchatbot);
            return idchatbot;
        }
        else {
            return undefined;
        }
    }

    //Modification d'un chatbot à l'id donné
    updateBot(updatedBot){
        const hasBot = this.db.has(updatedBot.id);
        if(hasBot){
          this.db.set(updatedBot.id,updatedBot);
          return updatedBot;
        } else {
          return undefined;
        }
    }

    //Récupération de tout les chatbots de la liste
    getChatbots(){
       let tabChatbots = [];
       for (const v of this.db.values()){
           tabChatbots.push(v);
       }
       return(tabChatbots);
    }

    //Suppression de tout les chatbots de la liste
    deleteBots(){
        this.db.clear();
    }

    //Récupération des ports de tout les chatbots
    getPort(){
        let tabPorts = [];
        for (const v of this.db.values()) {
          tabPorts.push(v["port"]);
        }
        return tabPorts;
      }
}

module.exports = ChatbotService;