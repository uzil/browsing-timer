var msgArea = document.getElementById("msg");
var closeBtn = document.getElementById("close-btn");


msgArea.innerHTML = '<h4>Your time is Up</h4>';



 
closeBtn.onclick = function (){
	self.port.emit("clicked");
};