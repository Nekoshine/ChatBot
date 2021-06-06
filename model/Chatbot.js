class Chatbot{
    constructor(id,data){ //id, name, brain, address, port 
        this.id = id;


        if(undefined != data.name){
            this.name = data.name;
        }
        else {
            this.name = "Steve";
          }




        if(undefined != data.brain){
            this.brain = data.brain;
        }
        else {
            this.brain = "";
            }

        

        if(undefined != data.port){
            this.port = data.port;
        }
        else{
            this.port = "";
        }

    }
}

module.exports = Chatbot;