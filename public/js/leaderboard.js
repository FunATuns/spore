socket.emit("Leaderboard", "overall");
socket.on("Leaderboard", function(inf){
  console.log(inf);
  for(var i = 0; i < inf.length; i++) {
    document.getElementById("board").innerHTML += "<div class='boardpiece'><h1 class='pieceplace'>" + inf[i].place + "</h1><img class='pieceimg' src='" + getAvatarURL(inf[i].username) + "'><div class='pieceusername'>" + inf[i].username + "</div><div class='piecescore'>" + inf[i].score + "</div></div>";
  }
});