class Chatbot{
    constructor(data){ //id, name, brain, address, port 
        if(undefined != data.id){
            this.id = data.id;
        }

        if(undefined != data.name){
            this.title = data.title;
        }

        if(undefined != data.brain){
            this.brain = data.brain;
        }


        if(undefined != data.address){
            this.adress = data.address;
        }
        else {
            this.address = 'localhost';
        }
    
        
        if(undefined != data.port){
            this.port = data.port;
        }
        else{
            this.port = 3000;
        }

    }
}