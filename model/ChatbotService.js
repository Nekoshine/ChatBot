const Chatbot = require("./Chatbot.js");
const data = require("./db.json");

class ChatbotService {
    constructor(data){
        this.idCpt = 0;
        this.db = new Map();
    }

    getSize(){
        this.db.size;
    }

    static create(){ 
		const service = new Chatbotservice();
		return service;
	}

    addChatbot(chatbot){
        const id = this.idCpt;
        let newChatbot ;
        if (undefined !== (newChatbot = new Chatbot(id,chatbot))){
            console.log("just created a chatbot"+ newChatbot);
            this.db.set(newChatbot.id,newChatbot);
            this.idCpt++;
            return this.db.getChatbot(newChatbot.id);
        }
        else {
            throw Error("Cannot create Chatbot");
        }
    }

    getChatbot(idchatbot){
        return(this.db.get(idchatbot));
     }

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

    updateBot(updatedBot){
        const hasBot = this.bots.has(updatedBot.id);
        if(hasBot){
          this.bots.set(updatedBot.id,updatedBot);
          return updatedBot;
        } else {
          return undefined;
        }
    }


    getChatbots(){
       let tabChatbots = [];
       for (const v of this.chatbots.values()){
           tabChatbots.push(v);
       }
       return(tabChatbots);
    }

    deleteBots(){
        this.db.clear();
    }

    
}

module.exports = Chatbotservice;