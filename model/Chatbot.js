class Chatbot{
    constructor(data){ //id, name, brain
        if(undefined != data.id){
            this.id = data.id;
        }

        if(undefined != data.name){
            this.title = data.title;
        }
        else {
            this.title = "Risbot";
        }

        if(undefined != data.brain){
            this.brain = data.brain;
        }
    }
}