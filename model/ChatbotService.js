
class ChatbotService {
    constructor(data){
        this.idCpt = 0;
        this.db = new Map();
    }

    static create(){ 
		const service = new Chatbotservice();
		return service;
	}

    addChatbot(name, idbrain){
        const id = this.idCpt;
        let newChatbot;
        if (undefined !== (newChatbot = new Chatbot({id:id,name:name, brain:brain}))){
            console.log("just created a chatbot"+newChatbot);
            this.db.push(newChatbot);
            this.idCpt++;
        }
        else {
            throw Error("Cannot create Chatbot");
        }
    }


    removeChatbot(id){
        let Chatbot = this.db.get(id);
        console.log("Chatbots : " + JSON.stringify(Chatbot));
        if (undefined != Chatbot){
            this.db.delete(id)
        }
        else {
            throw Error("Failed to delete Chatbot")
        }
    }

    getChatbots(){
       let tabChatbots = [];
       for (const v of this.chatbots.values()){
           tabChatbots.push(v);
       }
       return(tabChatbots);
    }

    getChatbot(idchatbot){
        return(this.db.get(idchatbot));
     }

    changebrainChatbot(idchatbot, brain){
        let chatbot = this.db.get(idchatbot);
        chatbot.brain = brain;
    }

    addinterfacetoChatbot(idchatbot, inteface){}

    removeinterfacefromChatbot(idchatbot, inteface){}
    
}

module.exports = Chatbotservice;