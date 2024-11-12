let gamers = [];
let questions = [];

//does this file even matter if I just copy-paste the methods in anyway

module.exports = {
    addGamer:(nickname, id) => {
        let gamer = {
            id: id,
            nickname: nickname,
            score: 0,
            selectedAnswers: [],
        }
        let newGamers = [...gamers];//man spread syntax is so convenient
        newGamers.push(gamer);
        gamers = newGamers;
        return gamers;
    },
    scoringAnswers:(nickname, answers) => {
        let gamer = gamers.filter(gamer => gamer.nickname === nickname);//what is this brother
        let newGamers = gamers.filter(gamer => gamer.nickname !== nickname);
        let scoreAlt = 0;
        //loop through each correct answer with each answer selected
        //add one to scoreAlt for each match, subtract one every time there's a selected answer without a single match
        //mutate score by scoreAlt at the end
        //actually wait can I just make a "newScore" var and mutate that as we go
    }
}
