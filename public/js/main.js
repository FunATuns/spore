var socket = io.connect("192.168.1.8:7777"); // take your ip out for saftey when pushing
var pointss;

var a=document.getElementsByTagName("a");
linkFix();

function sendReg(user, email, pass, pass2){
  if(pass == pass2){
    socket.emit("Register",{username: user, password: pass, email: email}); // once emited will return with a packets also named Register
  }
  else {
    alert("Passwords do not match!");
  }
}
function start () {
    if( window.navigator.standalone ) {
        startLoadAnim();
    }
    else {
        startAddAppAnim();
    }
}

function sendLogin(user, pass) {
  socket.emit("Login",{username: user, password: pass}); // once emited will return with a packets also named Login
}

socket.on("Register",function (data) {
  /*data will be one of few things
    {
      status: "success/fail"
      type: "" //if fail, will be either "usernameNotUnique", "hasWhiteSpace", or "tooLong"
      key: "" //if success, will return key so you can log the user in
    }
  */
  if(data.status == "success"){
    localStorage.setItem("key", data.key);
    window.location = "profile.html";
  }
  else {
    if(data.type == "usernameNotUnique"){
      alert("Username already taken!");
    }
    else if(data.type == "hasWhiteSpace"){
      alert("Whitespaces in the username are not permitted.");
    }
    else if(data.type == "tooLong"){
      alert("The username is too long!");
    }
    else {
      alert("Unkown error registering, please try again later.");
    }
  }
});

socket.on("Login",function (data) {
  /*data will be one of few things
    {
      status: "success/fail"
      type: "" //if fail, will be either "wrongPassword", "accountDoesntExist"
      key: "" //if success, will return key so you can log the user in
    }
  */
  if(data.status == "success"){
    localStorage.setItem("key", data.key);
    window.location = "profile.html";
  }
  else {
    if(data.type == "wrongPassword"){
      alert("Incorrect Password!");
    }
    else if(data.type == "accountDoesntExist"){
      alert("An account with this username does not seem to exist. Or your account has been decomposed by a rather large mushroom. Either way, whatever you're doing isn't working.");
    }
    else {
      alert("Unkown error logging in, please try again later.");
    }
  }
});

//Prevent links from opening in safari

function linkFix() {
  for(var i=0;i<a.length;i++){
    a[i].onclick=function(){
      window.location=this.getAttribute("href");
      return false;
    }
  }
}

function logout(){
  localStorage.removeItem("key");
  window.location = "login.html";
}

function grabProf(){
  socket.emit("Profile", {
    key: localStorage.getItem("key"), 
    username: getParameterByName("username")
  });
}

//username, admin, points, hasPoints, lastPointTime, email

socket.on("Profile", function(inf) {
  document.getElementById("userPlace").innerHTML = inf.profile.username;
  document.getElementById("ptsholder").innerHTML = inf.profile.points;
  document.getElementById("bio").innerHTML = inf.profile.bio;
  if(getParameterByName("username") == undefined || getParameterByName("username") == null) {
    document.getElementById("editProf").innerHTML = "edit";
    document.getElementById("givept").style.backgroundColor = "#a0a0a0";
    document.getElementById("givept").setAttribute("onClick", "alert('You cant give a point to yourself you buffoon!')");
  }
});

function getParameterByName(name, url) { 
  if (!url)  
    url = window.location.href; 
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url); 
  if (!results) 
    return null; 
  if (!results[2]) 
    return ''; 
  return decodeURIComponent(results[2].replace(/\+/g, " ")); 
}