
var RiveScript = require('rivescript');

class Brain {
	

	constructor(name, files){
		this.bot = new RiveScript({utf8: true});
		this.name = name;
		this.files = files;
	}
	

	loading(){
		//console.log("Load");
		return this.bot.loadFile(this.files);
	}
	
	loadingDone(){
		//console.log("Success Loading\n");
		//console.log("Sort");
		this.bot.sortReplies();
    }
    

	async reply(username, message){
		var answer = await this.bot.reply(username, message);
		return answer;
	}
};

//===========================
// Export

module.exports = Brain;