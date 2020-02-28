var express = require('express');
var router = express.Router();

class Player {
  constructor(score, games, sets) {
    this.score = score;
    this.sets = sets;
    this.games = games;
  }
}

function score(p1, p2, totalsets){
  //If p1 scores

  //If there is a deuce give p1 an advantage
  if(p1.score == "Deuce") {
    if(p2.score == "Advantage") {
      p2.score = "Deuce";
    }
    else{
      p1.score = "Advantage";
    }
  }
  //if p1 has an advantage p1 wins the game
  else if(p1.score == "Advantage") {
    p1.games+=1;
    if(p1.games == 6) {
      p1.games = 0;
      p2.games = 0;
      p1.sets+= 1;
      totalsets+=1;
    }
    p1.score = 0;
    p2.score = 0;
  }
  //if p1 has a numeric score
  else {
    p1Score = parseInt(p1.score);
    p2Score = parseInt(p2.score);
    //if <30 increment by 15
    if(p1Score < 30) {
      p1.score = p1Score +15;
    }
    //deuce if p2score = 40
    else if (p2Score == 40) {
      p1.score = "Deuce";
      p2.score = "Deuce";
    }
    //increment by 10 if p1score > 30 and p2score <40
    else if (p2Score < 40) {
      p1.score = p1Score +10;
      //p1 wins game if p1score = 50
      if (p1.score == 50) {
        p1.games+=1;
        if(p1.games == 6) {
          p1.games = 0;
          p2.games = 0;
          p1.sets+= 1;
          totalsets+=1;
        }
      p1.score = 0;
      p2.score = 0;
      }
    }
  }
  return {"Pl1":p1, "Pl2":p2, "totalsets": totalsets};
  }


/* GET home page. */
router.get('/', function(req, res, next) {
  var context = {}

  context["sets"] = 1;
  context["player1Score"] = 0;
  context["player1Sets"] = 0;
  context["player1Games"] = 0;
  context["player2Score"] = 0;
  context["player2Sets"] = 0;
  context["player2Games"] = 0;

  res.render('index', context);
});

router.post('/', function(req, res, next) {
  sets = parseInt(req.body.sets);
  games = parseInt(req.body.games);
  player1 = new Player(req.body.P1Score,parseInt(req.body.P1Games), parseInt(req.body.P1Sets));
  player2 = new Player(req.body.P2Score,parseInt(req.body.P2Games), parseInt(req.body.P2Sets));
  context = {};
  if (req.body.P1) {
    temp = score(player1, player2, sets);
    context["sets"] = temp["totalsets"];
    context["player1Score"] = temp["Pl1"].score;
    context["player1Sets"] = temp["Pl1"].sets;
    context["player1Games"] = temp["Pl1"].games;
    context["player2Score"] = temp["Pl2"].score;
    context["player2Sets"] = temp["Pl2"].sets;
    context["player2Games"] = temp["Pl2"].games;

  }
  else if (req.body.P2) {
    temp = score(player2,player1, sets);
    context["sets"] = temp["totalsets"];
    context["player1Score"] = temp["Pl2"].score;
    context["player1Sets"] = temp["Pl2"].sets;
    context["player1Games"] = temp["Pl2"].games;
    context["player2Score"] = temp["Pl1"].score;
    context["player2Sets"] = temp["Pl1"].sets;
    context["player2Games"] = temp["Pl1"].games;
  }
  else if (req.body.Reset) {
    context["sets"] = 1;
    context["player1Score"] = 0;
    context["player1Sets"] = 0;
    context["player1Games"] = 0;
    context["player2Score"] = 0;
    context["player2Sets"] = 0;
    context["player2Games"] = 0;
  }

  res.render('index', context);
});



module.exports = router;
